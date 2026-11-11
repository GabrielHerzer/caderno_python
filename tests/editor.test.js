"use strict";
// Editor de código com CodeMirror (src/core/editor.js) e sugestões do Jedi (completion-worker.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { tick, boot, stored } = require("./helpers");

const cmOf = (w, sel = "#app") => w.document.querySelector(`${sel} .CodeMirror`)?.CodeMirror;

test("a oficina usa o CodeMirror e cada mudança vai para o rascunho salvo", async () => {
  const w = await boot({ codemirror: true });
  w.openCoding("first_last6");
  await tick();
  const cm = cmOf(w);
  assert.ok(cm, "editor CodeMirror");
  assert.equal(cm.getOption("mode").name, "python");
  assert.equal(cm.getOption("indentUnit"), 4);
  cm.setValue("def first_last6(nums):\n    return True");
  assert.equal(w.document.querySelector("#python-editor").value, cm.getValue());
  assert.equal(stored(w).codeDrafts.first_last6.code, "def first_last6(nums):\n    return True");
});

test("Tab insere 4 espaços no CodeMirror", async () => {
  const w = await boot({ codemirror: true });
  w.openCoding("first_last6");
  await tick();
  const cm = cmOf(w);
  cm.setValue("x");
  cm.setCursor({ line: 0, ch: 0 });
  cm.getOption("extraKeys").Tab(cm);
  assert.equal(cm.getValue(), "    x");
});

test("as sugestões aparecem depois do ponto, com o tipo em português", async () => {
  const w = await boot({ codemirror: true });
  const asked = [];
  w.requestCompletions = async (code, line, column) => {
    asked.push([code, line, column]);
    return [
      { name: "upper", type: "function" },
      { name: "upper_x", type: "statement" },
    ];
  };
  w.openCoding("first_last6");
  await tick();
  const cm = cmOf(w);
  cm.setValue("nome = 'a'\nnome");
  cm.setCursor({ line: 1, ch: 4 });
  cm.replaceRange(".", cm.getCursor(), null, "+input");
  // inputRead só dispara com digitação real; o atalho Ctrl+Espaço chama o mesmo caminho.
  cm.getOption("extraKeys")["Ctrl-Space"](cm);
  await tick(10);
  assert.deepEqual(asked.at(-1), ["nome = 'a'\nnome.", 2, 5]);
  const hints = w.document.querySelector(".CodeMirror-hints");
  assert.ok(hints, "lista de sugestões");
  assert.match(hints.textContent, /upperfunção/);
  assert.match(hints.textContent, /upper_xvariável/);
  cm.state.completionActive.widget.pick();
  assert.equal(cm.getLine(1), "nome.upper");
});

test("o simulado usa o CodeMirror sem sugestões", async () => {
  const w = await boot({ codemirror: true, hash: "simulado" });
  let asked = 0;
  w.requestCompletions = async () => (asked++, [{ name: "x", type: "function" }]);
  w.action("start-exam");
  await tick();
  const cm = cmOf(w);
  assert.ok(cm, "editor do simulado");
  assert.equal(cm.getOption("extraKeys")["Ctrl-Space"], false);
  cm.setValue("def f():\n    return 1");
  assert.equal(w.document.querySelector("#exam-code").value, "def f():\n    return 1");
  assert.equal(asked, 0);
});

test("sem o CDN do CodeMirror, os editores continuam como textarea", async () => {
  const w = await boot();
  w.openCoding("first_last6");
  await tick();
  assert.equal(w.document.querySelector(".CodeMirror"), null);
  assert.equal(w.document.querySelector("#python-editor").style.display, "");
  assert.deepEqual(w.__errors, []);
});

test("o CodeMirror vem do CDN numa versão fixa, com integridade igual à do npm", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const pkg = require("codemirror/package.json");
  const tags = [
    ...html.matchAll(
      /(?:src|href)="https:\/\/cdn\.jsdelivr\.net\/npm\/codemirror@([^/]+)\/([^"]+)"\s+integrity="([^"]+)"\s+crossorigin="anonymous"/g,
    ),
  ];
  assert.equal(tags.length, 8);
  for (const [, version, file, integrity] of tags) {
    assert.equal(version, pkg.version, file);
    const bytes = fs.readFileSync(require.resolve(`codemirror/${file}`));
    const hash =
      "sha384-" + require("node:crypto").createHash("sha384").update(bytes).digest("base64");
    assert.equal(integrity, hash, file);
  }
});

// Prepara a oficina com sugestões falsas e devolve o editor e as chamadas feitas ao Jedi.
async function workshop(items) {
  const w = await boot({ codemirror: true });
  const asked = [];
  w.requestCompletions = async (code, line, column) => (asked.push([code, line, column]), items);
  w.openCoding("first_last6");
  await tick();
  return { w, cm: cmOf(w), asked };
}

test("a palavra já digitada inteira não vira sugestão (Enter continua pulando linha)", async () => {
  const { w, cm } = await workshop([{ name: "return", type: "keyword" }]);
  cm.setValue("def f():\n    return");
  cm.setCursor({ line: 1, ch: 10 });
  cm.getOption("extraKeys")["Ctrl-Space"](cm);
  await tick(10);
  assert.equal(w.document.querySelector(".CodeMirror-hints"), null);
});

test("nomes com acento são substituídos inteiros", async () => {
  const { w, cm } = await workshop([{ name: "preço_total", type: "statement" }]);
  cm.setValue("preço_total = 1\npreç");
  cm.setCursor({ line: 1, ch: 4 });
  cm.getOption("extraKeys")["Ctrl-Space"](cm);
  await tick(10);
  assert.ok(w.document.querySelector(".CodeMirror-hints"));
  cm.state.completionActive.widget.pick();
  assert.equal(cm.getLine(1), "preço_total");
});

test("digitando em textos e comentários, as sugestões não abrem sozinhas", async () => {
  const { cm, asked } = await workshop([{ name: "print", type: "function" }]);
  cm.setValue("x = 'pr'\n# pr");
  for (const pos of [
    { line: 0, ch: 7 },
    { line: 1, ch: 4 },
  ]) {
    cm.setCursor(pos);
    CodeMirror_signalInput(cm, "i");
  }
  await tick(10);
  assert.equal(asked.length, 0);
  cm.setValue("pr");
  cm.setCursor({ line: 0, ch: 2 });
  CodeMirror_signalInput(cm, "i");
  await tick(10);
  assert.equal(asked.length, 1, "no código, abre");
});

// Imita uma tecla digitada: insere o texto e dispara inputRead como o CodeMirror faz.
function CodeMirror_signalInput(cm, text) {
  const from = cm.getCursor();
  cm.replaceRange(text, from, from, "+input");
  cm.constructor.signal(cm, "inputRead", cm, {
    from,
    to: from,
    text: [text],
    origin: "+input",
  });
}

test("Backspace no recuo apaga 4 espaços; fora dele, um caractere", async () => {
  const { cm } = await workshop([]);
  const back = cm.getOption("extraKeys").Backspace;
  cm.setValue("if x:\n        y");
  cm.setCursor({ line: 1, ch: 8 });
  back(cm);
  assert.equal(cm.getLine(1), "    y");
  cm.setCursor({ line: 1, ch: 5 });
  assert.equal(back(cm), cm.constructor.Pass);
});

test("Worker do Jedi: com erro, as esperas terminam vazias e ele é recriado", async () => {
  const workers = [];
  const w = await boot({ codemirror: true });
  // O boot instala o Worker falso do Pyodide; este substitui só para as sugestões.
  w.Worker = class {
    constructor() {
      workers.push(this);
    }
    postMessage(data) {
      this.last = data;
    }
    terminate() {
      this.terminated = true;
    }
  };
  const pending = w.requestCompletions("nome.", 1, 5);
  workers[0].onerror();
  assert.deepEqual(Array.from(await pending), []);
  assert.equal(workers[0].terminated, true);
  const next = w.requestCompletions("nome.", 1, 5);
  assert.equal(workers.length, 2, "Worker novo");
  workers[1].onmessage({ data: { id: workers[1].last.id, items: [{ name: "upper" }] } });
  assert.equal((await next)[0].name, "upper");
});
