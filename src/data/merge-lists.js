"use strict";
// Junta as listas recebidas (supplied-lists.js) ao catálogo, às lições e aos contratos de código.
function pythonRepr(v) {
  if (v === null) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (Array.isArray(v)) return "[" + v.map(pythonRepr).join(", ") + "]";
  if (typeof v === "object" && v.__int__) return v.__int__;
  if (typeof v === "object" && v.__tuple__)
    return (
      "(" + v.__tuple__.map(pythonRepr).join(", ") + (v.__tuple__.length === 1 ? "," : "") + ")"
    );
  return typeof v === "string" ? pythonStr(v) : String(v);
}

// Como o repr() do Python mostra uma string: aspas simples, ou duplas se ela contiver ' e não ".
function pythonStr(s) {
  const quote = s.includes("'") && !s.includes('"') ? '"' : "'";
  const body = s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replaceAll(quote, "\\" + quote);
  return quote + body + quote;
}

// Alternativas erradas das questões geradas. Imitam erros comuns e têm o mesmo tipo da resposta
// certa, para a questão não se resolver só pelo tipo. None (esqueceu o return) entra no fim.
// outputs: todas as respostas esperadas nos testes da função.
function wrongAnswers(expected, args, outputs) {
  if (typeof expected === "boolean") return [!expected, null];
  // Função que classifica a entrada em poucas saídas (ex.: 0/1/2, '7:00'/'10:00'/'off', cada uma
  // repetida nos testes): a confusão real é trocar uma saída pela outra.
  const distinct = [...new Map(outputs.map((o) => [pythonRepr(o), o])).values()];
  const others = distinct.length <= 3 && outputs.length >= 2 * distinct.length ? distinct : [];
  if (typeof expected === "number") {
    const inputs = args.filter((a) => typeof a === "number");
    return [...others, expected + 1, expected - 1, ...inputs, expected * 2, null];
  }
  if (typeof expected === "string") {
    const inputs = args.filter((a) => typeof a === "string");
    return [
      ...others,
      ...inputs, // devolveu a entrada sem transformar
      expected.slice(0, -1), // perdeu o último caractere no fatiamento
      expected.slice(1), // perdeu o primeiro
      expected + expected.slice(-1), // repetiu o último
      [...expected].reverse().join(""), // inverteu
      null,
    ];
  }
  if (Array.isArray(expected)) {
    const inputs = args.filter(Array.isArray);
    return [
      ...inputs,
      [...expected].reverse(),
      expected.slice(0, -1),
      [...expected, expected.at(-1)],
      expected.slice(1),
      null,
    ];
  }
  return [null];
}

function quizChoices(expected, args, outputs) {
  const choices = [pythonRepr(expected)];
  for (const wrong of wrongAnswers(expected, args, outputs)) {
    const text = pythonRepr(wrong);
    if (!choices.includes(text)) choices.push(text);
    if (choices.length === 4) break;
  }
  return choices;
}
EXERCISES.forEach((e) => {
  e.enade = ["arroz", "alturas", "matriz"].includes(e.id);
  if (!SUPPLIED_LISTS.some((s) => s.id === e.id) && !e.enade) {
    e.list = null;
    e.extra = true;
    e.sourceNote = "Treino complementar autoral · fora das listas recebidas";
  }
});
SUPPLIED_LISTS.forEach((s) => {
  const old = EXERCISES.find((e) => e.id === s.id);
  const quiz = s.tests.slice(0, 2).map(([args, expected]) => {
    const choices = quizChoices(
        expected,
        args,
        s.tests.map((t) => t[1]),
      ),
      correct = choices[0];
    return {
      q: `Segundo o enunciado, qual é o retorno de ${s.fn}(${args.map(pythonRepr).join(", ")})?`,
      choices,
      answer: 0,
      explain: `O resultado esperado nos testes recebidos é ${correct}. ${s.steps[0] || ""}`,
    };
  });
  const data = {
    id: s.id,
    title: s.fn,
    list: s.list,
    letter: s.letter,
    supplied: true,
    extra: false,
    enade: false,
    ref: `Lista ${s.list} · ${s.letter} · material enviado`,
    sourceNote: `Lista ${s.list} · ${s.letter} · material enviado`,
    topics: [...new Set([...s.topics, "funções e return"])],
    summary: s.task,
    notes: s.notes,
    priority: !!old?.priority,
    hint: s.steps.slice(0, 2),
    steps: s.steps,
    solution: s.solution,
    variants: old?.variants || quiz,
  };
  if (old) Object.assign(old, data);
  else EXERCISES.push(data);
  CODE_SPECS[s.id] = {
    fn: s.fn,
    signature: s.signature,
    task: s.task,
    tests: s.tests,
    solution: s.solution,
    notes: s.notes,
    rules: s.rules,
    returnType: s.returnType,
  };
});
// Listas 1–5: programas com input()/print() (program-lists.js), corrigidos pela saída.
function formatNumber(n) {
  return String(Math.round(n * 100) / 100);
}

function joinPt(items) {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} e ${items.at(-1)}` : items.join("");
}

// Questão objetiva a partir do primeiro caso que espera um número: "que número o programa mostra?".
// Exercícios sem número na saída (palavras, listas) trazem questões escritas à mão em quiz.
function programQuiz(p) {
  if (p.quiz) return p.quiz;
  const numeric = (x) => typeof x === "number" || typeof x?.value === "number";
  const value = (x) => (typeof x === "number" ? x : x.value);
  for (const c of p.cases) {
    const expect = c.expect || c.expectAny[0];
    const item = expect.find(numeric);
    if (item === undefined) continue;
    const given = c.random
      ? `se os sorteios forem ${c.random.join(", ")}, `
      : c.stdin?.length
        ? `com as entradas ${joinPt(c.stdin)}, `
        : "";
    const label = typeof item === "number" ? "" : ` como ${item.label.split("|")[0]}`;
    const e = value(item);
    const others = expect.filter(numeric).map(value);
    const inputs = [...(c.stdin || []), ...(c.random || [])].map(Number).filter(Number.isFinite);
    const choices = [];
    for (const v of [e, ...others, e + 1, e - 1, ...inputs, e * 2, e + 10]) {
      const text = formatNumber(v);
      if (!choices.includes(text)) choices.push(text);
      if (choices.length === 4) break;
    }
    return [
      {
        q: `Pelo enunciado, ${given}qual número o programa deve mostrar${label}?`,
        choices,
        answer: 0,
        explain: `O valor esperado é ${choices[0]}. ${p.steps[0]}`,
      },
    ];
  }
  return [];
}

PROGRAM_LISTS.forEach((p) => {
  EXERCISES.push({
    id: p.id,
    title: p.title,
    list: p.list,
    letter: p.letter,
    supplied: true,
    program: true,
    extra: false,
    enade: false,
    ref: `Lista ${p.list} · ${p.letter} · material enviado`,
    sourceNote: `Lista ${p.list} · ${p.letter} · material enviado`,
    topics: p.topics,
    summary: p.task,
    notes: p.notes,
    priority: false,
    hint: p.steps.slice(0, 2),
    steps: p.steps,
    solution: p.solution,
    variants: programQuiz(p),
  });
  CODE_SPECS[p.id] = {
    program: true,
    task: p.task,
    cases: p.cases,
    solution: p.solution,
    notes: p.notes,
    rules: p.rules || {},
    starter: p.starter || "",
  };
});

// Preserve old objective variants for saved attempt compatibility, but repair outdated guidance.
const sumExercise = EXERCISES.find((e) => e.id === "invertida");
sumExercise.variants[0] = {
  q: "Os dígitos vêm em ordem invertida: [3, 1, 5] e [5, 9, 2]. Sem converter as listas em números inteiros, qual lista a soma deve devolver?",
  choices: ["[8, 0, 8]", "[8, 10, 7]", "[8, 8]", "[8, 0, 7]"],
  answer: 0,
  explain:
    "Some posição por posição incluindo o transporte: 3+5=8; 1+9=10; 5+2+1=8. O resultado é [8, 0, 8].",
};
const addLessons = [
  {
    topic: "startswith",
    title: "startswith · conferir o início",
    description:
      "Retorna um booleano que informa se uma string começa com o prefixo indicado. O nome correto é startswith, não starswith.",
    syntax: "texto.startswith(prefixo)",
    example: "print('janela'.startswith('ja'))  # True\nprint('Janela'.startswith('ja'))  # False",
    steps: [
      "Escolha o prefixo procurado.",
      "Compare o início da string com startswith.",
      "Para números, transforme a potência em texto apenas para examinar seu prefixo.",
    ],
    pitfall:
      "Não confunda retorno booleano com posição. Em inip2, devolva o expoente, não o valor da potência.",
    check: "Qual a diferença entre conferir um prefixo e procurar com in?",
  },
  {
    topic: "find",
    title: "find · localizar trechos",
    description:
      "Retorna o índice da primeira ocorrência de uma substring, ou -1 se não encontrar.",
    syntax: "texto.find(trecho)\ntexto.find(trecho, inicio)",
    example: "print('casa azul'.find('azul'))  # 5\nprint('casa azul'.find('verde')) # -1",
    steps: [
      "Guarde a posição retornada.",
      "Teste explicitamente se é diferente de -1.",
      "Use os índices para recortar o texto sem perder o que vem antes e depois.",
    ],
    pitfall: "Não use apenas if posicao: índice 0 é válido, mas é falso em um if; -1 é verdadeiro.",
    check: "Por que uma ocorrência no início precisa de atenção na condição?",
  },
  {
    topic: "count",
    title: "count · contar ocorrências",
    description:
      "str.count conta ocorrências não sobrepostas de um trecho. Essa regra serve para count_hi, mas não para busca, que exige sobreposição.",
    syntax: "texto.count(trecho)",
    example:
      "print('hihihi'.count('hi'))  # 3\nprint('aaaa'.count('aa'))    # 2\n# Com sobreposição, aa aparece em três posições.",
    steps: [
      "Leia se o exercício permite sobreposição.",
      "Para contar sem sobreposição, use count.",
      "Para sobreposição, avance uma posição de cada vez e compare janelas.",
    ],
    pitfall:
      "Contar quantos números contêm o dígito 2 não é o mesmo que contar quantos dígitos 2 existem: 22 contribui com dois.",
    check: "Quantas posições diferentes podem começar aa em aaaa?",
  },
  {
    topic: "lower",
    title: "lower · comparar sem maiúsculas",
    description:
      "Produz uma nova string em minúsculas. Use somente quando o contrato pedir normalização.",
    syntax: "texto.lower()",
    example: "s = 'PyThOn'\nprint(s.lower())  # python\nprint(s)          # PyThOn",
    steps: [
      "Normalize as duas entradas se a comparação ignorar caixa.",
      "Guarde os retornos.",
      "Depois compare sufixos, prefixos ou igualdade.",
    ],
    pitfall: "A lista pede lower em end_other, mas não em anagrama ou palindrome.",
    check: "Por que aplicar lower a apenas uma das entradas pode falhar?",
  },
  {
    topic: "ordenação",
    title: "sorted e key · ordenar por uma regra",
    description:
      "sorted devolve uma nova lista. key recebe uma função que extrai o valor usado na comparação.",
    syntax: "sorted(sequencia)\nsorted(sequencia, key=funcao)",
    example:
      "palavras = ['sol', 'a', 'lua']\nprint(sorted(palavras, key=len))  # ['a', 'sol', 'lua']",
    steps: [
      "Identifique o critério de ordenação.",
      "Se necessário, escreva uma função que devolva a chave.",
      "Empates preservam a ordem relativa original.",
    ],
    pitfall:
      "Em sort_last, a chave é o último elemento da tupla. Em x_antes, ordene dois grupos separadamente.",
    check: "Qual a diferença entre sorted(lista) e lista.sort()?",
  },
  {
    topic: "split e join",
    title: "split e join · separar e reunir",
    description:
      "split sem argumento divide por espaços em branco. join reúne uma sequência de strings usando um separador.",
    syntax: "palavras = frase.split()\nresultado = separador.join(palavras)",
    example:
      "p = '  sol   e lua '.split()\nprint(p)              # ['sol', 'e', 'lua']\nprint('-'.join(p))    # sol-e-lua",
    steps: [
      "Separe a frase em palavras.",
      "Transforme cada palavra.",
      "Junte caracteres sem separador e palavras com um espaço.",
    ],
    pitfall:
      "join exige strings; não aceita números diretamente. set remove repetidos, mas não define a ordem desejada.",
    check: "Qual separador usar para reunir letras de uma mesma palavra?",
  },
  {
    topic: "resto da divisão",
    title: "% e // · resto e quociente",
    description:
      "% dá o resto e // dá o quociente inteiro. São úteis para paridade, dígitos e transporte.",
    syntax: "resto = a % b\nquociente = a // b",
    example: "print(17 % 5)   # 2\nprint(17 // 5)  # 3",
    steps: [
      "Escolha a base: 2 para paridade, 10 para dígitos, 5 para tijolos grandes.",
      "Use o resto para o que não completa uma unidade da base.",
      "Use o quociente para quantas unidades completas cabem.",
    ],
    pitfall: "Na soma invertida, inclua o transporte anterior antes de calcular resto e quociente.",
    check: "Por que o novo transporte deve depender também do transporte recebido?",
  },
  {
    topic: "entrada e saída",
    title: "input e print · conversar com o usuário",
    description:
      "input() mostra uma mensagem e devolve o que a pessoa digitou, sempre como texto. Converta com int() ou float() antes de fazer contas. print() mostra valores separados por espaço.",
    syntax:
      "texto = input('Mensagem: ')\nnumero = int(input('Idade: '))\nprint('Resultado:', numero)",
    example:
      "a = int(input('Primeiro: '))   # digite 3\nb = int(input('Segundo: '))    # digite 4\nprint('Soma:', a + b)          # Soma: 7",
    steps: [
      "Leia cada valor com input(), na ordem pedida.",
      "Converta: int() para inteiros, float() quando pode haver casas decimais.",
      "Calcule e mostre o resultado com print().",
    ],
    pitfall:
      "Sem conversão, '3' + '4' dá '34': input() devolve texto. E int('1.5') dá erro; use float().",
    check: "Por que int(input()) falha quando a pessoa digita 2.5?",
  },
  {
    topic: "operadores",
    title: "Operadores aritméticos · / , //, % e **",
    description:
      "/ é a divisão real (sempre float), // é a divisão inteira, % é o resto e ** é a potência. Percentuais viram multiplicação: 11% de x é x * 0.11.",
    syntax: "x / y\nx // y\nx % y\nx ** y",
    example:
      "print(7 / 2)    # 3.5\nprint(7 // 2)   # 3\nprint(7 % 2)    # 1\nprint(2 ** 10)  # 1024",
    steps: [
      "Escreva a fórmula do enunciado em Python, com parênteses onde a ordem importa.",
      "Use / quando o resultado pode ter casas decimais.",
      "Confira com um exemplo feito à mão.",
    ],
    pitfall:
      "(f - 32) * 5 / 9 não é o mesmo que f - 32 * 5 / 9: multiplicação vem antes da subtração.",
    check: "Quanto vale 150 / 100 e quanto vale 150 // 100?",
  },
  {
    topic: "random",
    title: "random · sortear números",
    description:
      "randint(a, b) sorteia um inteiro de a até b, incluindo os dois extremos. Cada chamada faz um sorteio novo.",
    syntax: "from random import randint\nn = randint(1, 100)",
    example:
      "from random import randint\nnumeros = []\nfor _ in range(5):\n    numeros.append(randint(1, 100))\nprint(numeros)",
    steps: [
      "Importe randint do módulo random.",
      "Chame randint uma vez por número que precisa sortear.",
      "Guarde os sorteios numa lista para usar depois.",
    ],
    pitfall:
      "Na oficina, o corretor controla os sorteios de randint para conferir a saída; random.sample sorteia sem passar por ele.",
    check: "randint(1, 100) pode devolver 100?",
  },
];
LESSONS.push(...addLessons);
for (const l of LESSONS) {
  l.ids = [
    ...new Set([
      ...(l.ids || []),
      ...EXERCISES.filter((e) => e.supplied && e.topics.includes(l.topic)).map((e) => e.id),
    ]),
  ];
}
Object.assign(
  LESSONS.find((l) => l.topic === "soma de listas invertidas"),
  {
    syntax: "total = digito1 + digito2 + vai_um\ndigito = total % 10\nvai_um = total // 10",
    steps: [
      "Percorra os dígitos de listas de mesmo tamanho.",
      "Some os dois dígitos e o transporte anterior.",
      "Use % 10 para o novo dígito e // 10 para o novo transporte.",
      "Inclua o transporte final quando necessário.",
    ],
    pitfall:
      "Não reconstrua os números inteiros para somá-los. A solução deve operar nos dígitos, conforme a lista 14-G.",
  },
);
Object.assign(
  LESSONS.find((l) => l.topic === "remoção de repetidos"),
  {
    title: "Remover repetidos · confira a ordem pedida",
    description:
      "Na lista 14-D, o site usa ordem crescente para reproduzir os testes enviados. No treino complementar sem_repetidos, a primeira ocorrência é preservada. São contratos distintos.",
    pitfall:
      "list(set(nums)) não garante ordem crescente. Para a lista 14-D, ordene os valores únicos; para o treino de primeira ocorrência, preserve a ordem de leitura.",
  },
);
LESSONS.find((l) => l.topic === "anagramas").pitfall =
  "A lista 14-H proíbe for e while; compreensões também contêm for. Comparar apenas conjuntos não preserva multiplicidades.";

// Destaques da postagem Dicas P2 enviada pelo aluno; não alteram as quatro fixas.
const TEACHER_LIKED_IDS = ["count_code", "busca", "zf", "sort_last"];
for (const e of EXERCISES) e.teacherLiked = TEACHER_LIKED_IDS.includes(e.id);

// Todos os exercícios das listas recebidas, com o nome mostrado nas tabelas.
const LIST_ITEMS = [
  ...PROGRAM_LISTS.map((p) => ({ ...p, name: p.title })),
  ...SUPPLIED_LISTS.map((s) => ({ ...s, name: s.fn })),
];

// Números das listas recebidas, em ordem (as pastas do catálogo). Não há lista 8 no material.
const SUPPLIED_LIST_NUMBERS = [...new Set(LIST_ITEMS.map((s) => s.list))].sort((a, b) => a - b);
const SUPPLIED_LIST_RANGE = `${SUPPLIED_LIST_NUMBERS[0]}–${SUPPLIED_LIST_NUMBERS.at(-1)}`;
