"use strict";
// Contratos autorais para avaliação por execução, independentes da questão objetiva.
const CODE_SPECS = {
  fixa: {
    fn: "fixa_primeiro",
    signature: "fixa_primeiro(s)",
    task: "Receba uma string. Preserve a primeira letra e substitua por * todas as repetições dela no restante. Diferencie maiúsculas de minúsculas. Para string vazia, retorne string vazia.",
    tests: [
      [["abacate"], "ab*c*te"],
      [["banana"], "banana"],
      [["arara"], "ar*r*"],
      [[""], ""],
      [["a"], "a"],
      [["aaaa"], "a***"],
      [["AaA"], "Aa*"],
    ],
    solution:
      "def fixa_primeiro(s):\n    if not s:\n        return ''\n    return s[0] + s[1:].replace(s[0], '*')",
  },
  anagrama: {
    fn: "anagrama",
    signature: "anagrama(s1, s2)",
    task: "Retorne True se as duas strings tiverem as mesmas letras nas mesmas quantidades; caso contrário, False. Maiúsculas, espaços e acentos são significativos. Não é para contar arranjos.",
    tests: [
      [["amor", "roma"], true],
      [["aab", "abb"], false],
      [["aab", "aba"], true],
      [["", ""], true],
      [["Roma", "amor"], false],
      [["a", "aa"], false],
    ],
    solution: "def anagrama(s1, s2):\n    return sorted(s1) == sorted(s2)",
  },
  arroz: {
    fn: "arroz",
    signature: "arroz(n)",
    task: "Construa um tabuleiro n × n. Preencha por linha com 1, 2, 4… grãos, dobrando a cada casa. Retorne (matriz, total). Treine n=4 para o caso anunciado; os testes menores verificam a lógica. n é inteiro positivo.",
    tests: [
      [[1], [[[1]], 1]],
      [
        [2],
        [
          [
            [1, 2],
            [4, 8],
          ],
          15,
        ],
      ],
      [
        [3],
        [
          [
            [1, 2, 4],
            [8, 16, 32],
            [64, 128, 256],
          ],
          511,
        ],
      ],
      [
        [4],
        [
          [
            [1, 2, 4, 8],
            [16, 32, 64, 128],
            [256, 512, 1024, 2048],
            [4096, 8192, 16384, 32768],
          ],
          65535,
        ],
      ],
    ],
    solution:
      "def arroz(n):\n    matriz = []\n    graos, total = 1, 0\n    for i in range(n):\n        linha = []\n        for j in range(n):\n            linha.append(graos)\n            total += graos\n            graos *= 2\n        matriz.append(linha)\n    return matriz, total",
  },
  alturas: {
    fn: "analisar_alturas",
    signature: "analisar_alturas(alturas)",
    task: "Receba uma lista não vazia de alturas positivas. Retorne (maior, menor, média, quantidade estritamente abaixo da média). Sua função deve funcionar tanto com exemplos pequenos como com as 1.000 pessoas do exercício.",
    tests: [],
    solution:
      "def analisar_alturas(alturas):\n    media = sum(alturas) / len(alturas)\n    abaixo = sum(1 for h in alturas if h < media)\n    return max(alturas), min(alturas), media, abaixo",
  },
  invertida: {
    fn: "soma",
    signature: "soma(a, b)",
    task: "Cada lista não vazia contém dígitos de um inteiro não negativo, começando pela unidade: [3,2,1] representa 123. Retorne a lista de dígitos da soma nessa mesma ordem. Zero deve retornar [0].",
    tests: [
      [
        [
          [3, 2, 1],
          [7, 7],
        ],
        [0, 0, 2],
      ],
      [[[0], [0]], [0]],
      [
        [[9, 9], [1]],
        [0, 0, 1],
      ],
      [[[5], [2]], [7]],
    ],
    solution:
      "def soma(a, b):\n    x = sum(d * 10 ** i for i, d in enumerate(a))\n    y = sum(d * 10 ** i for i, d in enumerate(b))\n    return [int(c) for c in str(x + y)[::-1]]",
  },
  derivada: {
    fn: "derivada",
    signature: "derivada(coef)",
    task: "Receba os coeficientes em ordem crescente de grau: [5,3,2] significa 5+3x+2x². Retorne os coeficientes da derivada, sem remover zeros finais. Para constante ou lista vazia, retorne [0].",
    tests: [
      [[[5, 3, 2]], [3, 4]],
      [[[8]], [0]],
      [[[]], [0]],
      [[[0, 0, 0, 4]], [0, 0, 12]],
      [[[1, -2, 0]], [-2, 0]],
    ],
    solution: "def derivada(coef):\n    return [i * coef[i] for i in range(1, len(coef))] or [0]",
  },
  repetidos: {
    fn: "sem_repetidos",
    signature: "sem_repetidos(valores)",
    task: "Receba uma lista de inteiros e retorne uma nova lista sem repetições, preservando a ordem da primeira ocorrência. A entrada pode ser vazia.",
    tests: [
      [[[3, 1, 3, 2, 1]], [3, 1, 2]],
      [[[]], []],
      [[[2, 2, 2]], [2]],
      [[[-1, 0, -1, 2]], [-1, 0, 2]],
    ],
    solution:
      "def sem_repetidos(valores):\n    resultado = []\n    for valor in valores:\n        if valor not in resultado:\n            resultado.append(valor)\n    return resultado",
  },
  contar: {
    fn: "contar_anagramas",
    signature: "contar_anagramas(s)",
    task: "Retorne a quantidade de permutações distintas de todas as letras da string (sem exigir palavras válidas). Letras repetidas não geram arranjos novos. Considere uma permutação para a string vazia.",
    tests: [
      [["ovo"], 3],
      [["amor"], 24],
      [["aaaa"], 1],
      [[""], 1],
      [["aabb"], 6],
    ],
    solution:
      "from math import factorial\nfrom collections import Counter\ndef contar_anagramas(s):\n    total = factorial(len(s))\n    for n in Counter(s).values():\n        total //= factorial(n)\n    return total",
  },
  slice: {
    fn: "recorte",
    signature: "recorte(s)",
    task: "Retorne os caracteres das posições 1, 3, 5… da string. A string pode ser vazia.",
    tests: [
      [["python"], "yhn"],
      [["abcdefg"], "bdf"],
      [[""], ""],
      [["a"], ""],
    ],
    solution: "def recorte(s):\n    return s[1::2]",
  },
  ends: {
    fn: "arquivo_python",
    signature: "arquivo_python(nome)",
    task: "Retorne um booleano indicando se o nome termina exatamente em .py, distinguindo maiúsculas de minúsculas.",
    tests: [
      [["prova.py"], true],
      [["prova.PY"], false],
      [["prova.py.bak"], false],
      [[""], false],
    ],
    solution: "def arquivo_python(nome):\n    return nome.endswith('.py')",
  },
  replace: {
    fn: "trocar",
    signature: "trocar(s)",
    task: "Retorne uma nova string substituindo todas as letras a minúsculas por *. Não altere os demais caracteres.",
    tests: [
      [["banana"], "b*n*n*"],
      [["Ana"], "An*"],
      [[""], ""],
      [["xyz"], "xyz"],
    ],
    solution: "def trocar(s):\n    return s.replace('a', '*')",
  },
  mesa_for: {
    fn: "soma_pares",
    signature: "soma_pares(n)",
    task: "Retorne a soma dos inteiros pares entre 1 e n, incluindo n quando par. Para n=0, retorne 0. n é inteiro não negativo.",
    tests: [
      [[4], 6],
      [[0], 0],
      [[5], 6],
      [[10], 30],
    ],
    solution:
      "def soma_pares(n):\n    total = 0\n    for i in range(1, n + 1):\n        if i % 2 == 0:\n            total += i\n    return total",
  },
  mesa_while: {
    fn: "soma_impares",
    signature: "soma_impares(limite)",
    task: "Some os inteiros ímpares positivos estritamente menores que limite. Retorne (soma, primeiro ímpar que não é menor que limite). limite é inteiro positivo.",
    tests: [
      [[6], [9, 7]],
      [[1], [0, 1]],
      [[5], [4, 5]],
      [[10], [25, 11]],
    ],
    solution:
      "def soma_impares(limite):\n    n, total = 1, 0\n    while n < limite:\n        total += n\n        n += 2\n    return total, n",
  },
  alias: {
    fn: "copiar_e_adicionar",
    signature: "copiar_e_adicionar(a, valor)",
    task: "Retorne uma cópia da lista a com valor adicionado ao final. Não altere a lista original.",
    tests: [
      [
        [[1, 2], 3],
        [1, 2, 3],
      ],
      [[[], 7], [7]],
    ],
    unchanged: true,
    solution: "def copiar_e_adicionar(a, valor):\n    b = a[:]\n    b.append(valor)\n    return b",
  },
  logica: {
    fn: "condicao",
    signature: "condicao(x)",
    task: "Retorne o booleano da condição: x > 5 or x > 0 and x < 4. Os testes usam números inteiros.",
    tests: [
      [[3], true],
      [[0], false],
      [[5], false],
      [[6], true],
      [[-2], false],
    ],
    solution: "def condicao(x):\n    return x > 5 or x > 0 and x < 4",
  },
  matriz: {
    fn: "atualizar",
    signature: "atualizar(m)",
    task: "Para uma matriz 2 × 2, faça estas atribuições em sequência: m[0][0] = m[1][1]; depois m[1][1] = m[0][0]. Retorne a matriz resultante. Este é um treino autoral, não a transcrição da Q40.",
    tests: [
      [
        [
          [
            [1, 2],
            [3, 4],
          ],
        ],
        [
          [4, 2],
          [3, 4],
        ],
      ],
      [
        [
          [
            [9, 8],
            [7, 6],
          ],
        ],
        [
          [6, 8],
          [7, 6],
        ],
      ],
    ],
    solution: "def atualizar(m):\n    m[0][0] = m[1][1]\n    m[1][1] = m[0][0]\n    return m",
  },
};
CODE_SPECS.alturas.tests = [
  [[[1.5, 1.6, 1.7, 1.8]], [1.8, 1.5, 1.65, 2]],
  [[[1.5, 1.5, 1.5]], [1.5, 1.5, 1.5, 0]],
  [[[1.8]], [1.8, 1.8, 1.8, 0]],
  [[Array.from({ length: 1000 }, (_, i) => (i < 500 ? 1.5 : 1.9))], [1.9, 1.5, 1.7, 500]],
];
