"use strict";
// Questões objetivas geradas a partir dos testes das listas recebidas (src/data/merge-lists.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const { boot, global } = require("./helpers");

const kind = (repr) =>
  repr === "None"
    ? "None"
    : repr === "True" || repr === "False"
      ? "bool"
      : /^['"]/.test(repr)
        ? "str"
        : repr.startsWith("[")
          ? "list"
          : /^-?\d+(\.\d+)?$/.test(repr)
            ? "number"
            : "outro";

async function generatedQuizzes() {
  const w = await boot();
  // Só os exercícios cujas questões foram geradas (alguns mantêm questões escritas à mão).
  return JSON.parse(
    global(
      w,
      `JSON.stringify(EXERCISES.filter((e) => e.supplied && e.variants[0].q.startsWith("Segundo o enunciado"))
        .flatMap((e) => e.variants.map((v) => ({ id: e.id, ...v }))))`,
    ),
  );
}

test("as alternativas erradas têm o mesmo tipo da resposta certa", async () => {
  const quizzes = await generatedQuizzes();
  assert.ok(quizzes.length >= 100);
  const bad = [];
  for (const v of quizzes) {
    const correct = v.choices[v.answer];
    const wrong = v.choices.filter((_, i) => i !== v.answer);
    const sameKind = wrong.filter((c) => kind(c) === kind(correct)).length;
    const k = kind(correct);
    // Booleano só tem um oposto; os demais tipos precisam de pelo menos duas alternativas do mesmo tipo.
    const needed = k === "bool" ? 1 : 2;
    if (sameKind < needed || wrong.some((c) => !["None", k].includes(kind(c))))
      bad.push(`${v.id}: ${v.choices.join(" | ")}`);
  }
  assert.deepEqual(bad, []);
});

test("as alternativas de cada questão são distintas", async () => {
  for (const v of await generatedQuizzes()) {
    assert.equal(new Set(v.choices).size, v.choices.length, `${v.id}: ${v.choices.join(" | ")}`);
    assert.ok(v.choices.length >= 3, `${v.id}: só ${v.choices.length} alternativas`);
  }
});

test("questões booleanas oferecem True, False e None (esqueceu o return)", async () => {
  for (const v of await generatedQuizzes())
    if (kind(v.choices[v.answer]) === "bool")
      assert.deepEqual([...v.choices].sort(), ["False", "None", "True"], v.id);
});

test("strings aparecem com as aspas do Python", async () => {
  const quizzes = await generatedQuizzes();
  const hello = quizzes.find((v) => v.id === "hello_name");
  assert.match(hello.q, /hello_name\('Bob'\)/);
  assert.equal(hello.choices[hello.answer], "'Hello Bob!'");
});

test("pythonRepr segue o repr do Python para aspas e barras", async () => {
  const w = await boot();
  const repr = (v) => global(w, `pythonRepr(${JSON.stringify(v)})`);
  assert.equal(repr("abc"), "'abc'");
  assert.equal(repr("it's"), `"it's"`);
  assert.equal(repr(`a'b"c`), `'a\\'b"c'`);
  assert.equal(repr("a\\b"), "'a\\\\b'");
  assert.equal(repr("linha\nnova"), "'linha\\nnova'");
  assert.equal(repr(["x", 1, true, null]), "['x', 1, True, None]");
});
