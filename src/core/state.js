"use strict";
// Estado persistido no localStorage e estatísticas de progresso.

const KEY = "massanori-python-v1";

let storageOK = true,
  state = { version: 1, attempts: [], cycles: 0, exams: [] };
loadState();

// Carrega o histórico salvo. Registros de exercícios que não existem mais são descartados
// (sem isso, uma atualização de conteúdo invalidaria tudo e a próxima gravação apagaria o
// histórico). Sempre que algo é descartado, o conteúdo original fica guardado em outra chave.
function loadState() {
  let raw;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    storageOK = false;
    return;
  }
  if (!raw) return;
  try {
    const s = JSON.parse(raw);
    const removed = repairState(s);
    validateState(s);
    state = s;
    if (removed) {
      keepOriginal(raw);
      toast(
        `${removed} registro(s) de exercícios que não existem mais foram removidos do histórico.`,
      );
    }
  } catch {
    keepOriginal(raw);
    storageOK = false;
  }
}

function keepOriginal(raw) {
  try {
    localStorage.setItem(`${KEY}-original-${Date.now()}`, raw);
  } catch {
    // sem espaço: o aviso de armazenamento já orienta a exportar um backup
  }
}

function validAttempt(a) {
  return (
    !!a &&
    !!byId(a.id) &&
    typeof a.correct === "boolean" &&
    typeof a.assisted === "boolean" &&
    Number.isFinite(a.time) &&
    Number.isInteger(a.variant) &&
    a.variant >= 0 &&
    a.variant < byId(a.id).variants.length &&
    typeof a.answer === "string" &&
    typeof a.mode === "string"
  );
}

// Remove tentativas e rascunhos que não correspondem mais ao conteúdo. Devolve quantos saíram.
function repairState(s) {
  if (!s || !Array.isArray(s.attempts)) return 0;
  const before = s.attempts.length;
  s.attempts = s.attempts.filter(validAttempt);
  let removed = before - s.attempts.length;
  if (s.codeDrafts && typeof s.codeDrafts === "object" && !Array.isArray(s.codeDrafts))
    for (const id of Object.keys(s.codeDrafts))
      if (!byId(id)) {
        delete s.codeDrafts[id];
        removed++;
      }
  return removed;
}

function validateState(s) {
  if (
    !s ||
    s.version !== 1 ||
    !Array.isArray(s.attempts) ||
    !Array.isArray(s.exams) ||
    !Number.isInteger(s.cycles) ||
    s.cycles < 0
  )
    throw Error("Formato inválido");
  if (!s.attempts.every(validAttempt)) throw Error("Tentativas inválidas");
  if (
    s.codeDrafts &&
    (typeof s.codeDrafts !== "object" ||
      Array.isArray(s.codeDrafts) ||
      Object.entries(s.codeDrafts).some(
        ([id, d]) => !byId(id) || !d || typeof d.code !== "string" || typeof d.stdin !== "string",
      ))
  )
    throw Error("Rascunhos de código inválidos");
  if (
    s.exams.some(
      (e) =>
        !Number.isFinite(e.score) ||
        !Number.isFinite(e.total) ||
        !Number.isFinite(e.time) ||
        e.score < 0 ||
        e.score > e.total,
    )
  )
    throw Error("Simulados inválidos");
}

// Grava no navegador e avisa a sincronização com a conta (src/core/cloud.js), se houver.
function save() {
  saveLocal();
  if (typeof cloudSaved === "function") cloudSaved();
}

function saveLocal() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOK = true;
  } catch (e) {
    storageOK = false;
    toast("Não foi possível salvar. Exporte um backup do histórico.");
  }
}

// Estado vazio de "Apagar histórico" e base de "Importar backup". baseAt marca a troca, para a
// mesclagem com a nuvem não trazer de volta o que foi apagado; owner diz de qual conta é a cópia.
function freshState(from = { version: 1, attempts: [], cycles: 0, exams: [] }) {
  const s = { ...from, baseAt: Date.now() };
  if (state.owner) s.owner = state.owner;
  else delete s.owner;
  return s;
}

const attempts = (id) => state.attempts.filter((a) => a.id === id);

function stats(id) {
  const a = id ? attempts(id) : state.attempts;
  return {
    n: a.length,
    ok: a.filter((x) => x.correct).length,
    independent: a.filter((x) => x.correct && !x.assisted).length,
    last: a.at(-1),
  };
}

function weakness(e) {
  const a = attempts(e.id).slice(-5);
  if (!a.length) return 0.7;
  return 1 - a.reduce((s, x) => s + (x.correct ? (x.assisted ? 0.5 : 1) : 0), 0) / a.length;
}

function topicStats() {
  const topics = [...new Set(EXERCISES.flatMap((e) => e.topics))];
  return topics
    .map((t) => {
      const ids = EXERCISES.filter((e) => e.topics.includes(t)).map((e) => e.id),
        a = state.attempts.filter((a) => ids.includes(a.id)).slice(-20);
      return {
        topic: t,
        n: a.length,
        rate: a.length
          ? Math.round((a.filter((x) => x.correct && !x.assisted).length / a.length) * 100)
          : null,
      };
    })
    .sort((a, b) => (a.rate ?? -1) - (b.rate ?? -1));
}
