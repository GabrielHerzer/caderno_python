"use strict";
// Corretor dos programas das listas 1–5 (input()/print()), em Python. Roda no Web Worker, com o
// Pyodide, e nos testes (tests/check_programs.py), com o mesmo código-fonte.
//
// Cada caso de teste tem:
//   stdin:  as linhas que o aluno digitaria, uma por input();
//   random: os valores que random.randint/randrange/choice devolvem, em ordem (opcional);
//   expect: o que precisa aparecer no que o programa imprime (o texto dos input() não conta):
//     7                         o número 7, em qualquer lugar (aceita 7.0, 7,00);
//     "inválid|incorret"        uma das palavras, sem diferenciar maiúsculas e acentos;
//     {label: "maior", value: 9}  o número 9 na mesma linha da palavra maior (ou na seguinte);
//     {label: "pares", value: [2, 4]}  a lista [2, 4] nessa linha;
//     {list: [1, 2, 3]}         a lista [1, 2, 3] impressa (números ou palavras);
//   expectAny: várias alternativas de expect; basta uma;
//   absent: palavras que não podem aparecer.
// O programa precisa ler exatamente as entradas do caso e fazer todos os sorteios.
const PROGRAM_GRADER = String.raw`
import ast, builtins, contextlib, io, math, random, re, traceback, unicodedata

class _FaltouEntrada(BaseException):
    pass

def _fold(text):
    text = unicodedata.normalize('NFD', str(text).lower())
    return ''.join(c for c in text if unicodedata.category(c) != 'Mn')

# Número não colado a letras (lado1 não vira 1). O sinal só conta se não vier depois de letra ou dígito.
_NUMBER = {
    '.': re.compile(r'(?:(?<![\w.,])-)?(?<![^\W\d])\d+(?:\.\d+)?(?!\d)'),
    ',': re.compile(r'(?:(?<![\w.,])-)?(?<![^\W\d])\d+(?:,\d+)?(?!\d)'),
}

def _numbers(text, sep):
    return [float(m.replace(',', '.')) for m in _NUMBER[sep].findall(text)]

def _close(a, b):
    return abs(a - b) <= 0.01 + 1e-9 or math.isclose(a, b, rel_tol=1e-9)

def _words_pattern(words):
    alts = [re.escape(_fold(w.strip())) for w in words.split('|') if w.strip()]
    return re.compile(r'(?<![a-z0-9])(?:' + '|'.join(alts) + ')')

def _groups(text):
    return re.findall(r'[\[(]([^\[\]()]*)[\])]', text) + [text]

def _same_list(text, expected, sep):
    for group in _groups(text):
        if expected and all(isinstance(v, str) for v in expected):
            if re.findall(r'[a-z0-9]+', group) == [_fold(v) for v in expected]:
                return True
        else:
            found = _numbers(group, sep)
            if len(found) == len(expected) and all(_close(a, b) for a, b in zip(found, expected)):
                return True
    return False

def _label_lines(lines, label, sep):
    pattern = _words_pattern(label)
    for i, line in enumerate(lines):
        if pattern.search(line):
            if _numbers(line, sep):
                yield line
            else:
                following = [l for l in lines[i + 1:] if l.strip()]
                yield line + ' ' + (following[0] if following else '')

def _meets(expect, text, sep):
    lines = text.splitlines()
    pool = _numbers(text, sep)
    for item in expect:
        if isinstance(item, bool):
            return False
        if isinstance(item, (int, float)):
            hit = next((i for i, n in enumerate(pool) if _close(n, item)), None)
            if hit is None:
                return False
            pool.pop(hit)
        elif isinstance(item, str):
            if not _words_pattern(item).search(text):
                return False
        elif 'list' in item:
            if not _same_list(text, item['list'], sep):
                return False
        else:
            value = item['value']
            segments = list(_label_lines(lines, item['label'], sep))
            if isinstance(value, list):
                ok = any(_same_list(s, value, sep) for s in segments)
            else:
                ok = any(any(_close(n, value) for n in _numbers(s, sep)) for s in segments)
            if not ok:
                return False
    return True

def _fmt(n):
    if isinstance(n, float) and not n.is_integer():
        return ('%.2f' % n).rstrip('0').rstrip('.')
    return str(int(n)) if isinstance(n, float) else str(n)

def _describe_value(v):
    if isinstance(v, list):
        return '[' + ', '.join(repr(x) if isinstance(x, str) else _fmt(x) for x in v) + ']'
    return _fmt(v)

def _describe(item):
    if isinstance(item, (int, float)):
        return _describe_value(item)
    if isinstance(item, str):
        return ' ou '.join('“' + w + '”' for w in item.split('|'))
    if 'list' in item:
        return _describe_value(item['list'])
    return item['label'].split('|')[0] + ': ' + _describe_value(item['value'])

def _concise(text, limit=400):
    text = text.strip()
    if not text:
        return '(nada foi impresso)'
    return text if len(text) <= limit else text[:limit - 3] + '...'

def _error_text(error):
    frames = [f for f in traceback.extract_tb(error.__traceback__) if f.filename == '<seu_programa>']
    where = 'Linha %d: ' % frames[-1].lineno if frames else ''
    return where + ''.join(traceback.format_exception_only(type(error), error)).strip()

def _check_rules(tree, rules):
    if rules.get('noMaxMin'):
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in ('max', 'min'):
                raise ValueError('Restrição do exercício: descubra o maior e o menor sem usar max() e min().')

def _run(compiled, case):
    feed = [str(v) for v in case.get('stdin') or []]
    draws = list(case.get('random') or [])
    used = {'input': 0, 'random': 0, 'outside': False}

    def fake_input(prompt=''):
        if used['input'] >= len(feed):
            raise _FaltouEntrada()
        used['input'] += 1
        return feed[used['input'] - 1]

    original = {name: getattr(random, name) for name in ('randint', 'randrange', 'choice')}

    def take(valid, fallback):
        if used['random'] < len(draws) and valid(draws[used['random']]):
            used['random'] += 1
            return draws[used['random'] - 1]
        used['outside'] = True
        return fallback()

    def randint(a, b):
        return take(lambda v: a <= v <= b, lambda: original['randint'](a, b))

    def randrange(start, stop=None, step=1):
        if stop is None:
            start, stop = 0, start
        return take(lambda v: v in range(start, stop, step), lambda: original['randrange'](start, stop, step))

    def choice(seq):
        return take(lambda v: v in seq, lambda: original['choice'](seq))

    out = io.StringIO()
    error = None
    saved_input = builtins.input
    if draws:
        random.randint, random.randrange, random.choice = randint, randrange, choice
    builtins.input = fake_input
    try:
        with contextlib.redirect_stdout(out):
            exec(compiled, {'__name__': '__main__', 'input': fake_input})
    except SystemExit:
        pass
    except _FaltouEntrada:
        error = ('O programa pediu a entrada número %d, mas este caso só tem %d. '
                 'Confira a condição de parada do laço e quantos input() o enunciado pede.') % (len(feed) + 1, len(feed))
    except Exception as e:
        error = _error_text(e)
        used['crashed'] = True
    finally:
        builtins.input = saved_input
        for name, function in original.items():
            setattr(random, name, function)
    return out.getvalue(), used, error

def grade_program(code, cases, rules=None):
    tree = ast.parse(code, '<seu_programa>')
    _check_rules(tree, rules or {})
    compiled = compile(tree, '<seu_programa>', 'exec')
    rows = []
    for case in cases:
        printed, used, error = _run(compiled, case)
        text = _fold(printed)
        options = case.get('expectAny') or [case.get('expect') or []]
        found = any(_meets(expect, text, sep) for sep in '.,' for expect in options)
        banned = [w for w in case.get('absent') or [] if _words_pattern(w).search(text)]
        feed = case.get('stdin') or []
        draws = case.get('random') or []
        if not error and used['input'] < len(feed):
            error = ('O programa leu %d de %d entradas deste caso. '
                     'Confira se ele pede tudo o que o enunciado manda, na ordem.') % (used['input'], len(feed))
        if not error and draws and (used['outside'] or used['random'] < len(draws)):
            error = ('O corretor controla os sorteios de random.randint(1, 100): este caso tem %d sorteios e '
                     'o programa usou %d. Sorteie com randint, um número por vez.') % (len(draws), used['random'])
        if not error and banned:
            error = 'A saída não deveria conter ' + ' nem '.join('“' + w.split('|')[0] + '”' for w in banned) + ' neste caso.'
        ok = found and not error
        given = ' ⏎ '.join(str(v) for v in feed) if feed else '(sem entradas)'
        if draws:
            given += ' · sorteios: ' + ', '.join(str(v) for v in draws)
        expected = ' · '.join(_describe(i) for i in options[0]) or '(nada)'
        if len(options) > 1:
            expected += ' (ou ' + ' · '.join(_describe(i) for i in options[1]) + ')'
        rows.append({
            'ok': ok,
            'input': given,
            'expected': expected,
            'actual': _concise(printed),
            'label': 'Saída correta' if ok else 'Erro durante a execução' if used.get('crashed') else 'Saída diferente do esperado',
            'error': error or ('' if ok else 'Não encontrei na saída: ' + expected + '.'),
        })
    return rows

def grade_program_json(code, cases, rules=None):
    # Para o Web Worker: erro de sintaxe ou regra violada vira uma mensagem curta, sem o
    # traceback interno do Pyodide.
    import json
    try:
        return json.dumps({'rows': grade_program(code, cases, rules)}, ensure_ascii=False)
    except (SyntaxError, ValueError) as error:
        return json.dumps({'error': ''.join(traceback.format_exception_only(type(error), error)).strip()}, ensure_ascii=False)
`;
