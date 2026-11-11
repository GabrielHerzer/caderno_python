"use strict";
/* Conteúdo autoral de treino. Vínculos às listas são declarados em sourceNote. */
const EXERCISES = [
  {
    id: "fixa",
    title: "fixa_primeiro",
    list: 11,
    ref: "Lista 11 · C (relato da conversa)",
    topics: ["strings", "slicing", "replace"],
    priority: true,
    summary: "Preserve a primeira letra. Substitua apenas as suas repetições.",
    hint: [
      "Separe a primeira posição do restante da palavra.",
      "A substituição deve acontecer somente no trecho s[1:].",
    ],
    steps: [
      "Guarde a primeira letra, se a string não estiver vazia.",
      "Percorra somente o restante e substitua as ocorrências dessa letra por *.",
      "Junte a primeira letra preservada ao restante modificado. A comparação distingue maiúsculas e minúsculas.",
    ],
    solution:
      "def fixa_primeiro(s):\n    if not s:\n        return ''\n    return s[0] + s[1:].replace(s[0], '*')",
    variants: [
      {
        q: "Qual é o retorno de fixa_primeiro('abacate')?",
        choices: ["ab*c*te", "*b*c*te", "ab*cate", "abacate"],
        answer: 0,
        explain: "A primeira letra a fica intacta; os outros dois a viram *.",
      },
      {
        q: "Qual é o retorno de fixa_primeiro('banana')?",
        choices: ["banana", "b*n*n*", "ban*n*", "******"],
        answer: 0,
        explain: "A primeira letra é b. Como não há outro b, nada muda.",
      },
      {
        q: "Qual é o retorno de fixa_primeiro('arara')?",
        choices: ["ar*r*", "*r*r*", "arara", "ar**a"],
        answer: 0,
        explain: "Somente as ocorrências de a depois da posição zero são substituídas.",
      },
      {
        q: "Que retorno deve ser produzido para a string vazia?",
        choices: ["''", "IndexError obrigatório", "None", "*"],
        answer: 0,
        explain: "Tratar a entrada vazia antes de acessar s[0] evita IndexError.",
      },
    ],
  },
  {
    id: "anagrama",
    title: "Verificar anagramas",
    list: 14,
    ref: "Lista 14 · H (relato da conversa)",
    topics: ["anagramas", "strings", "lógica"],
    priority: true,
    summary: "Compare duas palavras, incluindo a multiplicidade das letras.",
    hint: [
      "Ter as mesmas letras distintas não basta.",
      "Compare as letras ordenadas ou suas frequências.",
    ],
    steps: [
      "Defina a regra: neste treino, maiúsculas, acentos e espaços são significativos.",
      "Confira se as duas palavras têm as mesmas letras nas mesmas quantidades.",
      "Retorne um booleano. Verificar um par é diferente de contar permutações possíveis.",
    ],
    solution: "def anagrama(s1, s2):\n    return sorted(s1) == sorted(s2)",
    variants: [
      {
        q: "Qual é o resultado de anagrama('amor', 'roma')?",
        choices: ["True", "False", "24", "4"],
        answer: 0,
        explain: "Ambas possuem a, m, o e r uma vez. O retorno é booleano, não uma contagem.",
      },
      {
        q: "Qual é o resultado de anagrama('aab', 'abb')?",
        choices: ["False", "True", "3", "6"],
        answer: 0,
        explain: "As frequências de a e b diferem. Comparar apenas set(s) daria um falso positivo.",
      },
      {
        q: "Sem normalização, anagrama('Roma', 'amor') retorna:",
        choices: ["False", "True", "4", "None"],
        answer: 0,
        explain: "R maiúsculo e r minúsculo são caracteres distintos.",
      },
    ],
  },
  {
    id: "arroz",
    title: "Arroz no tabuleiro · 4 × 4",
    list: null,
    ref: "ENADE 2011 · Discursiva 5",
    topics: ["listas", "lógica", "testes de mesa"],
    priority: true,
    summary:
      "16 casas, começando em 1 grão e dobrando a cada casa. Adaptação do relato; PDF não conferido nesta sessão.",
    hint: [
      "Numere as casas a partir de zero.",
      "A casa de índice k recebe 2 ** k; acumule as 16 quantidades.",
    ],
    steps: [
      "Inicialize quantidade = 1 e total = 0.",
      "Visite quatro linhas e quatro colunas, armazenando e somando a quantidade antes de dobrá-la.",
      "Há 16 casas: os expoentes vão de 0 a 15, sem incluir 16.",
    ],
    solution:
      "tabuleiro = []\nquantidade = 1\ntotal = 0\nfor i in range(4):\n    linha = []\n    for j in range(4):\n        linha.append(quantidade)\n        total += quantidade\n        quantidade *= 2\n    tabuleiro.append(linha)\nfor linha in tabuleiro:\n    print(linha)\nprint(total)",
    variants: [
      {
        q: "Um tabuleiro 4 × 4 recebe 1, 2, 4, 8… grãos. Qual é o total nas 16 casas?",
        choices: ["65535", "65536", "32768", "131071"],
        answer: 0,
        explain: "A soma de 2⁰ até 2¹⁵ é 2¹⁶ − 1 = 65535.",
      },
      {
        q: "Quantos grãos ficam apenas na 16ª casa?",
        choices: ["32768", "65535", "65536", "16"],
        answer: 0,
        explain: "A primeira casa usa expoente zero. A 16ª usa 15: 2¹⁵ = 32768.",
      },
      {
        q: "Depois de preencher as primeiras quatro casas, qual é a soma parcial?",
        choices: ["15", "16", "8", "31"],
        answer: 0,
        explain: "As quantidades são 1, 2, 4 e 8; a soma é 15.",
      },
    ],
  },
  {
    id: "alturas",
    title: "Análise de alturas · 1.000 pessoas",
    list: null,
    ref: "ENADE 2021 · Discursiva 3",
    topics: ["listas", "lógica", "testes de mesa"],
    priority: true,
    summary:
      "Maior, menor, média e quantidade abaixo da média. Tema conferido no padrão oficial; exemplos reduzidos autorais.",
    hint: [
      "A média final depende de todas as alturas.",
      "Guarde as alturas e faça a contagem somente depois de calcular a média.",
    ],
    steps: [
      "Leia e armazene as 1.000 alturas.",
      "Determine os extremos e calcule a soma dividida pela quantidade.",
      "Percorra os dados novamente e conte somente valores estritamente menores que a média.",
    ],
    solution:
      "alturas = [float(input()) for _ in range(1000)]\nmedia = sum(alturas) / len(alturas)\nabaixo = sum(1 for h in alturas if h < media)\nprint(max(alturas), min(alturas), media, abaixo)",
    variants: [
      {
        q: "Treino reduzido: alturas [1.50, 1.60, 1.70, 1.80]. Quantas estão estritamente abaixo da média?",
        choices: ["2", "1", "3", "4"],
        answer: 0,
        explain: "A média é 1.65. Somente 1.50 e 1.60 são menores.",
      },
      {
        q: "Alturas [1.50, 1.50, 1.50]. Quantas estão abaixo da média?",
        choices: ["0", "1", "2", "3"],
        answer: 0,
        explain: "A média é 1.50. Igual à média não significa abaixo dela.",
      },
      {
        q: "Por que guardar as alturas antes de contar pessoas abaixo da média?",
        choices: [
          "A média final depende de todos os valores.",
          "A média depende apenas do maior valor.",
          "É obrigatório ordenar para calcular a média.",
          "A média sempre é conhecida na primeira leitura.",
        ],
        answer: 0,
        explain: "Contar usando médias parciais pode classificar pessoas incorretamente.",
      },
    ],
  },
  {
    id: "matriz",
    title: "Matrizes · leitura e atualização",
    list: null,
    ref: "Preparação para ENADE 2008 · Discursiva 40",
    topics: ["matrizes", "listas", "testes de mesa"],
    summary:
      "Treino autoral de índices e alteração em sequência. Não é a transcrição da Q40, ainda não verificada.",
    hint: [
      "Cada atribuição altera a matriz imediatamente.",
      "Ao ler uma posição, use seu valor atual, não necessariamente o original.",
    ],
    steps: [
      "Anote a matriz inicial e os índices de cada posição.",
      "Execute uma atribuição de cada vez, atualizando sua tabela.",
      "Se uma posição já mudou, as próximas leituras usam o novo valor.",
    ],
    solution:
      "m = [[1, 2], [3, 4]]\nm[0][0] = m[1][1]\nm[1][1] = m[0][0]\nprint(m)  # [[4, 2], [3, 4]]",
    variants: [
      {
        q: "Execute em ordem:\nm = [[1, 2], [3, 4]]\nm[0][0] = m[1][1]\nm[1][1] = m[0][0]\nComo fica m?",
        choices: ["[[4, 2], [3, 4]]", "[[4, 2], [3, 1]]", "[[1, 2], [3, 4]]", "[[4, 3], [2, 1]]"],
        answer: 0,
        explain:
          "A primeira atribuição sobrescreve 1 com 4. A segunda lê esse 4; não ocorre uma troca.",
      },
    ],
  },
  {
    id: "slice",
    title: "Recortes de strings",
    list: 10,
    topics: ["strings", "slicing"],
    summary: "Limites, passos e índices negativos.",
    hint: ["O limite final não entra no resultado.", "Escreva os índices que o recorte visita."],
    steps: [
      "Identifique os índices da string.",
      "Parta do início e avance pelo passo.",
      "Pare antes do limite final.",
    ],
    solution: "s = 'python'\nprint(s[1:5:2])  # yh",
    variants: [
      {
        q: "Qual é o resultado de 'python'[1:5:2]?",
        choices: ["yh", "yto", "ytho", "pt"],
        answer: 0,
        explain: "Os índices visitados são 1 e 3, com caracteres y e h.",
      },
    ],
  },
  {
    id: "ends",
    title: "Sufixos com endswith",
    list: 10,
    topics: ["strings", "endswith"],
    summary: "Verifique o final de uma string sem confundir com ocorrência interna.",
    hint: [
      "endswith verifica apenas o final.",
      "A comparação diferencia letras maiúsculas e minúsculas.",
    ],
    steps: [
      "Identifique o sufixo solicitado.",
      "Compare-o com o trecho final da string.",
      "Retorne True ou False.",
    ],
    solution: "nome = 'prova.py'\nprint(nome.endswith('.py'))",
    variants: [
      {
        q: "Qual expressão retorna True?",
        choices: [
          "'prova.py'.endswith('.py')",
          "'py.txt'.endswith('.py')",
          "'prova.PY'.endswith('.py')",
          "'prova.py.bak'.endswith('.py')",
        ],
        answer: 0,
        explain: "Apenas prova.py termina exatamente em .py.",
      },
    ],
  },
  {
    id: "replace",
    title: "Strings não mudam no lugar",
    list: 11,
    topics: ["replace", "strings"],
    summary: "Diferencie retorno de função e alteração da variável.",
    hint: ["Strings são imutáveis.", "Observe se o resultado de replace foi atribuído."],
    steps: [
      "A chamada cria uma nova string.",
      "Sem atribuição, a variável original permanece igual.",
      "Guarde o retorno se quiser usar a versão substituída.",
    ],
    solution: "s = 'banana'\ns = s.replace('a', '*')\nprint(s)  # b*n*n*",
    variants: [
      {
        q: "s = 'banana'\ns.replace('a', '*')\nprint(s)\nO que aparece?",
        choices: ["banana", "b*n*n*", "b*****", "None"],
        answer: 0,
        explain: "O retorno foi descartado. A variável s ainda contém banana.",
      },
    ],
  },
  {
    id: "invertida",
    title: "Soma de listas invertidas",
    list: 14,
    topics: ["listas", "slicing", "soma de listas invertidas"],
    summary:
      "Convenção deste treino: cada lista representa dígitos de um número, da unidade para a maior ordem. Vínculo exato à lista pendente.",
    hint: [
      "O primeiro elemento é a unidade.",
      "Converta cada lista para número, some e inverta os dígitos do resultado.",
    ],
    steps: [
      "Reconstrua cada número somando dígito × 10 elevado ao índice.",
      "Some os dois números reconstruídos.",
      "Devolva os dígitos da soma começando pela unidade. Zero é representado por [0].",
    ],
    solution:
      "def soma(a, b):\n    x = sum(d * 10 ** i for i, d in enumerate(a))\n    y = sum(d * 10 ** i for i, d in enumerate(b))\n    return [int(c) for c in str(x + y)[::-1]]",
    variants: [
      {
        q: "Nesta convenção, [3, 2, 1] representa 123 e [7, 7] representa 77. Qual lista representa a soma?",
        choices: ["[0, 0, 2]", "[2, 0, 0]", "[10, 9, 1]", "[0, 2]"],
        answer: 0,
        explain: "123 + 77 = 200. Em ordem de unidades primeiro, o resultado é [0, 0, 2].",
      },
    ],
  },
  {
    id: "derivada",
    title: "Derivada de polinômios",
    list: 14,
    topics: ["derivada", "listas"],
    summary: "Convenção deste treino: coeficientes em ordem crescente de grau.",
    hint: ["O índice representa o expoente de x.", "A derivada de a·xⁿ é n·a·xⁿ⁻¹."],
    steps: [
      "Ignore o coeficiente constante, no índice zero.",
      "Multiplique cada coeficiente pelo seu índice original.",
      "O resultado passa a começar no coeficiente do grau zero.",
    ],
    solution: "def derivada(coef):\n    return [i * coef[i] for i in range(1, len(coef))] or [0]",
    variants: [
      {
        q: "[5, 3, 2] representa 5 + 3x + 2x². Qual lista representa sua derivada?",
        choices: ["[3, 4]", "[5, 3]", "[0, 3, 4]", "[3, 2]"],
        answer: 0,
        explain: "A derivada é 3 + 4x; nessa representação, [3, 4].",
      },
    ],
  },
  {
    id: "repetidos",
    title: "Remover repetidos",
    list: 13,
    topics: ["listas", "remoção de repetidos"],
    summary: "Mantenha a ordem da primeira ocorrência.",
    hint: [
      "Monte uma nova lista durante o percurso.",
      "Adicione um elemento apenas se ainda não estiver no resultado.",
    ],
    steps: [
      "Comece com uma lista vazia.",
      "Visite cada elemento da esquerda para a direita.",
      "Adicione somente os elementos ainda ausentes.",
    ],
    solution:
      "def sem_repetidos(valores):\n    resultado = []\n    for valor in valores:\n        if valor not in resultado:\n            resultado.append(valor)\n    return resultado",
    variants: [
      {
        q: "Removendo repetições de [3, 1, 3, 2, 1], sem mudar a ordem das primeiras ocorrências, obtemos:",
        choices: ["[3, 1, 2]", "[1, 2, 3]", "[3, 2, 1]", "[2]"],
        answer: 0,
        explain: "3 e 1 entram primeiro; o segundo 3 é ignorado, 2 entra e o último 1 é ignorado.",
      },
    ],
  },
  {
    id: "contar",
    title: "Contar não é verificar anagramas",
    list: 14,
    topics: ["anagramas", "lógica"],
    summary:
      "Extensão autoral: quantidade de permutações distintas. O anúncio sobre contagem permanece ambíguo.",
    hint: [
      "Trocar duas letras iguais não cria outra palavra.",
      "Use o fatorial do total dividido pelos fatoriais das repetições.",
    ],
    steps: [
      "Conte os caracteres e suas frequências.",
      "Calcule o fatorial do comprimento.",
      "Divida pelo fatorial de cada frequência. Isso conta arranjos distintos, não verifica um par.",
    ],
    solution:
      "from math import factorial\nfrom collections import Counter\ndef contar_anagramas(s):\n    n = factorial(len(s))\n    for qtd in Counter(s).values():\n        n //= factorial(qtd)\n    return n",
    variants: [
      {
        q: "Quantos arranjos distintos podem ser formados com todas as letras de 'ovo', sem exigir palavras do dicionário?",
        choices: ["3", "6", "2", "True"],
        answer: 0,
        explain: "São 3! / 2! = 3 arranjos: ovo, oov e voo.",
      },
    ],
  },
  {
    id: "mesa_for",
    title: "Teste de mesa · acumulador",
    list: 12,
    topics: ["testes de mesa", "lógica"],
    summary: "Acompanhe i e total a cada passagem do laço.",
    hint: ["range(1, 5) não inclui 5.", "Some apenas quando a condição for verdadeira."],
    steps: [
      "Comece com total = 0.",
      "Para i = 1, 2, 3 e 4, verifique o resto da divisão por 2.",
      "Os pares 2 e 4 são somados; nos ímpares, total não muda.",
    ],
    solution:
      "total = 0\nfor i in range(1, 5):\n    if i % 2 == 0:\n        total += i\nprint(total)\n# i:      1  2  3  4\n# total:  0  2  2  6",
    variants: [
      {
        q: "total = 0\nfor i in range(1, 5):\n    if i % 2 == 0:\n        total += i\nQual é o valor final de total?",
        choices: ["6", "10", "4", "2"],
        answer: 0,
        explain: "Só 2 e 4 satisfazem a condição. O acumulador termina em 6.",
      },
    ],
  },
  {
    id: "mesa_while",
    title: "Teste de mesa · while",
    list: 12,
    topics: ["testes de mesa", "lógica"],
    summary: "A ordem entre soma e incremento faz diferença.",
    hint: ["Verifique a condição antes de cada iteração.", "O incremento ocorre depois da soma."],
    steps: [
      "Inicie n = 1 e s = 0.",
      "Some 1, depois 3 e depois 5, sempre incrementando n em 2.",
      "Quando n chega a 7, a condição falha e o laço termina.",
    ],
    solution:
      "n, s = 1, 0\nwhile n < 6:\n    s += n\n    n += 2\nprint(s, n)\n# após cada volta: (s,n) = (1,3), (4,5), (9,7)",
    variants: [
      {
        q: "n, s = 1, 0\nwhile n < 6:\n    s += n\n    n += 2\nQual é o par final (s, n)?",
        choices: ["(9, 7)", "(9, 5)", "(6, 6)", "(16, 7)"],
        answer: 0,
        explain: "s acumula 1 + 3 + 5 = 9 e o último incremento deixa n = 7.",
      },
    ],
  },
  {
    id: "alias",
    title: "Listas · cópia ou referência?",
    list: 13,
    topics: ["listas", "slicing", "testes de mesa"],
    summary: "Observe quando duas variáveis apontam para a mesma lista.",
    hint: ["b = a não cria uma cópia.", "a[:] cria outra lista para elementos simples."],
    steps: [
      "Atribuir a lista a outra variável compartilha a referência.",
      "Uma alteração por qualquer referência afeta o mesmo objeto.",
      "Para uma cópia superficial, use a[:] ou a.copy().",
    ],
    solution:
      "a = [1, 2]\nb = a\nb.append(3)\nprint(a)  # [1, 2, 3]\nc = a[:]\nc.append(4)\nprint(a)  # [1, 2, 3]",
    variants: [
      {
        q: "a = [1, 2]\nb = a\nb.append(3)\nQual é o valor de a?",
        choices: ["[1, 2, 3]", "[1, 2]", "[3]", "None"],
        answer: 0,
        explain: "a e b apontam para a mesma lista; append altera esse objeto.",
      },
    ],
  },
  {
    id: "logica",
    title: "Condições e precedência",
    list: 12,
    topics: ["lógica"],
    summary: "Leia not, and e or na ordem correta.",
    hint: ["not tem precedência sobre and; and sobre or.", "Resolva primeiro cada comparação."],
    steps: [
      "Resolva as comparações.",
      "Aplique not, depois and.",
      "Por fim, aplique or. Parênteses podem alterar essa ordem.",
    ],
    solution: "x = 3\nprint(x > 5 or x > 0 and x < 4)\n# False or (True and True) → True",
    variants: [
      {
        q: "Com x = 3, qual é o valor de x > 5 or x > 0 and x < 4?",
        choices: ["True", "False", "3", "Erro de sintaxe"],
        answer: 0,
        explain: "and é avaliado antes de or. False or (True and True) é True.",
      },
    ],
  },
];
EXERCISES.forEach((e) => {
  e.sourceNote =
    e.ref || `Trilha ${e.list} · associação didática provisória, não conferida na lista original`;
});

// Temas extras para os treinos autorais (antes ficava em lessons.js).
const EXTRA_TOPICS = {
  mesa_for: ["for"],
  mesa_while: ["while"],
  arroz: ["for", "matrizes"],
  alturas: ["for"],
  repetidos: ["for"],
  derivada: ["for"],
  invertida: ["for"],
  fixa: ["funções e return"],
  anagrama: ["funções e return"],
  ends: ["funções e return"],
};
EXERCISES.forEach((e) => {
  e.topics = [...new Set([...e.topics, ...(EXTRA_TOPICS[e.id] || [])])];
});
