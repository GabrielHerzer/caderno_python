"use strict";
// Login com GitHub e progresso na conta (src/core/cloud.js e src/core/sync.js), com um Supabase falso.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { KEY, tick, boot, global, stored, go, attempt, githubSession } = require("./helpers");

const JOAO = "uid-joao",
  OUTRO = "uid-outro";
const saved = (extra = {}) =>
  JSON.stringify({ version: 1, cycles: 0, exams: [], attempts: [], ...extra });
const sync = (w) => global(w, "cloudQueue");
const account = (w) => w.document.querySelector("#account").textContent.replace(/\s+/g, " ");

// Registra uma tentativa como as telas fazem: push no estado e save().
const answer = (w, id, extra = {}) =>
  w.eval(`state.attempts.push(${JSON.stringify(attempt(id, extra))}); save();`);

test("mescla: une tentativas e simulados, mantém 'com ajuda' e o maior número de ciclos", async () => {
  const w = await boot();
  const mine = {
    version: 1,
    cycles: 2,
    exams: [{ time: 5 }],
    attempts: [attempt("first_last6", { time: 10 }), attempt("near_ten", { time: 30 })],
  };
  const theirs = {
    version: 1,
    cycles: 3,
    exams: [{ time: 5 }, { time: 7 }],
    attempts: [
      attempt("first_last6", { time: 10, assisted: true }),
      attempt("exercicio_novo", { time: 20 }),
    ],
  };
  const keep = mine.attempts[0];
  const m = w.mergeStates(mine, theirs);
  assert.deepEqual(
    Array.from(m.attempts, (a) => a.time),
    [10, 20, 30],
  );
  assert.equal(m.attempts[0], keep, "mantém o objeto deste navegador");
  assert.equal(keep.assisted, true);
  assert.deepEqual(
    Array.from(m.exams, (e) => e.time),
    [5, 7],
  );
  assert.equal(m.cycles, 3);
  assert.equal(m.baseAt, undefined);
});

test("mescla: depois de apagar o histórico, só volta o que o outro lado registrou depois", async () => {
  const w = await boot();
  const apagado = { version: 1, cycles: 0, exams: [], attempts: [], baseAt: 100 };
  const antigo = {
    version: 1,
    cycles: 4,
    exams: [{ time: 50 }, { time: 150 }],
    attempts: [attempt("first_last6", { time: 50 }), attempt("near_ten", { time: 150 })],
  };
  for (const m of [w.mergeStates(apagado, antigo), w.mergeStates(antigo, apagado)]) {
    assert.deepEqual(
      Array.from(m.attempts, (a) => a.time),
      [150],
    );
    assert.deepEqual(
      Array.from(m.exams, (e) => e.time),
      [150],
    );
    assert.equal(m.cycles, 0);
    assert.equal(m.baseAt, 100);
  }
});

test("sem conta: a primeira resposta grava no navegador e oferece o login uma vez só", async () => {
  const server = {};
  const w = await boot({ supabase: server });
  await tick();
  assert.match(account(w), /Salvo só neste navegador · Entrar/);
  assert.equal(w.document.querySelector("#login-dialog"), null);

  answer(w, "first_last6");
  await tick();
  const dialog = w.document.querySelector("#login-dialog");
  assert.ok(dialog, "diálogo aparece");
  assert.equal(stored(w).attempts.length, 1, "a resposta já foi gravada");
  assert.ok(dialog.querySelector("svg.icon"), "ícones do Lucide");

  dialog.querySelector('[data-login="depois"]').click();
  assert.equal(w.document.querySelector("#login-dialog"), null);
  answer(w, "near_ten");
  assert.equal(w.document.querySelector("#login-dialog"), null, "não pergunta de novo");
  assert.equal(stored(w).attempts.length, 2);
  assert.equal(server.calls.filter((c) => c[0] !== "signInWithOAuth").length, 0);
});

test("simulado em andamento não abre o diálogo; só o que entra no histórico", async () => {
  const w = await boot({ supabase: {} });
  await tick();
  w.eval("state.pendingExam = undefined; save();");
  assert.equal(w.document.querySelector("#login-dialog"), null);
});

test("'Entrar com GitHub' abre o popup e volta por auth-callback.html", async () => {
  const server = {};
  const popup = { closed: false, location: {}, close() {} };
  const w = await boot({ supabase: server, before: (w) => (w.open = () => popup) });
  await tick();
  answer(w, "first_last6");
  w.document.querySelector('[data-login="entrar"]').click();
  await tick();
  const [, args] = server.calls.find((c) => c[0] === "signInWithOAuth");
  assert.equal(args.provider, "github");
  assert.equal(args.options.skipBrowserRedirect, true);
  assert.equal(args.options.redirectTo, "http://127.0.0.1:8765/auth-callback.html");
  assert.equal(popup.location.href, "https://github.test/login");
  assert.equal(server.options.auth.flowType, "pkce");
});

test("ao entrar, o progresso local sobe para a conta e o da conta desce", async () => {
  const server = {
    session: githubSession(JOAO, "JohnPetros"),
    allowed: [JOAO],
    rows: { [JOAO]: JSON.parse(saved({ attempts: [attempt("near_ten", { time: 5 })] })) },
  };
  const w = await boot({
    supabase: server,
    storage: saved({ attempts: [attempt("first_last6", { time: 9 })], codeDrafts: {} }),
  });
  await tick();
  await sync(w);
  assert.deepEqual(
    server.rows[JOAO].attempts.map((a) => a.id),
    ["near_ten", "first_last6"],
  );
  assert.equal(server.rows[JOAO].codeDrafts, undefined, "rascunhos ficam no navegador");
  assert.equal(server.rows[JOAO].owner, undefined);
  const local = stored(w);
  assert.equal(local.attempts.length, 2);
  assert.equal(local.owner, JOAO);
  assert.match(account(w), /Salvo em @JohnPetros · Sair/);
  const avatar = w.document.querySelector("#account img.avatar");
  assert.equal(avatar.src, `https://avatars.githubusercontent.com/u/${JOAO}`);
  assert.equal(avatar.alt, "");
  assert.equal(w.document.querySelector("#login-dialog"), null);
});

test("com sessão, cada resposta é enviada para a conta", async () => {
  const server = { session: githubSession(JOAO, "JohnPetros"), allowed: [JOAO] };
  const w = await boot({ supabase: server });
  await tick();
  await sync(w);
  answer(w, "first_last6", { time: 77 });
  assert.equal(w.document.querySelector("#login-dialog"), null);
  await w.queueSync();
  assert.deepEqual(
    server.rows[JOAO].attempts.map((a) => a.time),
    [77],
  );
});

test("conta fora da lista: sai da conta, avisa e não mexe no progresso local", async () => {
  const server = { session: githubSession(OUTRO, "alguem") };
  const local = saved({ attempts: [attempt("first_last6")] });
  const w = await boot({ supabase: server, storage: local });
  await tick();
  await sync(w);
  await tick();
  assert.equal(server.session, null);
  assert.match(w.document.querySelector("#toast").textContent, /não está liberada/);
  assert.equal(stored(w).owner, undefined);
  assert.equal(stored(w).attempts.length, 1);
  assert.match(account(w), /Salvo só neste navegador · Entrar/);
});

test("outra conta no mesmo navegador: não mistura, guarda a cópia anterior como backup", async () => {
  const server = {
    session: githubSession(JOAO, "JohnPetros"),
    allowed: [JOAO],
    rows: { [JOAO]: JSON.parse(saved({ attempts: [attempt("near_ten", { time: 5 })] })) },
  };
  const w = await boot({
    supabase: server,
    storage: saved({ owner: "uid-gabriel", attempts: [attempt("first_last6", { time: 9 })] }),
  });
  await tick();
  await sync(w);
  assert.deepEqual(
    server.rows[JOAO].attempts.map((a) => a.id),
    ["near_ten"],
  );
  assert.deepEqual(
    stored(w).attempts.map((a) => a.id),
    ["near_ten"],
  );
  assert.equal(stored(w).owner, JOAO);
  const backup = Object.keys(w.localStorage).find((k) => k.startsWith(`${KEY}-original-`));
  assert.ok(backup, "cópia anterior guardada");
  assert.equal(JSON.parse(w.localStorage.getItem(backup)).owner, "uid-gabriel");
});

test("exercícios que esta versão não conhece ficam na conta, fora da tela", async () => {
  const server = {
    session: githubSession(JOAO, "JohnPetros"),
    allowed: [JOAO],
    rows: {
      [JOAO]: JSON.parse(saved({ attempts: [attempt("exercicio_do_futuro", { time: 5 })] })),
    },
  };
  const w = await boot({ supabase: server, storage: saved({ attempts: [attempt("near_ten")] }) });
  await tick();
  await sync(w);
  assert.deepEqual(server.rows[JOAO].attempts.map((a) => a.id).sort(), [
    "exercicio_do_futuro",
    "near_ten",
  ]);
  assert.deepEqual(
    stored(w).attempts.map((a) => a.id),
    ["near_ten"],
  );
  answer(w, "first_last6", { time: 2e12 });
  await w.queueSync();
  assert.ok(server.rows[JOAO].attempts.some((a) => a.id === "exercicio_do_futuro"));
});

test("apagar o histórico com sessão apaga também na conta", async () => {
  const server = {
    session: githubSession(JOAO, "JohnPetros"),
    allowed: [JOAO],
    rows: { [JOAO]: JSON.parse(saved({ attempts: [attempt("near_ten", { time: 5 })] })) },
  };
  let asked = "";
  const w = await boot({ supabase: server });
  w.confirm = (text) => ((asked = text), true);
  await tick();
  await sync(w);
  await go(w, "historico");
  w.document.querySelector('[data-action="reset"]').click();
  assert.match(asked, /na sua conta/);
  await w.queueSync();
  assert.deepEqual(server.rows[JOAO].attempts, []);
  assert.ok(server.rows[JOAO].baseAt > 0);
  assert.equal(stored(w).owner, JOAO);
});

test("sem conexão: continua salvando no navegador e avisa no menu", async () => {
  const server = { session: githubSession(JOAO, "JohnPetros"), allowed: [JOAO], offline: true };
  const w = await boot({ supabase: server });
  await tick();
  await sync(w);
  assert.match(account(w), /Sem conexão, salvo neste navegador/);
  answer(w, "first_last6");
  assert.equal(stored(w).attempts.length, 1);
  assert.equal(w.document.querySelector("#login-dialog"), null);
  server.offline = false;
  await w.queueSync();
  assert.equal(server.rows[JOAO].attempts.length, 1);
  assert.match(account(w), /Salvo em @JohnPetros/);
});

test("sair da conta mantém a cópia local", async () => {
  const server = { session: githubSession(JOAO, "JohnPetros"), allowed: [JOAO] };
  const w = await boot({ supabase: server, storage: saved({ attempts: [attempt("near_ten")] }) });
  await tick();
  await sync(w);
  w.document.querySelector('[data-account="sair"]').click();
  await tick();
  assert.match(account(w), /Salvo só neste navegador · Entrar/);
  assert.equal(stored(w).attempts.length, 1);
  answer(w, "first_last6");
  assert.equal(w.document.querySelector("#login-dialog"), null, "conta já usada aqui: não insiste");
});

test("aberto por file://, não oferece login e explica como entrar", async () => {
  const w = await boot({ supabase: {}, url: "file:///C:/caderno/index.html" });
  await tick();
  assert.match(account(w), /abra pelo INICIAR ou pelo site publicado/);
  answer(w, "first_last6");
  assert.equal(w.document.querySelector("#login-dialog"), null);
  // O jsdom não tem localStorage em file:// (o navegador tem); confere o estado em memória.
  assert.equal(global(w, "state.attempts.length"), 1);
});

test("sem o CDN do Supabase, o site funciona só com o navegador", async () => {
  const w = await boot();
  await tick();
  assert.match(account(w), /Progresso neste navegador/);
  answer(w, "first_last6");
  assert.equal(stored(w).attempts.length, 1);
  assert.deepEqual(w.__errors, []);
});

test("supabase-js vem do CDN numa versão fixa, com integridade igual à do npm", () => {
  const pkg = require("@supabase/supabase-js/package.json");
  const file = fs.readFileSync(require.resolve("@supabase/supabase-js/dist/umd/supabase.js"));
  const hash =
    "sha384-" + require("node:crypto").createHash("sha384").update(file).digest("base64");
  for (const page of ["index.html", "auth-callback.html"]) {
    const html = fs.readFileSync(path.join(__dirname, "..", page), "utf8");
    const tag = html.match(
      /<script\s+src="(https:\/\/cdn[^"]+supabase-js[^"]+)"\s+integrity="([^"]+)"\s+crossorigin="anonymous"/,
    );
    assert.ok(tag, page);
    assert.equal(
      tag[1],
      `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${pkg.version}/dist/umd/supabase.js`,
    );
    assert.equal(tag[2], hash, page);
  }
});
