"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  KEY,
  tick,
  boot,
  global,
  stored,
  go,
  type,
  backupFile,
  attempt,
  checkCode,
} = require("./helpers");

test("histórico salvo com exercício que não existe mais: mantém as tentativas válidas", async () => {
  const saved = {
    version: 1,
    cycles: 3,
    exams: [],
    attempts: [
      attempt("fixa"),
      attempt("arroz"),
      attempt("exercicio_removido"),
      attempt("near_ten"),
    ],
  };
  const w = await boot({ storage: JSON.stringify(saved) });
  await go(w, "codigo");
  type(w, "#python-editor", "def f(): pass"); // qualquer gravação

  const s = stored(w);
  assert.deepEqual(
    s.attempts.map((a) => a.id),
    ["fixa", "arroz", "near_ten"],
  );
  assert.equal(s.cycles, 3);
});

test("histórico salvo com variante que não existe mais: descarta só essa tentativa", async () => {
  const saved = {
    version: 1,
    cycles: 0,
    exams: [],
    attempts: [attempt("fixa"), attempt("near_ten", { variant: 99 })],
  };
  const w = await boot({ storage: JSON.stringify(saved) });
  await go(w, "codigo");
  type(w, "#python-editor", "def f(): pass");

  assert.deepEqual(
    stored(w).attempts.map((a) => a.id),
    ["fixa"],
  );
});

test("histórico salvo corrompido: os dados originais continuam guardados no navegador", async () => {
  const raw = '{"version":1,"attempts":[{"id":"fixa"'; // JSON cortado
  const w = await boot({ storage: raw });
  await go(w, "codigo");
  type(w, "#python-editor", "def f(): pass");

  const values = Object.keys(w.localStorage).map((k) => w.localStorage.getItem(k));
  assert.ok(values.includes(raw), "o conteúdo original deveria continuar em alguma chave");
  assert.ok(w.document.querySelector(".storage-warning"), "o aviso de armazenamento deve aparecer");
});

test("histórico reparado: os dados originais também ficam guardados", async () => {
  const raw = JSON.stringify({ version: 1, cycles: 0, exams: [], attempts: [attempt("removido")] });
  const w = await boot({ storage: raw });
  await go(w, "codigo");
  type(w, "#python-editor", "def f(): pass");

  const values = Object.keys(w.localStorage).map((k) => w.localStorage.getItem(k));
  assert.ok(values.includes(raw));
});

test("depois de importar backup, a oficina exige nova tentativa antes de liberar a dica", async () => {
  const w = await boot();
  await checkCode(w, "near_ten");
  const backup = {
    version: 1,
    cycles: 0,
    exams: [],
    attempts: [attempt("fixa"), attempt("arroz")],
  };
  await w.importBackup(backupFile(backup));
  await go(w, "inicio");
  await go(w, "codigo");

  assert.equal(w.document.querySelector("#code-hint"), null);
  assert.equal(w.document.querySelector("#code-solution"), null);
  assert.equal(stored(w).attempts[0].assisted, false);
});

test("depois de apagar o histórico, a oficina exige nova tentativa antes de liberar a solução", async () => {
  const w = await boot();
  await checkCode(w, "near_ten");
  w.action("reset");
  await go(w, "codigo");

  assert.equal(stored(w).attempts.length, 0);
  assert.equal(w.document.querySelector("#code-solution"), null);
  assert.equal(w.document.querySelector("#code-hint"), null);
});

async function gradingExam() {
  const w = await boot({ workerDelay: 30, hash: "simulado" });
  w.action("start-exam");
  global(w, 'for (let i = 0; i < 8; i++) exam.answers[i] = "def f(): pass"');
  w.persistExam();
  const grading = w.finishExam();
  await tick(5);
  assert.equal(global(w, "examGrading"), true, "a correção deveria estar em andamento");
  await go(w, "historico"); // o botão Importar backup fica no histórico
  return { w, grading };
}

test("durante a correção do simulado, importar backup é recusado e a correção termina", async () => {
  const { w, grading } = await gradingExam();
  const backup = { version: 1, cycles: 0, exams: [], attempts: [attempt("fixa")] };
  await w.importBackup(backupFile(backup));
  await grading;

  const s = stored(w);
  assert.equal(s.exams.length, 1, "o simulado corrigido deve ser registrado");
  assert.equal(s.attempts.length, 8);
  assert.match(w.document.querySelector("#toast").textContent, /correção/);
});

test("durante a correção do simulado, o botão Importar backup não abre o seletor de arquivo", async () => {
  const { w, grading } = await gradingExam();
  let opened = false;
  w.document.querySelector("#import-file").click = () => (opened = true);
  w.action("import");
  await grading;

  assert.equal(opened, false);
});

test("o app carrega sem erros de JavaScript", async () => {
  const w = await boot();
  for (const r of ["inicio", "catalogo", "revisao", "codigo", "simulado", "historico", "fontes"])
    await go(w, r);
  assert.deepEqual(w.__errors, []);
  assert.equal(w.localStorage.getItem(KEY), null, "abrir telas não deve gravar nada");
});
