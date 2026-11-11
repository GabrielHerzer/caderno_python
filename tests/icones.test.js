"use strict";
// Ícones do Lucide (src/core/icons.js) no lugar de símbolos Unicode e emoji.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { tick, boot, go, attempt } = require("./helpers");

const GLYPHS = /[◈▦↻⌨◷▤↗✓✗★▰▶🔒←→]/u;

test("o menu lateral usa um ícone Lucide por item, sem símbolos no texto", async () => {
  const w = await boot();
  const links = [...w.document.querySelectorAll("nav a")];
  assert.equal(links.length, 7);
  for (const a of links) {
    const svg = a.querySelector("svg.icon");
    assert.ok(svg, a.textContent);
    assert.equal(svg.getAttribute("aria-hidden"), "true");
    assert.doesNotMatch(a.textContent, GLYPHS);
  }
  assert.equal(w.document.querySelector("[data-icon]"), null);
});

test("nenhuma tela mostra os símbolos antigos em botões, links, etiquetas ou resultados", async () => {
  const saved = {
    version: 1,
    cycles: 0,
    exams: [],
    attempts: [attempt("first_last6"), attempt("near_ten", { correct: false })],
  };
  const w = await boot({ storage: JSON.stringify(saved) });
  // Confere cada tela no momento em que ela aparece (o #app é reaproveitado entre as rotas).
  const check = (route) => {
    const app = w.document.querySelector("#app");
    // Conteúdo de exercícios (código e enunciados em <pre>/<code>) pode ter setas; a interface, não.
    const ui = [
      ...app.querySelectorAll("button, a, summary, h1, h2, h3, .tag, .notice, td, .folder"),
    ]
      .filter((el) => !el.closest("pre, code"))
      .map((el) => el.textContent)
      .join(" ");
    assert.doesNotMatch(ui, GLYPHS, route);
    return app;
  };
  for (const route of ["catalogo", "revisao", "codigo", "simulado", "historico", "fontes"]) {
    await go(w, route);
    check(route);
  }
  await go(w, "inicio");
  assert.ok(check("inicio").querySelector("svg.icon"), "painel sem ícones");
  await go(w, "catalogo");
  w.document.querySelector('[data-folder="9"]').click();
  await tick();
  const folder = check("pasta 9");
  assert.ok(folder.querySelector(".folder svg.icon"), "pastas sem ícone");
  assert.ok(folder.querySelector(".video-card svg.icon"), "aulas sem ícone");
  w.document.querySelector("[data-practice]").click();
  await tick();
  assert.ok(check("prática").querySelector("svg.icon"), "prática sem ícones");
});

test("o Lucide vem do CDN numa versão fixa, com integridade conferida, igual à do npm", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const tag = html.match(
    /<script\s+src="(https:\/\/cdn[^"]+lucide[^"]+)"\s+integrity="([^"]+)"\s+crossorigin="anonymous"/,
  );
  assert.ok(tag, "script do Lucide com integrity e crossorigin");
  const pkg = require("lucide/package.json");
  assert.equal(tag[1], `https://cdn.jsdelivr.net/npm/lucide@${pkg.version}/dist/umd/lucide.min.js`);
  const file = fs.readFileSync(require.resolve("lucide/dist/umd/lucide.min.js"));
  const hash =
    "sha384-" + require("node:crypto").createHash("sha384").update(file).digest("base64");
  assert.equal(tag[2], hash);
});

test("sem o CDN do Lucide, o site funciona sem ícones", async () => {
  const w = await boot({ lucide: false });
  for (const route of ["inicio", "catalogo", "codigo"]) {
    await go(w, route);
    assert.ok(w.document.querySelector("#app h1, #app h2"), route);
  }
  assert.deepEqual(w.__errors, []);
  assert.equal(w.document.querySelector("svg.icon"), null);
});
