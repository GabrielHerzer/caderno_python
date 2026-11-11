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

// Supabase falso (o index.html carrega o verdadeiro do CDN). `server` guarda as linhas da tabela
// progress, a sessão atual e quem está na lista de autorizados, como o banco faria com o RLS.
function fakeSupabase(server) {
  server.rows ??= {};
  server.allowed ??= [];
  server.calls ??= [];
  return {
    createClient(url, key, options) {
      server.options = options;
      const listeners = [];
      const emit = (event) => listeners.forEach((cb) => cb(event, server.session || null));
      server.emit = emit;
      const fail = () => (server.offline ? { message: "Failed to fetch" } : null);
      return {
        auth: {
          onAuthStateChange(cb) {
            listeners.push(cb);
            setTimeout(() => cb("INITIAL_SESSION", server.session || null), 0);
            return { data: { subscription: { unsubscribe() {} } } };
          },
          async getSession() {
            return { data: { session: server.session || null }, error: null };
          },
          async signInWithOAuth(args) {
            server.calls.push(["signInWithOAuth", args]);
            return { data: { url: "https://github.test/login" }, error: null };
          },
          async signOut() {
            server.session = null;
            emit("SIGNED_OUT");
            return { error: null };
          },
        },
        from(table) {
          const uid = () => server.session?.user.id;
          return {
            select: () => ({
              eq: (col, value) => ({
                async maybeSingle() {
                  server.calls.push(["select", table, value]);
                  if (fail()) return { data: null, error: fail() };
                  const ok = uid() === value && server.allowed.includes(value);
                  const row = ok ? server.rows[value] : undefined;
                  return { data: row ? { state: structuredClone(row) } : null, error: null };
                },
              }),
            }),
            async upsert(row) {
              server.calls.push(["upsert", table, row.user_id]);
              if (fail()) return { error: fail() };
              if (row.user_id !== uid() || !server.allowed.includes(uid()))
                return { error: { code: "42501", message: "row-level security" } };
              server.rows[row.user_id] = structuredClone(row.state);
              return { error: null };
            },
          };
        },
      };
    },
  };
}

const CODEMIRROR_FILES = [
  "lib/codemirror.js",
  "mode/python/python.js",
  "addon/edit/matchbrackets.js",
  "addon/edit/closebrackets.js",
  "addon/display/placeholder.js",
  "addon/hint/show-hint.js",
];

const githubSession = (id, login) => ({
  user: {
    id,
    user_metadata: {
      user_name: login,
      avatar_url: `https://avatars.githubusercontent.com/u/${id}`,
    },
  },
});

async function boot({
  storage,
  workerDelay = 0,
  hash = "",
  lucide = true,
  supabase,
  codemirror = false,
  url = "http://127.0.0.1:8765/",
  before,
} = {}) {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script src="([^"?]+)[^"]*"><\/script>/g)].map((m) => m[1]);
  const dom = new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g, ""), {
    runScripts: "dangerously",
    url: url + (hash ? "#" + hash : ""),
  });
  const w = dom.window;
  if (supabase) w.supabase = fakeSupabase(supabase);
  before?.(w);
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
  // O index.html carrega o CodeMirror do CDN; codemirror: true usa os mesmos arquivos do npm.
  if (codemirror) {
    // O jsdom não mede texto; o CodeMirror só precisa que essas funções existam.
    const rect = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
    w.document.createRange = () => ({
      setStart() {},
      setEnd() {},
      getBoundingClientRect: () => rect,
      getClientRects: () => ({ length: 0, item: () => null }),
    });
    for (const file of CODEMIRROR_FILES) {
      const el = w.document.createElement("script");
      el.textContent = fs.readFileSync(require.resolve(`codemirror/${file}`), "utf8");
      w.document.body.appendChild(el);
    }
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

module.exports = {
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
  githubSession,
};
