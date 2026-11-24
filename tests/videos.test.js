"use strict";
// Aulas do professor (YouTube) nas pastas das listas, conforme o guia de aulas do Python para Zumbis.
const test = require("node:test");
const assert = require("node:assert/strict");
const { tick, boot, global, go, attempt } = require("./helpers");

async function openFolder(w, folder) {
  await go(w, "catalogo");
  w.document.querySelector(`[data-folder="${folder}"]`).click();
  await tick();
}

const links = (w, section) =>
  [...w.document.querySelectorAll(`[data-videos="${section}"] a`)].map((a) => a.href);

const yt = (id) => `https://www.youtube.com/watch?v=${id}`;

test("a pasta da lista 9 mostra as aulas para assistir antes, na ordem do guia", async () => {
  const w = await boot();
  await openFolder(w, 9);
  assert.deepEqual(links(w, "antes"), [
    yt("1V2K19atNbg"), // TWP100
    yt("edeDmCN9_oA"), // TWP110
    yt("NYD16LUbVKg"), // TWP130
    yt("MnlYp04aDu8"), // TWP200
    yt("Hkjx_723dG8"), // TWP255
  ]);
  const first = w.document.querySelector('[data-videos="antes"] a');
  assert.equal(first.target, "_blank");
  assert.match(first.rel, /noopener/);
  assert.match(first.textContent, /TWP100/);
});

test("a resolução em vídeo fica bloqueada até a primeira tentativa na lista", async () => {
  const w = await boot();
  await openFolder(w, 9);
  assert.deepEqual(links(w, "depois"), []);
  const locked = w.document.querySelector('[data-videos="depois"]').textContent;
  assert.match(locked, /TWP430/);
  assert.match(locked, /tentativa/i);
  assert.doesNotMatch(w.document.querySelector("#app").innerHTML, /f8icBhNqakA/);
});

test("uma tentativa em exercício da lista libera a resolução em vídeo", async () => {
  const saved = { version: 1, cycles: 0, exams: [], attempts: [attempt("first_last6")] };
  const w = await boot({ storage: JSON.stringify(saved) });
  await openFolder(w, 9);
  assert.deepEqual(links(w, "depois"), [yt("f8icBhNqakA")]);
});

test("tentativa em outra lista não libera a resolução desta", async () => {
  const saved = { version: 1, cycles: 0, exams: [], attempts: [attempt("near_ten")] };
  const w = await boot({ storage: JSON.stringify(saved) });
  await openFolder(w, 9);
  assert.deepEqual(links(w, "depois"), []);
  await openFolder(w, 10);
  assert.deepEqual(links(w, "depois"), [yt("7xRWuDkb77Y")]); // TWP440
});

test("todas as pastas de lista têm aulas, e todo vídeo citado existe no catálogo", async () => {
  const w = await boot();
  const data = JSON.parse(
    global(w, "JSON.stringify({ VIDEOS, LIST_VIDEOS, SUPPLIED_LIST_NUMBERS })"),
  );
  for (const n of data.SUPPLIED_LIST_NUMBERS) {
    const lv = data.LIST_VIDEOS[n];
    assert.ok(lv?.antes.length && lv.depois.length, `lista ${n} sem aulas antes e depois`);
    for (const code of [...lv.antes, ...lv.depois])
      assert.ok(data.VIDEOS[code], `${code} não existe`);
  }
  for (const [code, v] of Object.entries(data.VIDEOS)) {
    assert.match(code, /^TWP\d{3}$/);
    assert.match(v.youtube, /^[A-Za-z0-9_-]{11}$/, code);
    assert.ok(v.title.length > 2, code);
  }
});

test("a pasta ENADE não mostra aulas", async () => {
  const w = await boot();
  await openFolder(w, "enade");
  assert.equal(w.document.querySelector("[data-videos]"), null);
});
