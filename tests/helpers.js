"use strict";
// Carrega o site no jsdom, na ordem de scripts do index.html, com um Worker falso no lugar do Pyodide.
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const KEY = "massanori-python-v1";

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

// Worker falso: responde "ready" e depois "result" com todos os testes aprovados.
function fakeWorker(window, { delay = 0 } = {}) {
  window.__workers = 0;
  return class {
    constructor() {
      window.__workers++;
    }
    postMessage(data) {
      window.__workerData = data;
      setTimeout(() => {
        this.onmessage?.({ data: { type: "ready" } });
        setTimeout(() => {
          const rows = data.check
            ? (data.cases || data.tests).map(() => ({
                ok: true,
                input: "x",
                expected: "y",
                actual: "y",
                label: "ok",
              }))
            : null;
          this.onmessage?.({ data: { type: "result", rows } });
        }, delay);
      }, 0);
    }
    terminate() {}
  };
}

async function boot({ storage, workerDelay = 0, hash = "", lucide = true } = {}) {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script src="([^"?]+)[^"]*"><\/script>/g)].map((m) => m[1]);
  const dom = new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g, ""), {
    runScripts: "dangerously",
    url: "http://127.0.0.1:8765/" + (hash ? "#" + hash : ""),
  });
  const w = dom.window;
  w.confirm = () => true;
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => "blob:fake";
  w.URL.revokeObjectURL = () => {};
  w.Worker = fakeWorker(w, { delay: workerDelay });
  w.__errors = [];
  w.addEventListener("error", (e) => w.__errors.push(e.error || e.message));
  if (storage !== undefined) w.localStorage.setItem(KEY, storage);
  // O index.html carrega o Lucide do CDN (fora da lista acima); nos testes, a mesma versão vem do npm.
  // lucide: false imita o CDN fora do ar.
  if (lucide) {
    const el = w.document.createElement("script");
    el.textContent = fs.readFileSync(require.resolve("lucide/dist/umd/lucide.js"), "utf8");
    w.document.body.appendChild(el);
  }
  for (const src of scripts) {
    const el = w.document.createElement("script");
    el.textContent = fs.readFileSync(path.join(ROOT, src), "utf8");
    w.document.body.appendChild(el);
  }
  await tick();
  return w;
}

// Lê variáveis globais declaradas com let/const nos scripts (não viram propriedades de window).
const global = (w, expr) => w.eval(expr);
const stored = (w) => JSON.parse(w.localStorage.getItem(KEY));

async function go(w, route) {
  w.location.hash = route;
  await tick();
}

function type(w, selector, value) {
  const el = w.document.querySelector(selector);
  el.value = value;
  el.dispatchEvent(new w.Event("input"));
}

// Imita o evento change do <input type=file> com um backup em JSON.
const backupFile = (obj) => ({
  target: { files: [{ size: 100, text: async () => JSON.stringify(obj) }], value: "backup.json" },
});

const attempt = (id, extra = {}) => ({
  id,
  variant: 0,
  answer: "x",
  correct: true,
  assisted: false,
  time: 1767225600000,
  mode: "pratica",
  scratch: "",
  ...extra,
});

// Verifica o código na oficina (com o Worker falso) e espera o resultado.
async function checkCode(w, id) {
  w.openCoding(id);
  await tick();
  type(w, "#python-editor", `def ${id}(*a):\n    return True`);
  w.document.querySelector("#check-code").click();
  await tick(20);
}

module.exports = { KEY, tick, boot, global, stored, go, type, backupFile, attempt, checkCode };
