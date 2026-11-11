"use strict";
// Mesclagem do progresso deste navegador com o da conta (Supabase). Funções puras, sem rede.
// Regras: docs/superpowers/specs/2026-11-11-login-github-supabase-design.md.

// O que vai para a nuvem: rascunhos (codeDrafts), simulado em andamento (pendingExam) e o dono
// da cópia local (owner) ficam só no navegador.
const CLOUD_FIELDS = ["version", "attempts", "cycles", "exams", "baseAt"];

function cloudCopy(s) {
  const out = {};
  for (const k of CLOUD_FIELDS) if (s[k] !== undefined) out[k] = s[k];
  return out;
}

// Confere só o formato. Não confere se o exercício existe nesta versão do site: uma cópia
// desatualizada não conhece exercícios novos e não pode apagá-los da nuvem.
function validCloudState(s) {
  return (
    !!s &&
    typeof s === "object" &&
    s.version === 1 &&
    Array.isArray(s.attempts) &&
    s.attempts.every(
      (a) =>
        !!a &&
        typeof a.id === "string" &&
        Number.isFinite(a.time) &&
        typeof a.mode === "string" &&
        Number.isInteger(a.variant) &&
        typeof a.correct === "boolean" &&
        typeof a.assisted === "boolean",
    ) &&
    Array.isArray(s.exams) &&
    s.exams.every((e) => !!e && Number.isFinite(e.time)) &&
    Number.isInteger(s.cycles) &&
    s.cycles >= 0 &&
    (s.baseAt === undefined || Number.isFinite(s.baseAt))
  );
}

const attemptKey = (a) => `${a.id}|${a.time}|${a.mode}|${a.variant}`;
const examKey = (e) => String(e.time);

// Junta duas listas pela chave. Mantém os objetos de `mine` (a tela guarda referências às
// tentativas deste navegador) e devolve tudo em ordem cronológica.
function unite(mine, theirs, key, onBoth) {
  const seen = new Map(mine.map((x) => [key(x), x]));
  const out = [...mine];
  for (const x of theirs) {
    const k = key(x);
    if (seen.has(k)) onBoth?.(seen.get(k), x);
    else {
      seen.set(k, x);
      out.push(x);
    }
  }
  return out.sort((a, b) => a.time - b.time);
}

// Se a mesma tentativa foi marcada como "com ajuda" em qualquer lado, ela fica com ajuda.
const keepAssisted = (a, b) => {
  if (b.assisted) a.assisted = true;
};

// Mescla `mine` (este navegador) com `theirs` (a conta). Apagar o histórico ou importar um backup
// grava baseAt: o lado com o baseAt mais recente vale, mais o que o outro registrou depois dele.
// Sem isso, um aparelho com dados antigos ressuscitaria o histórico apagado.
function mergeStates(mine, theirs) {
  const mb = mine.baseAt || 0,
    tb = theirs.baseAt || 0,
    base = Math.max(mb, tb),
    after = (x) => x.time > base;
  const pick = (list, side) => (side === base || mb === tb ? list : list.filter(after));
  const out = {
    version: 1,
    attempts: unite(pick(mine.attempts, mb), pick(theirs.attempts, tb), attemptKey, keepAssisted),
    exams: unite(pick(mine.exams, mb), pick(theirs.exams, tb), examKey),
    cycles:
      mb === tb ? Math.max(mine.cycles, theirs.cycles) : mb > tb ? mine.cycles : theirs.cycles,
  };
  if (base) out.baseAt = base;
  return out;
}
