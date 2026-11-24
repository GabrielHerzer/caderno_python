"use strict";
// Código do Web Worker que carrega o Pyodide e executa/corrige o Python do aluno.
// A função é serializada com toString(); ela não enxerga nada do escopo global da página.

function pythonWorker() {
  self.onmessage = async ({ data }) => {
    try {
      let outputSize = 0;
      const emit = (t) => {
        outputSize += t.length + 1;
        if (outputSize > 16000)
          throw Error(
            "Saída excedeu 16.000 caracteres. Verifique se há um laço imprimindo sem parar.",
          );
        self.postMessage({ type: "output", text: t });
      };
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");
      const py = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
        stdout: emit,
        stderr: emit,
      });
      let lines = data.stdin ? data.stdin.split("\n") : [],
        index = 0;
      py.setStdin({ stdin: () => (index < lines.length ? lines[index++] : undefined) });
      self.postMessage({ type: "ready" });
      if (data.program) {
        // Listas 1–5: o corretor de programas (src/core/program-grader.js) vem na mensagem.
        py.globals.set("__request_json", JSON.stringify(data));
        const out = JSON.parse(
          await py.runPythonAsync(
            data.grader +
              "\nimport json as __json\n__req = __json.loads(__request_json)\ngrade_program_json(__req['code'], __req['cases'], __req.get('rules') or {})",
          ),
        );
        self.postMessage(
          out.error ? { type: "error", error: out.error } : { type: "result", rows: out.rows },
        );
        return;
      }
      py.globals.set("__request_json", JSON.stringify(data));
      const result = await py.runPythonAsync(`
import json, traceback, math, copy, ast
def decode(value):
    if isinstance(value, dict) and '__int__' in value:
        return int(value['__int__'])
    if isinstance(value, dict) and '__tuple__' in value:
        return tuple(decode(v) for v in value['__tuple__'])
    if isinstance(value, list):
        return [decode(v) for v in value]
    if isinstance(value, dict):
        return {k:decode(v) for k,v in value.items()}
    return value
req = decode(json.loads(__request_json))
if req['check']:
    parsed = ast.parse(req['code'])
    rules = req.get('rules', {})
    if rules.get('noLoops'):
        blocked = (ast.For, ast.AsyncFor, ast.While, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)
        if any(isinstance(node, blocked) for node in ast.walk(parsed)):
            raise ValueError('Restrição da lista: não use for, while ou compreensões com for. Comentários e strings não contam como laços.')
    if rules.get('digitArithmetic'):
        for node in ast.walk(parsed):
            if isinstance(node, ast.Call):
                name = node.func.id if isinstance(node.func, ast.Name) else node.func.attr if isinstance(node.func, ast.Attribute) else ''
                if name in ('int', 'eval', 'exec', 'compile', 'pow'):
                    raise ValueError('Lista 14-G: some dígito por dígito, sem reconstruir o número com int/pow/eval/exec. O transporte com % 10 e // 10 é permitido.')
            if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Pow, ast.Mult)):
                if any(isinstance(v, ast.Constant) and v.value == 10 for v in (node.left, node.right)):
                    raise ValueError('Lista 14-G: não use potências ou multiplicação por 10 para reconstruir os números. Use a soma dos dígitos com transporte.')
def concise(value):
    text = repr(value)
    return text if len(text) <= 220 else text[:217] + '...'
def equal(a, b):
    if isinstance(b, bool):
        return isinstance(a, bool) and a == b
    if isinstance(b, (int, float)):
        return isinstance(a, (int, float)) and not isinstance(a, bool) and math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(b, tuple):
        return isinstance(a, tuple) and len(a) == len(b) and all(equal(x,y) for x,y in zip(a,b))
    if isinstance(b, list):
        return isinstance(a, (list, tuple)) and len(a) == len(b) and all(equal(x,y) for x,y in zip(a,b))
    return type(a) is type(b) and a == b
rows = []
if not req['check']:
    exec(compile(req['code'], '<seu_codigo>', 'exec'), {'__name__':'__main__'})
else:
    compiled = compile(req['code'], '<seu_codigo>', 'exec')
    for args, expected in req['tests']:
        ns = {'__name__':'__teste__'}
        row = {'ok':False, 'input':concise(args), 'expected':concise(expected), 'actual':'—', 'label':'Caso de teste'}
        try:
            exec(compiled, ns)
            func = ns.get(req['fn'])
            if not callable(func):
                raise NameError('Defina a função ' + req['fn'] + ' com o nome pedido no enunciado.')
            values = copy.deepcopy(args)
            result = func(*values)
            row['actual'] = concise(result)
            row['ok'] = equal(result, expected)
            if req.get('returnType') == 'list' and not isinstance(result, list):
                row['ok'] = False
                row['error'] = 'O retorno deve ser uma lista, conforme os testes do enunciado.'
            if req['unchanged'] and values != args:
                row['ok'] = False
                row['error'] = 'A função alterou a lista original; o enunciado pede preservar a entrada.'
            if result is None:
                row['error'] = 'A função retornou None. Confira se você usou return; print apenas exibe a saída.'
            row['label'] = 'Resultado correto' if row['ok'] else 'Resultado diferente do esperado'
        except BaseException:
            row['error'] = traceback.format_exc(limit=3)
            row['label'] = 'Erro durante a execução'
        rows.append(row)
json.dumps(rows, ensure_ascii=False)
`);
      self.postMessage({ type: "result", rows: data.check ? JSON.parse(result) : null });
    } catch (err) {
      self.postMessage({ type: "error", error: String(err.message || err) });
    }
  };
}
