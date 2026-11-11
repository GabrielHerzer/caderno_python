"use strict";
// Editor de código: CodeMirror 5 (carregado do CDN no index.html) por cima dos <textarea
// class="python-editor">. O textarea continua sendo a fonte da verdade: cada mudança no editor é
// copiada para ele e dispara "input", então o resto do app não sabe que o CodeMirror existe.
// Sem o CDN, o textarea simples continua funcionando.
//
// Com { complete: true } (só na oficina; no simulado, não), as sugestões vêm do Jedi, num Worker
// separado (completion-worker.js): aparecem depois de "." ou de duas letras, e com Ctrl+Espaço.

const COMPLETE_TIMEOUT = 4000;
// Letras com acento contam como parte do nome (preço, ação), como no Python.
const WORD_CHAR = /[\p{L}\p{N}_]/u;
let completer = null,
  completerReady = false,
  completeSeq = 0;
const completeWaiting = new Map();

const KIND_LABEL = {
  function: "função",
  class: "classe",
  module: "módulo",
  keyword: "palavra-chave",
  instance: "variável",
  statement: "variável",
  param: "parâmetro",
  property: "atributo",
  path: "caminho",
};

function enhanceEditor(textarea, { complete = false } = {}) {
  if (!window.CodeMirror || !textarea || textarea.dataset.editor) return null;
  textarea.dataset.editor = "codemirror";
  const cm = CodeMirror.fromTextArea(textarea, {
    mode: { name: "python", version: 3 },
    theme: "zumbi",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity,
    readOnly: textarea.readOnly,
    placeholder: textarea.placeholder,
    screenReaderLabel:
      document.querySelector(`label[for="${textarea.id}"]`)?.textContent.trim() || "Código Python",
    inputStyle: "contenteditable",
    extraKeys: {
      Tab: (cm) =>
        cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    ", "end"),
      "Shift-Tab": (cm) => cm.indentSelection("subtract"),
      // No recuo, Backspace volta 4 espaços de uma vez (o par de parênteses continua com o
      // closebrackets, via CodeMirror.Pass).
      Backspace: (cm) => {
        if (cm.somethingSelected()) return CodeMirror.Pass;
        const cur = cm.getCursor();
        if (!cur.ch || !/^ +$/.test(cm.getLine(cur.line).slice(0, cur.ch))) return CodeMirror.Pass;
        const to = Math.floor((cur.ch - 1) / 4) * 4;
        cm.replaceRange("", CodeMirror.Pos(cur.line, to), cur, "+delete");
      },
      "Ctrl-Space": complete ? (cm) => showCompletions(cm) : false,
    },
  });
  cm.on("change", () => {
    textarea.value = cm.getValue();
    textarea.dispatchEvent(new Event("input"));
  });
  if (complete) {
    // Carrega o Jedi assim que o aluno entra no editor, para a primeira sugestão não demorar.
    cm.on("focus", () => completer || requestCompletions("", 1, 0));
    cm.on("inputRead", (cm, change) => {
      if (change.origin !== "+input" || cm.state.completionActive) return;
      // Dentro de textos e comentários, sugestão automática só atrapalha (Ctrl+Espaço ainda vale).
      if (/string|comment/.test(cm.getTokenTypeAt(cm.getCursor()) || "")) return;
      const typed = change.text.join("");
      const word = currentWord(cm);
      const first = word.text[0] || "";
      if (typed === "." || (WORD_CHAR.test(typed) && word.text.length >= 2 && !/\d/.test(first)))
        showCompletions(cm);
    });
  }
  return cm;
}

// Palavra sob o cursor (o trecho que a sugestão vai substituir).
function currentWord(cm) {
  const cur = cm.getCursor(),
    line = cm.getLine(cur.line);
  let start = cur.ch;
  while (start > 0 && WORD_CHAR.test(line[start - 1])) start--;
  return {
    from: CodeMirror.Pos(cur.line, start),
    to: cur,
    text: line.slice(start, cur.ch),
  };
}

function showCompletions(cm) {
  cm.showHint({ hint: pythonHint, completeSingle: false, closeCharacters: /[\s()\[\]{};:>,=]/ });
}

function pythonHint(cm, callback) {
  const cur = cm.getCursor(),
    word = currentWord(cm);
  requestCompletions(cm.getValue(), cur.line + 1, cur.ch).then((items) => {
    // Sem a palavra já digitada inteira: senão, Enter no fim de "return" escolheria "return" em
    // vez de pular a linha.
    const list = items.filter((item) => item.name !== word.text);
    // O cursor andou enquanto o Jedi pensava: a sugestão já não vale.
    const now = cm.getCursor();
    if (now.line !== cur.line || now.ch !== cur.ch || !list.length) return callback(null);
    callback({
      from: word.from,
      to: word.to,
      list: list.map((item) => ({
        text: item.name,
        displayText: item.name,
        render: (el) => {
          el.textContent = item.name;
          const kind = document.createElement("small");
          kind.textContent = KIND_LABEL[item.type] || item.type;
          el.appendChild(kind);
        },
      })),
    });
  });
}
pythonHint.async = true;

// Pede sugestões ao Worker do Jedi. Enquanto o Worker carrega o Pyodide e o Jedi, espera mais;
// depois de pronto, uma resposta atrasada indica Worker travado: ele é descartado e recriado.
function requestCompletions(code, line, column) {
  if (typeof Worker === "undefined") return Promise.resolve([]);
  if (!completer) {
    const url = URL.createObjectURL(
      new Blob(["(" + completionWorker.toString() + ")()"], { type: "application/javascript" }),
    );
    completer = new Worker(url);
    URL.revokeObjectURL(url);
    completer.onmessage = ({ data }) => {
      if (!data.error) completerReady = true;
      completeWaiting.get(data.id)?.(data.items || []);
      completeWaiting.delete(data.id);
    };
    completer.onerror = dropCompleter;
  }
  const id = ++completeSeq,
    worker = completer;
  const limit = completerReady ? COMPLETE_TIMEOUT : COMPLETE_TIMEOUT * 10;
  return new Promise((resolve) => {
    completeWaiting.set(id, resolve);
    worker.postMessage({ id, code, line, column });
    setTimeout(() => {
      if (!completeWaiting.has(id)) return;
      completeWaiting.delete(id);
      resolve([]);
      if (completerReady && completer === worker) dropCompleter();
    }, limit);
  });
}

function dropCompleter() {
  completer?.terminate();
  completer = null;
  completerReady = false;
  for (const resolve of completeWaiting.values()) resolve([]);
  completeWaiting.clear();
}
