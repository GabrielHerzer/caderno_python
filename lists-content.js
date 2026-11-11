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
  return typeof v === "string" ? JSON.stringify(v) : String(v);
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
    const correct = pythonRepr(expected),
      choices = [correct];
    const alternatives = [
      typeof expected === "boolean" ? !expected : null,
      typeof expected === "number" ? expected + 1 : 0,
      typeof expected === "number" ? expected - 1 : 1,
      "",
      [],
      false,
      true,
      "Resultado inválido",
    ];
    for (const a of alternatives) {
      const text = pythonRepr(a);
      if (!choices.includes(text)) choices.push(text);
      if (choices.length === 4) break;
    }
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
function importantBadge(e) {
  if (e.priority)
    return '<p class="notice"><strong>Massanori gostou muito dessa questão.</strong><br><small>Alta probabilidade segundo seu relato sobre a aula; não é confirmação da prova.</small></p>';
  return e.teacherLiked
    ? '<p class="notice">★ <strong>Importante.</strong> Massanori falou que gostou do exercício.<br><small>Indicado como importante na postagem “Dicas P2”. Não é garantia de cair na prova.</small></p>'
    : "";
}
