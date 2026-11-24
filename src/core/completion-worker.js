"use strict";
// Web Worker das sugestões do editor (src/core/editor.js): Pyodide com o Jedi, a biblioteca de
// autocompletar de Python. Fica aberto entre as sugestões e não executa o código do aluno: o Jedi
// só analisa o texto. Como em python-worker.js, a função é serializada com toString().

function completionWorker() {
  let ready = null;
  const setup = async () => {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");
    const py = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/" });
    await py.loadPackage("jedi");
    py.runPython(`
import json, jedi

def __complete(code, line, column):
    try:
        found = jedi.Script(code).complete(line, column)
    except Exception:
        return '[]'
    typed = code.splitlines()[line - 1][:column] if code.splitlines() else ''
    private = typed.rstrip().endswith('_')
    out = []
    for c in found:
        if c.name.startswith('_') and not private:
            continue
        out.append({'name': c.name, 'type': c.type})
        if len(out) == 40:
            break
    return json.dumps(out)
`);
    return py.globals.get("__complete");
  };
  self.onmessage = async ({ data }) => {
    try {
      ready ??= setup();
      const complete = await ready;
      self.postMessage({
        id: data.id,
        items: JSON.parse(complete(data.code, data.line, data.column)),
      });
    } catch (err) {
      ready = null;
      self.postMessage({ id: data.id, items: [], error: String(err.message || err) });
    }
  };
}
