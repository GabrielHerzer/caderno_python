"use strict";
// Simulados sorteados por prova (EXAM_PLANS em src/features/exam.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const { tick, boot, global, stored } = require("./helpers");

const plans = (w) => global(w, "Object.keys(EXAM_PLANS)");

test("cada prova sorteia questões sem repetir, só dos grupos da rodada", async () => {
  const w = await boot({ hash: "simulado" });
  for (const plan of plans(w)) {
    for (let round = 0; round < 20; round++) {
      const items = global(w, `drawExam(${JSON.stringify(plan)})`);
      assert.equal(items.length, global(w, `planSize("${plan}")`), plan);
      assert.equal(new Set(items.map((x) => x.id)).size, items.length, `${plan}: sem repetir`);
      for (const x of items) assert.ok(global(w, `validPlanItem("${plan}", ${JSON.stringify(x)})`));
    }
  }
});

test("a Sub mistura P1, P2, ENADE e teste de mesa, e não usa a P0", async () => {
  const w = await boot({ hash: "simulado" });
  const lists = new Set();
  for (let round = 0; round < 30; round++)
    for (const x of global(w, 'drawExam("sub")')) lists.add(global(w, `byId("${x.id}").list`));
  assert.ok([5, 6, 7, 9, 10, 11, 12, 13, 14, null].some((l) => lists.has(l)));
  for (const l of [1, 2, 3, 4, 8]) assert.equal(lists.has(l), false, `lista ${l}`);
});

test("rodada sorteada: começa pelo botão, corrige programas e funções e vai para o histórico", async () => {
  const w = await boot({ hash: "simulado" });
  w.document.querySelector('[data-exam-plan="p0"]').click();
  await tick();
  const exam = global(w, "exam");
  assert.equal(exam.format, "sorteio-v1");
  assert.equal(exam.plan, "p0");
  assert.match(w.document.querySelector("main, #app").textContent, /input\(\)/);
  assert.ok(stored(w).pendingExam, "rodada em andamento salva");
  global(w, `for (let i = 0; i < exam.items.length; i++) exam.answers[i] = "print(1)"`);
  w.persistExam();
  await w.finishExam();
  const s = stored(w);
  assert.equal(s.exams.length, 1);
  assert.equal(s.exams[0].total, 10);
  assert.equal(s.exams[0].score, 10, "Worker falso aprova todos os casos");
  assert.match(s.attempts[0].answer, /casos$/);
  assert.equal(w.__workerData.program, true, "programa vai com o corretor de input()/print()");
  assert.equal(global(w, "validStoredExam(state.exams[0])"), true);
  w.location.hash = "historico";
  await tick();
  assert.match(w.document.body.textContent, /Sorteio P0 · 10 questões/);
});

test("reiniciar uma rodada sorteada faz um sorteio novo da mesma prova", async () => {
  const w = await boot({ hash: "simulado" });
  w.document.querySelector('[data-exam-plan="sub"]').click();
  await tick();
  w.action("refresh-exam");
  assert.equal(global(w, "exam.plan"), "sub");
  assert.equal(global(w, "exam.format"), "sorteio-v1");
});

test("simulado sorteado adulterado é descartado ao abrir", async () => {
  const w = await boot({ hash: "simulado" });
  w.document.querySelector('[data-exam-plan="p1"]').click();
  await tick();
  const bad = stored(w).pendingExam;
  bad.items[0] = { id: "soma_dois", kind: "code", seed: 0 }; // lista 1 não é da P1
  assert.equal(global(w, `validExam(${JSON.stringify(bad)})`), false);
  bad.plan = "inexistente";
  assert.equal(global(w, `validExam(${JSON.stringify(bad)})`), false);
});

test("questão com código inicial (dados no editor) já abre com ele no simulado", async () => {
  const w = await boot({ hash: "simulado" });
  w.document.querySelector('[data-exam-plan="p1"]').click();
  await tick();
  global(w, 'exam.items[0] = { id: "telefones", kind: "code", seed: 0 }; exam.index = 0; render()');
  await tick();
  const starter = global(w, "CODE_SPECS.telefones.starter");
  assert.ok(starter);
  assert.equal(w.document.querySelector("#exam-code").value, starter);
  assert.equal(global(w, "Object.keys(exam.answers).length"), 0, "não conta como respondida");
});

test("sair do simulado volta à escolha da prova e descarta a rodada", async () => {
  const w = await boot({ hash: "simulado" });
  w.document.querySelector('[data-exam-plan="sub"]').click();
  await tick();
  global(w, 'exam.answers[0] = "x = 1"');
  w.persistExam();
  let asked = 0;
  w.confirm = () => (asked++, false);
  w.document.querySelector('[data-action="leave-exam"]').click();
  assert.equal(asked, 1, "pede confirmação com resposta escrita");
  assert.ok(global(w, "exam"), "cancelou: continua no simulado");
  w.confirm = () => true;
  w.document.querySelector('[data-action="leave-exam"]').click();
  await tick();
  assert.equal(global(w, "exam"), null);
  assert.equal(stored(w).pendingExam, undefined);
  assert.equal(stored(w).exams.length, 0, "nada registrado");
  assert.equal(w.document.querySelectorAll("[data-exam-plan]").length, 4);
});
