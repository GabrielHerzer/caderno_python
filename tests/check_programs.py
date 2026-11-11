"""Confere o corretor de programas (src/core/program-grader.js) em Python de verdade.

Entrada padrão: JSON com
  grader: código-fonte Python do corretor (o mesmo que roda no navegador);
  specs:  {id: {cases, solution, rules}} dos exercícios das listas 1-5;
  probes: [{name, id?, cases?, rules?, code, ok}] programas que devem passar (ok=true)
          ou ser reprovados (ok=false) em todos os casos do exercício.
Sai com código 1 se alguma solução de referência falhar ou algum probe der o resultado errado.
"""
import json
import signal
import sys


class Timeout(Exception):
    pass


def on_alarm(*_):
    raise Timeout('mais de 3 segundos')


def grade(env, code, cases, rules):
    signal.alarm(3)
    try:
        return env['grade_program'](code, cases, rules or {})
    finally:
        signal.alarm(0)


def describe(rows):
    return '; '.join(
        f"caso {i}: {'ok' if r['ok'] else 'falhou'} (esperado {r['expected']}, recebido {r['actual']!r}"
        + (f", erro {r['error']!r}" if r.get('error') else '')
        + ')'
        for i, r in enumerate(rows, 1)
    )


def main():
    signal.signal(signal.SIGALRM, on_alarm)
    data = json.load(sys.stdin)
    env = {'__name__': 'corretor'}
    exec(compile(data['grader'], '<corretor>', 'exec'), env)
    problems = []
    for spec_id, spec in data['specs'].items():
        try:
            rows = grade(env, spec['solution'], spec['cases'], spec.get('rules'))
        except BaseException as error:  # noqa: BLE001
            problems.append(f'[{spec_id}] a solução gerou {error!r}')
            continue
        if not rows or not all(r['ok'] for r in rows):
            problems.append(f'[{spec_id}] a solução não passa: {describe(rows)}')
    for probe in data['probes']:
        spec = data['specs'].get(probe.get('id'), {})
        cases = probe.get('cases') or spec.get('cases')
        rules = probe.get('rules', spec.get('rules'))
        try:
            rows = grade(env, probe['code'], cases, rules)
            passed = all(r['ok'] for r in rows)
            detail = describe(rows)
        except BaseException as error:  # noqa: BLE001 - regra violada ou erro de sintaxe reprova
            passed, detail = False, repr(error)
        if passed != probe['ok']:
            verb = 'deveria passar' if probe['ok'] else 'deveria ser reprovado'
            problems.append(f"[probe] {probe['name']}: {verb}. {detail}")
    for problem in problems:
        print('-', problem)
    total = sum(len(s['cases']) for s in data['specs'].values())
    print(f"{len(data['specs'])} programas, {total} casos, {len(data['probes'])} probes, {len(problems)} problemas")
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
