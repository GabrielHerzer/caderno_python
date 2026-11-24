"use strict";
// Login com GitHub e progresso na conta (Supabase). Sem conta, sem internet, aberto por file:// ou
// com o CDN fora do ar, o site funciona como antes: tudo fica no localStorage (state.js).
//
// - Na primeira vez que algo entra no histórico sem sessão, um diálogo oferece o login.
// - O login abre numa janela popup (auth-callback.html), para a tela atual não recarregar.
// - Com sessão, cada gravação agenda um envio: lê a conta, mescla (sync.js) e grava os dois lados.
// - Só contas do GitHub autorizadas no banco gravam; as outras voltam a usar só o navegador.

const LOGIN_ASKED_KEY = `${KEY}-login-perguntado`,
  LOGIN_RETURN_KEY = `${KEY}-login-volta`,
  SYNC_DELAY = 1500;

let cloud = null,
  cloudUser = null,
  cloudReady = false,
  cloudStatus = "indisponivel", // indisponivel | arquivo | local | sincronizando | sincronizado | sem-conexao
  cloudTimer = null,
  cloudQueue = Promise.resolve(),
  cloudSent = "",
  cloudProgress = 0;

const progressSize = () => state.attempts.length + state.exams.length + state.cycles;

function initCloud() {
  cloudProgress = progressSize();
  if (!/^https?:$/.test(location.protocol)) {
    cloudStatus = "arquivo";
    return renderAccount();
  }
  if (!window.supabase?.createClient || typeof SUPABASE_CONFIG === "undefined")
    return renderAccount();
  try {
    cloud = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key, {
      auth: { flowType: "pkce", detectSessionInUrl: false, persistSession: true },
    });
  } catch {
    return renderAccount();
  }
  cloudStatus = "local";
  // Chamadas ao Supabase dentro do onAuthStateChange travam o cliente; por isso o setTimeout.
  cloud.auth.onAuthStateChange((event, session) => setTimeout(() => cloudSession(session), 0));
  // A janela de login avisa quando terminou (a sessão já está no localStorage desta origem).
  window.addEventListener("message", async (ev) => {
    if (ev.origin !== location.origin || ev.data?.type !== "caderno-login") return;
    const { data } = await cloud.auth.getSession();
    cloudSession(data.session);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && cloudUser) queueSync();
  });
  $("#account")?.addEventListener("click", (ev) => {
    const action = ev.target.closest("[data-account]")?.dataset.account;
    if (action === "entrar") loginGitHub();
    if (action === "sair") logout();
  });
  renderAccount();
}

function cloudSession(session) {
  const user = session?.user || null;
  cloudReady = true;
  if (user?.id === cloudUser?.id) return; // renovação do token, nada muda
  cloudUser = user;
  if (!user) {
    cloudStatus = "local";
    return renderAccount();
  }
  closeLoginDialog();
  queueSync();
}

// Chamado por save() depois de gravar no navegador.
function cloudSaved() {
  const grew = progressSize() > cloudProgress;
  cloudProgress = progressSize();
  if (!cloudUser) {
    if (grew) askLogin();
    return;
  }
  if (JSON.stringify(cloudCopy(state)) === cloudSent) return; // ex.: só o simulado em andamento mudou
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(queueSync, SYNC_DELAY);
}

function queueSync() {
  clearTimeout(cloudTimer);
  cloudQueue = cloudQueue.then(syncNow).catch(() => {
    cloudStatus = "sem-conexao";
    renderAccount();
  });
  return cloudQueue;
}

async function syncNow() {
  if (!cloud || !cloudUser) return;
  const uid = cloudUser.id;
  cloudStatus = "sincronizando";
  renderAccount();
  const { data, error } = await cloud
    .from("progress")
    .select("state")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) throw error;
  const remote = data?.state;
  if (remote && !validCloudState(remote)) {
    toast("O progresso guardado na sua conta está num formato inesperado. Nada foi enviado.");
    throw Error("estado da nuvem inválido");
  }
  // A cópia local de outra conta não se mistura com esta: fica guardada como backup.
  const otherOwner = !!state.owner && state.owner !== uid;
  const mine = otherOwner ? { version: 1, attempts: [], cycles: 0, exams: [] } : cloudCopy(state);
  const merged = remote ? mergeStates(mine, remote) : mine;
  if (!remote || JSON.stringify(merged) !== JSON.stringify(remote)) {
    const { error: sent } = await cloud.from("progress").upsert({ user_id: uid, state: merged });
    if (sent?.code === "42501") return denied();
    if (sent) throw sent;
  }
  if (cloudUser?.id !== uid) return; // a conta mudou no meio do envio
  applyMerged(merged, uid, otherOwner);
  cloudStatus = "sincronizado";
  renderAccount();
}

// Leva o resultado para a tela. Tentativas de exercícios que esta versão do site não conhece
// continuam na nuvem, mas não entram no estado local.
function applyMerged(merged, uid, otherOwner) {
  const view = { ...merged, attempts: [...merged.attempts], exams: [...merged.exams] };
  repairState(view);
  try {
    validateState(view);
  } catch {
    toast("Não foi possível usar o progresso da sua conta neste navegador.");
    return;
  }
  const before = JSON.stringify(cloudCopy(state));
  if (otherOwner) {
    keepOriginal(JSON.stringify(state));
    resetCodingSession();
    active = cycle = exam = null;
    delete state.codeDrafts;
    delete state.pendingExam;
  }
  state.attempts = view.attempts;
  state.exams = view.exams;
  state.cycles = view.cycles;
  if (view.baseAt) state.baseAt = view.baseAt;
  else delete state.baseAt;
  state.owner = uid;
  cloudSent = JSON.stringify(cloudCopy(state));
  cloudProgress = progressSize();
  saveLocal();
  // Redesenha só telas de consulta: no meio de um exercício, a tela atual continua igual.
  const quiet = ["", "#inicio", "#catalogo", "#historico", "#fontes"];
  if (otherOwner || (cloudSent !== before && quiet.includes(location.hash))) render();
}

async function denied() {
  try {
    localStorage.setItem(LOGIN_ASKED_KEY, "1");
  } catch {}
  await cloud.auth.signOut({ scope: "local" });
  cloudUser = null;
  cloudStatus = "local";
  renderAccount();
  toast(
    "Sua conta do GitHub não está liberada para salvar na nuvem. O progresso continua salvo neste navegador.",
  );
}

function loginGitHub() {
  if (!cloud) return;
  // A janela abre já no clique (senão o navegador a bloqueia) e só depois recebe o endereço.
  const popup = window.open("", "caderno-login", "width=520,height=700");
  const back = new URL("auth-callback.html", location.href);
  back.search = back.hash = "";
  cloud.auth
    .signInWithOAuth({
      provider: "github",
      options: { redirectTo: back.href, skipBrowserRedirect: true },
    })
    .then(({ data, error }) => {
      if (error) throw error;
      if (popup && !popup.closed) popup.location.href = data.url;
      else {
        // Sem popup: a página vai ao GitHub e volta para a mesma rota.
        try {
          localStorage.setItem(LOGIN_RETURN_KEY, location.hash);
        } catch {}
        location.href = data.url;
      }
    })
    .catch(() => {
      popup?.close();
      toast("Não foi possível abrir o login do GitHub. Tente de novo em instantes.");
    });
}

async function logout() {
  await cloud.auth.signOut({ scope: "local" });
  cloudSession(null);
  toast("Você saiu da conta. O progresso continua neste navegador.");
}

function askLogin() {
  if (!cloud || !cloudReady || cloudUser || state.owner || $("#login-dialog")) return;
  try {
    if (localStorage.getItem(LOGIN_ASKED_KEY)) return;
  } catch {
    return;
  }
  const box = document.createElement("div");
  box.id = "login-dialog";
  box.className = "modal";
  box.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="login-title"><h2 id="login-title">${icon("cloud")} Guardar seu progresso?</h2><p>Sua resposta já está salva neste navegador. Entrando com o GitHub, o progresso fica na sua conta e aparece em qualquer computador.</p><div class="actions"><button class="primary" data-login="entrar">${icon("github")} Entrar com GitHub</button><button data-login="depois">Continuar sem conta</button></div></div>`;
  document.body.appendChild(box);
  const decline = () => {
    try {
      localStorage.setItem(LOGIN_ASKED_KEY, "1");
    } catch {}
    closeLoginDialog();
  };
  box.querySelector('[data-login="entrar"]').onclick = () => {
    loginGitHub();
    closeLoginDialog();
  };
  box.querySelector('[data-login="depois"]').onclick = decline;
  box.addEventListener("keydown", (ev) => ev.key === "Escape" && decline());
  box.querySelector("button").focus();
}

function closeLoginDialog() {
  $("#login-dialog")?.remove();
}

function renderAccount() {
  const el = $("#account");
  if (!el) return;
  const name = cloudUser?.user_metadata?.user_name;
  const who = name ? `@${esc(name)}` : "sua conta";
  // Foto do perfil do GitHub (vem no login); só endereços https, e some se não carregar.
  const url = cloudUser?.user_metadata?.avatar_url;
  const avatar = /^https:\/\//.test(url || "")
    ? `<img class="avatar" src="${esc(url)}" alt="" width="20" height="20" referrerpolicy="no-referrer" onerror="this.remove()">`
    : "";
  const views = {
    indisponivel: `<span class="dot"></span> Progresso neste navegador`,
    arquivo: `<span class="dot"></span> Salvo só neste navegador<small class="account-note">Para entrar com o GitHub, abra pelo INICIAR ou pelo site publicado.</small>`,
    local: `<span class="dot"></span> Salvo só neste navegador · <button class="link" data-account="entrar">Entrar</button>`,
    sincronizando: `${avatar}${icon("refresh-cw")} Sincronizando ${who}…`,
    sincronizado: `${avatar}Salvo em ${who} · <button class="link" data-account="sair">Sair</button>`,
    "sem-conexao": `${avatar}${icon("cloud-off")} Sem conexão, salvo neste navegador · <button class="link" data-account="sair">Sair</button>`,
  };
  el.innerHTML = views[cloudStatus];
}
