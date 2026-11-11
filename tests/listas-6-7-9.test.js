"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { tick, boot, global, go } = require("./helpers");

const NEW_LISTS = {
  6: [
    "dormir",
    "alunos_problema",
    "soma_dobro",
    "diff21",
    "papagaio",
    "dez",
    "dista10",
    "apaga",
    "troca",
  ],
  7: [
    "multstring",
    "string_splosion",
    "array_count9",
    "array_front9",
    "hello_name",
    "make_tags",
    "extra_end",
    "first_half",
    "sem_pontas",
    "roda2",
  ],
  9: [
    "first_last6",
    "same_first_last",
    "common_end",
    "maior_ponta",
    "sum2",
    "middle_way",
    "date_fashion",
    "squirrel_play",
    "pego_correndo",
    "alarm_clock",
  ],
};

async function openFolder(w, folder) {
  await go(w, "catalogo");
  w.document.querySelector(`[data-folder="${folder}"]`).click();
  await tick();
}

test("o catálogo mostra as pastas das listas 6, 7 e 9 antes da 10", async () => {
  const w = await boot();
  await go(w, "catalogo");
  const folders = [...w.document.querySelectorAll("[data-folder]")].map((b) => b.dataset.folder);
  assert.deepEqual(folders, ["6", "7", "9", "10", "11", "12", "13", "14", "enade"]);
});

for (const [list, ids] of Object.entries(NEW_LISTS)) {
  test(`a pasta da lista ${list} tem os ${ids.length} exercícios em ordem alfabética de letra`, async () => {
    const w = await boot();
    await openFolder(w, list);
    const shown = [...w.document.querySelectorAll("#results [data-code]")].map(
      (b) => b.dataset.code,
    );
    assert.deepEqual(shown, ids);
    // JSON: arrays criados dentro do jsdom têm outro protótipo e não passam no deepEqual estrito.
    const letters = JSON.parse(
      global(w, `JSON.stringify(EXERCISES.filter((e) => e.list === ${list}).map((e) => e.letter))`),
    );
    assert.deepEqual(
      letters.sort(),
      ids.map((_, i) => String.fromCharCode(65 + i)),
    );
  });
}

test("cada exercício novo abre na oficina com contrato, testes e questões objetivas", async () => {
  const w = await boot();
  for (const id of Object.values(NEW_LISTS).flat()) {
    const spec = global(w, `CODE_SPECS[${JSON.stringify(id)}]`);
    assert.ok(spec, `${id} sem contrato`);
    assert.ok(spec.signature.startsWith(id + "("), `${id}: assinatura ${spec.signature}`);
    assert.ok(spec.tests.length >= 4, `${id}: poucos testes`);
    const e = global(w, `byId(${JSON.stringify(id)})`);
    assert.equal(e.supplied, true);
    assert.ok(e.variants.length >= 2, `${id}: sem questões objetivas`);
    w.openCoding(id);
    await tick();
    assert.match(w.document.querySelector("#app").textContent, new RegExp(`Lista \\d+ · [A-J]`));
  }
  assert.deepEqual(w.__errors, []);
});

test("os exercícios novos aparecem nas lições dos seus temas", async () => {
  const w = await boot();
  const slicing = global(w, 'LESSONS.find((l) => l.topic === "slicing").ids');
  for (const id of ["first_half", "sem_pontas", "roda2", "apaga"])
    assert.ok(slicing.includes(id), id);
});

test("a página Listas e fontes inclui as listas 6, 7 e 9 e o total atualizado", async () => {
  const w = await boot();
  await go(w, "fontes");
  const text = w.document.querySelector("#app").textContent;
  assert.match(text, /62 exercícios das listas 6–14/);
  for (const list of [6, 7, 9])
    assert.match(text, new RegExp(`Lista ${list}\\d*${NEW_LISTS[list].length}`));
  assert.doesNotMatch(text, /lista 9 (não|está fora)/i);
});

test("o catálogo não diz mais que a lista 9 está fora", async () => {
  const w = await boot();
  await go(w, "catalogo");
  assert.doesNotMatch(w.document.querySelector("#app").textContent, /lista 9 (não|está fora)/i);
});
