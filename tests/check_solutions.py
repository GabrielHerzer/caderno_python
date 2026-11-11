"""Confere as soluções de referência de CODE_SPECS (JSON na entrada padrão).

Usa a mesma decodificação, comparação e regras do corretor do site
(src/core/python-worker.js). Sai com código 1 se alguma solução falhar.
"""
import ast
import copy
import json
import math
import signal
import sys


def decode(value):
    if isinstance(value, dict) and '__int__' in value:
        return int(value['__int__'])
    if isinstance(value, dict) and '__tuple__' in value:
        return tuple(decode(v) for v in value['__tuple__'])
    if isinstance(value, list):
        return [decode(v) for v in value]
    if isinstance(value, dict):
        return {k: decode(v) for k, v in value.items()}
    return value


def equal(a, b):
    if isinstance(b, bool):
        return isinstance(a, bool) and a == b
    if isinstance(b, (int, float)):
        return isinstance(a, (int, float)) and not isinstance(a, bool) and math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(b, tuple):
        return isinstance(a, tuple) and len(a) == len(b) and all(equal(x, y) for x, y in zip(a, b))
    if isinstance(b, list):
        return isinstance(a, (list, tuple)) and len(a) == len(b) and all(equal(x, y) for x, y in zip(a, b))
    return type(a) is type(b) and a == b


def rule_violation(code, rules):
    parsed = ast.parse(code)
    if rules.get('noLoops'):
        blocked = (ast.For, ast.AsyncFor, ast.While, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)
        if any(isinstance(node, blocked) for node in ast.walk(parsed)):
            return 'usa laço, mas a regra noLoops proíbe'
    if rules.get('digitArithmetic'):
        for node in ast.walk(parsed):
            if isinstance(node, ast.Call):
                func = node.func
                name = func.id if isinstance(func, ast.Name) else func.attr if isinstance(func, ast.Attribute) else ''
                if name in ('int', 'eval', 'exec', 'compile', 'pow'):
                    return 'chama ' + name + ', proibido por digitArithmetic'
            if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Pow, ast.Mult)):
                if any(isinstance(v, ast.Constant) and v.value == 10 for v in (node.left, node.right)):
                    return 'usa potência/multiplicação por 10, proibido por digitArithmetic'
    return None


class Timeout(Exception):
    pass


def on_alarm(*_):
    raise Timeout('mais de 3 segundos')


def check(spec_id, spec):
    problems = []
    code = spec.get('solution') or ''
    violation = rule_violation(code, spec.get('rules') or {})
    if violation:
        problems.append('a solução ' + violation)
    compiled = compile(code, '<solucao>', 'exec')
    for number, (args, expected) in enumerate(spec['tests'], 1):
        args, expected = decode(args), decode(expected)
        namespace = {'__name__': '__teste__'}
        try:
            signal.alarm(3)
            exec(compiled, namespace)
            values = copy.deepcopy(args)
            result = namespace[spec['fn']](*values)
        except Exception as error:  # noqa: BLE001 - qualquer erro reprova a solução
            problems.append(f'teste {number} {args!r}: {error!r}')
            continue
        finally:
            signal.alarm(0)
        ok = equal(result, expected)
        if spec.get('returnType') == 'list' and not isinstance(result, list):
            ok = False
        if spec.get('unchanged') and values != args:
            problems.append(f'teste {number}: a solução altera a entrada')
        if not ok:
            problems.append(f'teste {number} {args!r}: esperado {expected!r}, obtido {result!r}')
    return problems


def main():
    signal.signal(signal.SIGALRM, on_alarm)
    specs = json.load(sys.stdin)
    failed = 0
    # Os programas das listas 1-5 têm corretor próprio (tests/check_programs.py).
    specs = {k: v for k, v in specs.items() if not v.get('program')}
    for spec_id, spec in specs.items():
        problems = check(spec_id, spec)
        if problems:
            failed += 1
            print(f'[{spec_id}]')
            for problem in problems:
                print('   -', problem)
    total = sum(len(s['tests']) for s in specs.values())
    print(f'{len(specs)} contratos, {total} casos, {failed} com problema')
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
