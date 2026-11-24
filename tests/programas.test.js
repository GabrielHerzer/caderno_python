"use strict";
// Listas 1–5: programas com input()/print(), corrigidos pela saída (src/core/program-grader.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { tick, boot, global, go, stored, type } = require("./helpers");

const python = ["python3", "python"].find((cmd) => !spawnSync(cmd, ["--version"]).error);

// Programas que o corretor precisa aprovar (ok: true) ou reprovar (ok: false).
const PROBES = [
  // Regras gerais do corretor, com casos próprios.
  {
    name: "aceita vírgula como separador decimal",
    cases: [{ stdin: ["2"], expect: [2.5] }],
    code: "n = int(input())\nprint('valor:', str(n * 1.25).replace('.', ','))",
    ok: true,
  },
  {
    name: "números do texto do input() não contam como saída",
    cases: [{ stdin: ["3"], expect: [10] }],
    code: "x = input('Digite um número até 10: ')\nprint('ok')",
    ok: false,
  },
  {
    name: "deixar entradas sem ler reprova",
    cases: [{ stdin: ["3", "4"], expect: [3] }],
    code: "print(int(input()))",
    ok: false,
  },
  {
    name: "pedir mais entradas do que o caso tem reprova",
    cases: [{ stdin: ["3"], expect: [3] }],
    code: "a = input()\nb = input()\nprint(a)",
    ok: false,
  },
  {
    name: "rótulo e número na mesma linha",
    cases: [
      {
        expect: [
          { label: "maior", value: 9 },
          { label: "menor", value: 3 },
        ],
      },
    ],
    code: "print('O maior é 9')\nprint('Menor: 3')",
    ok: true,
  },
  {
    name: "rótulos trocados reprovam",
    cases: [
      {
        expect: [
          { label: "maior", value: 9 },
          { label: "menor", value: 3 },
        ],
      },
    ],
    code: "print('Maior: 3')\nprint('Menor: 9')",
    ok: false,
  },
  {
    name: "rótulo numa linha e valor na seguinte",
    cases: [{ expect: [{ label: "pares", value: [2, 4] }] }],
    code: "print('Pares:')\nprint([2, 4])",
    ok: true,
  },
  {
    name: "a palavra par não casa dentro de ímpar",
    cases: [{ expect: [{ label: "par", value: [2, 4] }] }],
    code: "print('Ímpares:', [2, 4])",
    ok: false,
  },
  {
    name: "lista impressa precisa ser exatamente a esperada",
    cases: [{ expect: [{ list: [1, 2, 3] }] }],
    code: "print([1, 2, 3, 4])",
    ok: false,
  },
  {
    name: "lista de palavras ignora aspas e maiúsculas",
    cases: [{ expect: [{ list: ["the", "python"] }] }],
    code: "print(['The', 'Python'])",
    ok: true,
  },
  {
    name: "palavra-chave ignora acentos e maiúsculas",
    cases: [{ expect: ["equilátero"] }],
    code: "print('EQUILATERO')",
    ok: true,
  },
  {
    name: "palavra proibida reprova",
    cases: [{ expect: ["bissext"], absent: ["não"] }],
    code: "print('O ano não é bissexto')",
    ok: false,
  },
  {
    name: "sys.exit() no fim não é erro",
    cases: [{ expect: [7] }],
    code: "import sys\nprint(7)\nsys.exit()",
    ok: true,
  },
  {
    name: "sorteios de randint vêm do caso",
    cases: [{ random: [5, 9, 2], expect: [{ label: "maior", value: 9 }] }],
    code: "from random import randint\nm = 0\nfor _ in range(3):\n    m = max(m, randint(1, 100))\nprint('maior', m)",
    ok: true,
  },
  {
    name: "sortear com sample foge do controle e reprova",
    cases: [{ random: [5, 9, 2], expect: [{ label: "maior", value: 9 }] }],
    code: "import random\nprint('maior', max(random.sample(range(1, 101), 3)))",
    ok: false,
  },
  // Programas errados ou incompletos nos exercícios das listas.
  {
    name: "soma que multiplica",
    id: "soma_dois",
    ok: false,
    code: "a = int(input())\nb = int(input())\nprint(a * b)",
  },
  {
    name: "nota que pergunta uma vez só",
    id: "nota_valida",
    ok: false,
    code: "n = float(input())\nif n < 0 or n > 10:\n    print('Valor inválido')",
  },
  {
    name: "Fibonacci deslocado",
    id: "fibonacci",
    ok: false,
    code: "n = int(input())\na, b = 1, 1\nfor _ in range(n):\n    a, b = b, a + b\nprint(a)",
  },
  {
    name: "triângulo que aceita lados degenerados",
    id: "triangulo",
    ok: false,
    code: "a = float(input())\nb = float(input())\nc = float(input())\nif a + b >= c and a + c >= b and b + c >= a:\n    if a == b == c:\n        print('equilátero')\n    elif a == b or a == c or b == c:\n        print('isósceles')\n    else:\n        print('escaleno')\nelse:\n    print('não forma triângulo')",
  },
  {
    name: "bissexto só com % 4",
    id: "bissexto",
    ok: false,
    code: "ano = int(input())\nif ano % 4 == 0:\n    print('bissexto')\nelse:\n    print('não é bissexto')",
  },
  {
    name: "tintas sem arredondar as latas para cima",
    id: "tintas",
    ok: false,
    code: "area = float(input())\nlatas = int(area / 3 / 18)\nprint('Latas:', latas)\nprint('Preço: R$', latas * 80)",
  },
  {
    name: "maior e menor com max e min",
    id: "maior_menor_sorteio",
    ok: false,
    code: "from random import randint\nv = [randint(1, 100) for _ in range(10)]\nprint(v)\nprint('Maior:', max(v))\nprint('Menor:', min(v))",
  },
  // Soluções reais de aluno (exercicios/lista01.md e lista02.md), com prompts e textos próprios.
  {
    name: "aluno · lista 1, exercício 1",
    id: "soma_dois",
    ok: true,
    code: "numero1 = int(input('digite o primeiro número: '))\nnumero2 = int(input('digito o segundo número: '))\n\nsoma = numero1 + numero2\n\nprint('a soma dos dois dúmeros é:', soma)",
  },
  {
    name: "aluno · lista 1, exercício 4",
    id: "aumento_salario",
    ok: true,
    code: "salario = int(input('salario: '))\nporcentagem = int(input('porcentagem: '))\n\naumento = (salario * porcentagem / 100)\nnovo_salario = salario + aumento\n\nprint('valor do aumento:', aumento)\nprint('novo slario:', novo_salario)",
  },
  {
    name: "aluno · lista 2, exercício 1",
    id: "triangulo",
    ok: true,
    code: 'lado1 = float(input("Digite o primeiro lado: "))\nlado2 = float(input("Digite o segundo lado: "))\nlado3 = float(input("Digite o terceiro lado: "))\n\nif lado1 + lado2 > lado3 and lado1 + lado3 > lado2 and lado2 + lado3 > lado1:\n    print("Os valores formam um triângulo.")\n\n    if lado1 == lado2 == lado3:\n        print("O triângulo é equilátero.")\n    elif lado1 == lado2 or lado1 == lado3 or lado2 == lado3:\n        print("O triângulo é isósceles.")\n    else:\n        print("O triângulo é escaleno.")\nelse:\n    print("Os valores não formam um triângulo.")',
  },
  {
    name: "aluno · lista 2, exercício 2",
    id: "bissexto",
    ok: true,
    code: 'ano = int(input("Digite um ano: "))\n\nif ano % 400 == 0 or (ano % 4 == 0 and ano % 100 != 0):\n    print("O ano é bissexto")\nelse:\n    print("O ano não é bissexto")',
  },
];

test(
  "o corretor de programas aprova as soluções de referência e reprova programas errados",
  { skip: !python && "Python não encontrado" },
  async () => {
    const w = await boot();
    const input = global(
      w,
      `JSON.stringify({
        grader: PROGRAM_GRADER,
        specs: Object.fromEntries(PROGRAM_LISTS.map((p) => [p.id, { cases: p.cases, solution: p.solution, rules: p.rules }])),
        probes: ${JSON.stringify(PROBES)},
      })`,
    );
    const run = spawnSync(python, ["-I", path.join(__dirname, "check_programs.py")], {
      input,
      encoding: "utf8",
    });
    assert.equal(run.status, 0, run.stdout + run.stderr);
  },
);

test("as pastas das listas 1 a 5 aparecem no catálogo com todos os exercícios", async () => {
  const w = await boot();
  await go(w, "catalogo");
  const counts = {};
  for (const n of [1, 2, 3, 4, 5]) {
    const button = w.document.querySelector(`[data-folder="${n}"]`);
    assert.ok(button, `pasta ${n}`);
    counts[n] = Number(button.querySelector("small").textContent.match(/(\d+) exercícios/)[1]);
  }
  assert.deepEqual(counts, { 1: 11, 2: 7, 3: 5, 4: 5, 5: 5 });
  w.document.querySelector('[data-folder="1"]').click();
  await tick();
  const titles = [...w.document.querySelectorAll("#results .card h3")].map((h) => h.textContent);
  assert.equal(titles[0], "Soma de dois inteiros");
  assert.equal(titles.length, 11);
  assert.match(titles.at(-1), /2 elevado a 10000/); // 11 vem depois de 2, não entre 1 e 2
});

test("a oficina pede um programa e manda os casos e o corretor ao Python", async () => {
  const w = await boot();
  w.openCoding("soma_dois");
  await tick();
  const page = w.document.querySelector("#app").textContent;
  assert.match(page, /Escreva um programa/);
  assert.doesNotMatch(page, /Escreva a função/);
  type(w, "#python-editor", "a = int(input())\nb = int(input())\nprint(a + b)");
  w.document.querySelector("#check-code").click();
  await tick(20);
  const sent = w.__workerData;
  assert.equal(sent.program, true);
  assert.equal(sent.cases.length, global(w, "CODE_SPECS.soma_dois.cases.length"));
  assert.match(sent.grader, /def grade_program/);
  const last = stored(w).attempts.at(-1);
  assert.equal(last.id, "soma_dois");
  assert.equal(last.correct, true);
  assert.match(last.answer, /^\d+\/\d+ casos$/);
});

test("o exercício dos telefones já começa com a lista no editor", async () => {
  const w = await boot();
  w.openCoding("telefones");
  await tick();
  const code = w.document.querySelector("#python-editor").value;
  assert.match(code, /213752/);
  assert.match(code, /678315/);
});

test("as questões objetivas das listas 1–5 têm alternativas distintas e a certa entre elas", async () => {
  const w = await boot();
  const items = JSON.parse(
    global(w, `JSON.stringify(EXERCISES.filter((e) => PROGRAM_LISTS.some((p) => p.id === e.id)))`),
  );
  assert.equal(items.length, 33);
  for (const e of items) {
    assert.ok(e.variants.length >= 1, e.id);
    for (const v of e.variants) {
      assert.ok(v.choices.length >= 3, `${e.id}: ${v.choices.join(" | ")}`);
      assert.equal(new Set(v.choices).size, v.choices.length, `${e.id}: ${v.choices.join(" | ")}`);
      assert.ok(v.answer >= 0 && v.answer < v.choices.length, e.id);
      assert.doesNotMatch(v.choices.join(" "), /None|undefined|NaN/, e.id);
    }
  }
  const soma = items.find((e) => e.id === "soma_dois").variants[0];
  assert.match(soma.q, /10 e 25/);
  assert.equal(soma.choices[soma.answer], "35");
});

test("os ids das listas 1–5 são únicos e não colidem com os demais exercícios", async () => {
  const w = await boot();
  const { programs, others } = JSON.parse(
    global(
      w,
      `JSON.stringify({ programs: PROGRAM_LISTS.map((p) => p.id), others: SUPPLIED_LISTS.map((s) => s.id).concat(Object.keys(CODE_SPECS).filter((id) => !CODE_SPECS[id].program)) })`,
    ),
  );
  assert.equal(new Set(programs).size, programs.length);
  assert.deepEqual(
    programs.filter((id) => others.includes(id)),
    [],
  );
});

test("a página de fontes lista os programas das listas 1 a 5", async () => {
  const w = await boot();
  await go(w, "fontes");
  const rows = [...w.document.querySelectorAll("tbody tr")].map((tr) => tr.textContent);
  assert.match(rows[0], /^Lista 111/);
  assert.match(rows[0], /Soma de dois inteiros/);
});
