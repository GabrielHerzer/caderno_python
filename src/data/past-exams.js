"use strict";
// Provas de Algoritmos · DSM. Enunciados adaptados dos PDFs para a correção no navegador.
const PAST_EXAMS = [
  {
    "exam": "p0",
    "number": 1,
    "title": "Teste de mesa · multiplicação",
    "topic": "while",
    "task": "Anote cada trio (x, y, z) impresso e o valor final de x. Na oficina, retorne uma lista com os trios como listas, seguida pelo inteiro final.",
    "steps": [
      "A linha dentro do while é impressa antes das atualizações."
    ],
    "source": "y = 4\nz = 3\nx = 0\nwhile z > 0:\n    print(x, y, z)\n    if z % 2 == 1:\n        x = x + y\n    y = 2 * y\n    z = z // 2\nprint(x)",
    "fn": "resposta",
    "signature": "resposta()",
    "tests": [
      [
        [],
        [
          [
            0,
            4,
            3
          ],
          [
            4,
            8,
            1
          ],
          12
        ]
      ]
    ],
    "solution": "def resposta():\n    return [[0,4,3],[4,8,1],12]"
  },
  {
    "exam": "p0",
    "number": 2,
    "title": "Teste de mesa · sequência de Collatz",
    "topic": "while",
    "task": "Anote cada par (n, soma) impresso e a soma final. Na oficina, retorne uma lista com os pares como listas, seguida pelo inteiro final.",
    "steps": [
      "A condição para quando n chega a 1. O 1 fica fora da soma."
    ],
    "source": "n = 3\nsoma = 0\nwhile n != 1:\n    print(n, soma)\n    soma = soma + n\n    if n % 2 == 0:\n        n = n // 2\n    else:\n        n = n * 3 + 1\nprint(soma)",
    "fn": "resposta",
    "signature": "resposta()",
    "tests": [
      [
        [],
        [
          [
            3,
            0
          ],
          [
            10,
            3
          ],
          [
            5,
            13
          ],
          [
            16,
            18
          ],
          [
            8,
            34
          ],
          [
            4,
            42
          ],
          [
            2,
            46
          ],
          48
        ]
      ]
    ],
    "solution": "def resposta():\n    return [[3,0],[10,3],[5,13],[16,18],[8,34],[4,42],[2,46],48]"
  },
  {
    "exam": "p0",
    "number": 3,
    "title": "Corrija a média de três notas",
    "topic": "while",
    "task": "Identifique os erros e corrija o programa para ler três notas e imprimir a média.",
    "steps": [
      "Feche float(input()), mova o incremento para dentro do while e inclua a terceira nota na condição."
    ],
    "source": "contador = 1\nsoma = 0\nwhile contador < 3:\n    nota = float(input()\n    soma = soma + nota\ncontador = contador + 1\nmedia = soma / 3\nprint(media)",
    "program": true,
    "cases": [
      {
        "stdin": [
          3,
          6,
          9
        ],
        "expect": [
          6
        ]
      },
      {
        "stdin": [
          10,
          7,
          7
        ],
        "expect": [
          8
        ]
      }
    ],
    "solution": "contador = 1\nsoma = 0\nwhile contador <= 3:\n    nota = float(input())\n    soma += nota\n    contador += 1\nprint(soma / 3)",
  },
  {
    "exam": "p0",
    "number": 4,
    "title": "Economia para o notebook",
    "topic": "while",
    "task": "Use while para descobrir em quantos meses o saldo chega a R$ 6.000 e quanto sobra. Some R$ 300 por mês, tire R$ 300 a cada cinco meses e some R$ 800 a cada oito meses. Aplique todas as movimentações do mês antes de verificar a meta.",
    "steps": [
      "Use o resto da divisão do número do mês para identificar despesas e bônus."
    ],
    "program": true,
    "cases": [
      {
        "expect": [
          18,
          100
        ]
      }
    ],
    "solution": "mes = 0\nsaldo = 0\nwhile saldo < 6000:\n    mes += 1\n    saldo += 300\n    if mes % 5 == 0:\n        saldo -= 300\n    if mes % 8 == 0:\n        saldo += 800\nprint(mes)\nprint(saldo - 6000)",
    "quiz": [
      {
        "q": "Em quantos meses o saldo alcança a meta?",
        "choices": [
          "18",
          "17",
          "19",
          "20"
        ],
        "answer": 0,
        "explain": "Resposta: 18. Use o resto da divisão do número do mês para identificar despesas e bônus."
      }
    ]
  },
  {
    "exam": "p0",
    "number": 5,
    "title": "Maior de dez números inteiros",
    "topic": "while",
    "task": "Leia dez inteiros e imprima o maior. Use while e evite listas, max() e min(). Os números podem ser negativos.",
    "steps": [
      "Use o primeiro valor lido como maior inicial."
    ],
    "program": true,
    "cases": [
      {
        "stdin": [
          -9,
          -8,
          -1,
          -4,
          -5,
          -6,
          -7,
          -10,
          -20,
          -2
        ],
        "expect": [
          -1
        ]
      },
      {
        "stdin": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ],
        "expect": [
          9
        ]
      }
    ],
    "solution": "maior = int(input())\nlidos = 1\nwhile lidos < 10:\n    numero = int(input())\n    if numero > maior:\n        maior = numero\n    lidos += 1\nprint(maior)"
  },
  {
    "exam": "p0",
    "number": 6,
    "title": "Ocorrências de 42",
    "topic": "count",
    "task": "Conte e imprima todas as ocorrências da sequência 42 nos inteiros de 1234 a 987654, inclusive. Você pode usar count().",
    "steps": [
      "Converta cada inteiro em texto. Em 4242, o trecho aparece duas vezes."
    ],
    "program": true,
    "cases": [
      {
        "expect": [
          49635
        ]
      }
    ],
    "solution": "total = 0\nfor numero in range(1234, 987655):\n    total += str(numero).count(\"42\")\nprint(total)"
  },
  {
    "exam": "p0",
    "number": 7,
    "title": "Blitz de Carnaval",
    "topic": "condicionais",
    "task": "Leia a taxa de álcool (float) e se é Carnaval (s/n). Imprima 0 até 0,2 g/L, 1 acima desse valor e até 0,5 g/L, ou 2 acima de 0,5 g/L. No Carnaval os dois limites sobem 0,1 g/L.",
    "steps": [
      "Compare a taxa com 0.3 e 0.6 no Carnaval e com 0.2 e 0.5 nos demais dias."
    ],
    "program": true,
    "cases": [
      {
        "stdin": [
          0.3,
          "n"
        ],
        "expect": [
          1
        ]
      },
      {
        "stdin": [
          0.3,
          "s"
        ],
        "expect": [
          0
        ]
      },
      {
        "stdin": [
          0.6,
          "s"
        ],
        "expect": [
          1
        ]
      },
      {
        "stdin": [
          0.61,
          "s"
        ],
        "expect": [
          2
        ]
      }
    ],
    "solution": "taxa = float(input())\ncarnaval = input().strip().lower() == \"s\"\nliberado, advertencia = (0.3, 0.6) if carnaval else (0.2, 0.5)\nif taxa <= liberado:\n    print(0)\nelif taxa <= advertencia:\n    print(1)\nelse:\n    print(2)"
  },
  {
    "exam": "p0",
    "number": 8,
    "title": "Cupom de entrega",
    "topic": "condicionais",
    "task": "Leia o valor do pedido e se há estudante no grupo (s/n). Imprima 0 para pedidos abaixo de R$ 20, 2 a partir de R$ 20 com estudante, ou 1 a partir de R$ 20 sem estudante.",
    "steps": [
      "Verifique primeiro o valor mínimo do pedido."
    ],
    "program": true,
    "cases": [
      {
        "stdin": [
          15,
          "s"
        ],
        "expect": [
          0
        ]
      },
      {
        "stdin": [
          20,
          "s"
        ],
        "expect": [
          2
        ]
      },
      {
        "stdin": [
          25,
          "n"
        ],
        "expect": [
          1
        ]
      }
    ],
    "solution": "valor = float(input())\nestudante = input().strip().lower() == \"s\"\nif valor < 20:\n    print(0)\nelif estudante:\n    print(2)\nelse:\n    print(1)"
  },
  {
    "exam": "p0",
    "number": 9,
    "title": "Jogo de adivinhação",
    "topic": "while",
    "task": "Sorteie um inteiro de 1 a 1000 com random.randint. Imprima “Bem vindo!” e leia chutes até o acerto. Diga “Alto” para um chute maior ou “Baixo” para um menor. Quando acertar, imprima “Você venceu!” e, por fim, “Fim do jogo!”.",
    "steps": [
      "Compare cada chute com o mesmo número sorteado. Use break no acerto."
    ],
    "program": true,
    "cases": [
      {
        "stdin": [
          600,
          400,
          500
        ],
        "random": [
          500
        ],
        "expect": [
          "bem vindo",
          "alto",
          "baixo",
          "você venceu",
          "fim do jogo"
        ]
      },
      {
        "stdin": [
          1
        ],
        "random": [
          1
        ],
        "expect": [
          "bem vindo",
          "você venceu",
          "fim do jogo"
        ],
        "absent": [
          "alto",
          "baixo"
        ]
      }
    ],
    "solution": "import random\nalvo = random.randint(1, 1000)\nprint(\"Bem vindo!\")\nwhile True:\n    chute = int(input())\n    if chute == alvo:\n        print(\"Você venceu!\")\n        break\n    print(\"Alto\" if chute > alvo else \"Baixo\")\nprint(\"Fim do jogo!\")",
    "quiz": [
      {
        "q": "Se o sorteio for 500, qual é a dica para um chute de 600?",
        "choices": [
          "Alto",
          "Baixo",
          "Você venceu!"
        ],
        "answer": 0,
        "explain": "Resposta: Alto. Compare cada chute com o mesmo número sorteado. Use break no acerto."
      }
    ]
  },
  {
    "exam": "p0",
    "number": 10,
    "title": "Intercale dois vetores",
    "topic": "listas",
    "task": "Crie duas listas com dez inteiros aleatórios de 1 a 100 usando randint. Crie uma terceira lista de 20 posições intercalando os elementos, começando pelo primeiro vetor. Imprima as três listas.",
    "steps": [
      "Pegue o item de cada lista na mesma posição antes de ir para a próxima."
    ],
    "program": true,
    "cases": [
      {
        "random": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          100,
          99,
          98,
          97,
          96,
          95,
          94,
          93,
          92,
          91
        ],
        "expect": [
          {
            "list": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10
            ]
          },
          {
            "list": [
              100,
              99,
              98,
              97,
              96,
              95,
              94,
              93,
              92,
              91
            ]
          },
          {
            "list": [
              1,
              100,
              2,
              99,
              3,
              98,
              4,
              97,
              5,
              96,
              6,
              95,
              7,
              94,
              8,
              93,
              9,
              92,
              10,
              91
            ]
          }
        ]
      }
    ],
    "solution": "from random import randint\na = [randint(1, 100) for _ in range(10)]\nb = [randint(1, 100) for _ in range(10)]\nintercalados = []\nfor i in range(10):\n    intercalados.extend([a[i], b[i]])\nprint(a)\nprint(b)\nprint(intercalados)",
    "quiz": [
      {
        "q": "Quantos elementos tem o vetor intercalado?",
        "choices": [
          "20",
          "10",
          "30",
          "100"
        ],
        "answer": 0,
        "explain": "Resposta: 20. Pegue o item de cada lista na mesma posição antes de ir para a próxima."
      }
    ]
  },
  {
    "exam": "p1",
    "number": 1,
    "title": "Esquilos no verão",
    "topic": "condicionais",
    "task": "Retorne se os esquilos brincam. A temperatura precisa estar entre 60 e 90 °F, inclusive. No verão o limite superior é 100 °F.",
    "steps": [
      "Escolha o limite superior antes de comparar."
    ],
    "fn": "squirrel_play",
    "signature": "squirrel_play(temp, is_summer)",
    "tests": [
      [
        [
          70,
          false
        ],
        true
      ],
      [
        [
          95,
          false
        ],
        false
      ],
      [
        [
          95,
          true
        ],
        true
      ],
      [
        [
          59,
          true
        ],
        false
      ],
      [
        [
          100,
          true
        ],
        true
      ],
      [
        [
          101,
          true
        ],
        false
      ]
    ],
    "solution": "def squirrel_play(temp, is_summer):\n    limite = 100 if is_summer else 90\n    return 60 <= temp <= limite"
  },
  {
    "exam": "p1",
    "number": 2,
    "title": "Corrija o cálculo da média",
    "topic": "listas",
    "task": "Identifique os erros, corrija media(lista) para receber uma lista não vazia de números ou strings numéricas e retornar a média. Na linha de saída do programa, use print('Média:', media(notas)).",
    "steps": [
      "Use o mesmo nome para inicializar e acumular, converta os itens para float e chame print em vez de atribuir a ele."
    ],
    "source": "def media(lista):\n    soma = 0.0\n    for n in lista:\n        total = total + n\n    return total / len(lista)\n\nnotas = \"7.5 8.0 6.5 10.0\".split()\nprint = (\"Média: \" + media(notas))",
    "fn": "media",
    "signature": "media(lista)",
    "tests": [
      [
        [
          [
            "7.5",
            "8.0",
            "6.5",
            "10.0"
          ]
        ],
        8
      ],
      [
        [
          [
            2,
            4,
            6
          ]
        ],
        4
      ],
      [
        [
          [
            "1.5"
          ]
        ],
        1.5
      ]
    ],
    "solution": "def media(lista):\n    total = 0.0\n    for n in lista:\n        total += float(n)\n    return total / len(lista)"
  },
  {
    "exam": "p1",
    "number": 3,
    "title": "Teste de mesa · mistura",
    "topic": "for",
    "task": "Faça o teste de mesa e determine o valor do último print. Na oficina, retorne esse inteiro em resposta().",
    "steps": [
      "Some os pares em x e conte os ímpares em y."
    ],
    "source": "def mistura(v):\n    x = 0\n    y = 0\n    for n in v:\n        print(x, y, n)\n        if n % 2 == 0:\n            x = x + n\n        else:\n            y = y + 1\n    return x - y\n\nprint(mistura([3, 8, 1, 6, 4]))",
    "fn": "resposta",
    "signature": "resposta()",
    "tests": [
      [
        [],
        16
      ]
    ],
    "solution": "def resposta():\n    return 16"
  },
  {
    "exam": "p1",
    "number": 4,
    "title": "Vogais repetidas",
    "topic": "strings",
    "task": "Retorne True se houver duas vogais iguais vizinhas. Ignore a diferença de maiúsculas e minúsculas. A string não tem acentos ou caracteres especiais. Não use count() nem set().",
    "steps": [
      "Converta a string com lower() e compare caracteres lado a lado."
    ],
    "fn": "vogais_repetidas",
    "signature": "vogais_repetidas(s)",
    "tests": [
      [
        [
          "GanhoUu"
        ],
        true
      ],
      [
        [
          "aeiou"
        ],
        false
      ],
      [
        [
          "bb"
        ],
        false
      ],
      [
        [
          ""
        ],
        false
      ],
      [
        [
          "aa"
        ],
        true
      ]
    ],
    "solution": "def vogais_repetidas(s):\n    s = s.lower()\n    for i in range(len(s) - 1):\n        if s[i] in \"aeiou\" and s[i] == s[i + 1]:\n            return True\n    return False"
  },
  {
    "exam": "p1",
    "number": 5,
    "title": "Prefixos progressivos",
    "topic": "fatiamento",
    "task": "Concatene todos os prefixos não vazios de s em ordem crescente de tamanho. Exemplo: 'Code' vira 'CCoCodCode'.",
    "steps": [
      "O prefixo de comprimento i é s[:i]."
    ],
    "fn": "string_splosion",
    "signature": "string_splosion(s)",
    "tests": [
      [
        [
          "Code"
        ],
        "CCoCodCode"
      ],
      [
        [
          "ab"
        ],
        "aab"
      ],
      [
        [
          ""
        ],
        ""
      ],
      [
        [
          "z"
        ],
        "z"
      ]
    ],
    "solution": "def string_splosion(s):\n    resultado = \"\"\n    for i in range(1, len(s) + 1):\n        resultado += s[:i]\n    return resultado"
  },
  {
    "exam": "p1",
    "number": 6,
    "title": "Corrija a condição do papagaio",
    "topic": "condicionais",
    "task": "Explique o erro de precedência e corrija a função. Retorne True quando o papagaio estiver falando e a hora for menor que 7 ou maior que 20.",
    "steps": [
      "Agrupe as duas condições de horário. Sem os parênteses, hora > 20 basta mesmo com o papagaio calado."
    ],
    "source": "def papagaio(falando, hora):\n    return falando and hora < 7 or hora > 20",
    "fn": "papagaio",
    "signature": "papagaio(falando, hora)",
    "tests": [
      [
        [
          false,
          21
        ],
        false
      ],
      [
        [
          true,
          6
        ],
        true
      ],
      [
        [
          true,
          7
        ],
        false
      ],
      [
        [
          true,
          20
        ],
        false
      ],
      [
        [
          true,
          21
        ],
        true
      ]
    ],
    "solution": "def papagaio(falando, hora):\n    return falando and (hora < 7 or hora > 20)"
  },
  {
    "exam": "p1",
    "number": 7,
    "title": "Detector de lero-lero",
    "topic": "split e join",
    "task": "Retorne True se houver duas palavras iguais e consecutivas na frase, ignorando maiúsculas e minúsculas. Se não houver, retorne False.",
    "steps": [
      "Separe as palavras com split() e compare cada palavra com a próxima."
    ],
    "fn": "lero_lero",
    "signature": "lero_lero(texto)",
    "tests": [
      [
        [
          "O dia está lindo LINDO hoje"
        ],
        true
      ],
      [
        [
          "O dia está muito lindo"
        ],
        false
      ],
      [
        [
          "a b a"
        ],
        false
      ],
      [
        [
          ""
        ],
        false
      ]
    ],
    "solution": "def lero_lero(texto):\n    palavras = texto.lower().split()\n    for i in range(len(palavras) - 1):\n        if palavras[i] == palavras[i + 1]:\n            return True\n    return False"
  },
  {
    "exam": "p1",
    "number": 8,
    "title": "Palavras por tamanho",
    "topic": "ordenação",
    "task": "Retorne as palavras da frase ordenadas pelo número de letras, mantendo a ordem original dos empates.",
    "steps": [
      "Use len como chave em sorted()."
    ],
    "fn": "ordena_len",
    "signature": "ordena_len(frase)",
    "tests": [
      [
        [
          "O rato roeu a roupa do Rei"
        ],
        [
          "O",
          "a",
          "do",
          "Rei",
          "rato",
          "roeu",
          "roupa"
        ]
      ],
      [
        [
          "bb aa c"
        ],
        [
          "c",
          "bb",
          "aa"
        ]
      ],
      [
        [
          ""
        ],
        []
      ]
    ],
    "solution": "def ordena_len(frase):\n    return sorted(frase.split(), key=len)"
  },
  {
    "exam": "p1",
    "number": 9,
    "title": "Maior abaixo da média",
    "topic": "listas",
    "task": "Retorne o maior inteiro da lista que seja estritamente menor que a média, ou None se não existir ou se a lista estiver vazia. Use sum() e len() apenas para a média. Não use max(), sort() nem bibliotecas.",
    "steps": [
      "Inicie o melhor candidato com None. Atualize só quando um valor estiver abaixo da média e superar o candidato anterior."
    ],
    "fn": "maior_abaixo_media",
    "signature": "maior_abaixo_media(lista)",
    "tests": [
      [
        [
          [
            10,
            20,
            30,
            40
          ]
        ],
        20
      ],
      [
        [
          [
            5,
            5,
            5
          ]
        ],
        null
      ],
      [
        [
          [
            1,
            100
          ]
        ],
        1
      ],
      [
        [
          []
        ],
        null
      ],
      [
        [
          [
            -10,
            -5,
            -1
          ]
        ],
        -10
      ]
    ],
    "solution": "def maior_abaixo_media(lista):\n    if not lista:\n        return None\n    media = sum(lista) / len(lista)\n    maior = None\n    for n in lista:\n        if n < media and (maior is None or n > maior):\n            maior = n\n    return maior"
  },
  {
    "exam": "p1",
    "number": 10,
    "title": "Caracteres em posições pares",
    "topic": "fatiamento",
    "task": "Retorne os caracteres de s nos índices 0, 2, 4 e assim por diante, concatenados na ordem original.",
    "steps": [
      "Num fatiamento, o terceiro campo é o passo."
    ],
    "fn": "pares",
    "signature": "pares(s)",
    "tests": [
      [
        [
          "abacate"
        ],
        "aaae"
      ],
      [
        [
          ""
        ],
        ""
      ],
      [
        [
          "01234"
        ],
        "024"
      ],
      [
        [
          "ab"
        ],
        "a"
      ]
    ],
    "solution": "def pares(s):\n    return s[::2]"
  },
  {
    "exam": "p2",
    "number": 1,
    "title": "Estatísticas de altura · ENADE",
    "topic": "listas",
    "task": "Calcule maior, menor, média e quantidade estritamente abaixo da média. Para correção, receba a lista não vazia alturas como argumento e devolva os quatro valores em uma lista nessa ordem. Não use min(), max() ou sort().",
    "steps": [
      "Comece com a primeira altura como maior e menor. Calcule a média antes de contar as alturas abaixo dela."
    ],
    "notes": "O PDF usa random.sample(populacao, 1000), mas há apenas 66 alturas distintas. Para simular 1.000 pessoas, use random.choices(populacao, k=1000). A função recebe a amostra pronta para que os testes sejam reproduzíveis.",
    "fn": "estatisticas_alturas",
    "signature": "estatisticas_alturas(alturas)",
    "tests": [
      [
        [
          [
            1.5,
            1.8,
            2.1
          ]
        ],
        [
          2.1,
          1.5,
          1.8,
          1
        ]
      ],
      [
        [
          [
            1.6,
            1.6
          ]
        ],
        [
          1.6,
          1.6,
          1.6,
          0
        ]
      ],
      [
        [
          [
            1.5,
            1.5,
            2.1
          ]
        ],
        [
          2.1,
          1.5,
          1.7,
          2
        ]
      ]
    ],
    "solution": "def estatisticas_alturas(alturas):\n    maior = menor = alturas[0]\n    for altura in alturas:\n        if altura > maior:\n            maior = altura\n        if altura < menor:\n            menor = altura\n    media = sum(alturas) / len(alturas)\n    abaixo = 0\n    for altura in alturas:\n        if altura < media:\n            abaixo += 1\n    return [maior, menor, media, abaixo]"
  },
  {
    "exam": "p2",
    "number": 2,
    "title": "Conte o padrão z*mbi",
    "topic": "fatiamento",
    "task": "Conte quantas vezes o padrão z*mbi aparece. O * representa exatamente um caractere qualquer. Conte 'zumbi', 'zambi' e 'z#mbi', mas não 'Zumbi'. Use um laço e fatiamento.",
    "steps": [
      "Em cada janela de cinco caracteres, confira o z inicial e o sufixo mbi."
    ],
    "fn": "conta_zumbi",
    "signature": "conta_zumbi(s)",
    "tests": [
      [
        [
          "zumbizambiz#mbi Zumbi"
        ],
        3
      ],
      [
        [
          "zumbi"
        ],
        1
      ],
      [
        [
          "zmbi"
        ],
        0
      ],
      [
        [
          ""
        ],
        0
      ]
    ],
    "solution": "def conta_zumbi(s):\n    total = 0\n    for i in range(len(s) - 4):\n        if s[i] == \"z\" and s[i + 2:i + 5] == \"mbi\":\n            total += 1\n    return total"
  },
  {
    "exam": "p2",
    "number": 3,
    "title": "Substitua repetições da primeira letra",
    "topic": "fatiamento",
    "task": "Preserve o primeiro caractere e substitua por & todas as ocorrências dele no restante da string. Use fatiamento e replace(). Para uma string vazia, devolva uma string vazia.",
    "steps": [
      "Use s[1:] para fazer a troca somente depois do primeiro caractere."
    ],
    "notes": "A string vazia foi acrescentada como caso de borda. O gabarito pressupõe pelo menos um caractere.",
    "fn": "limpa_repetidos",
    "signature": "limpa_repetidos(s)",
    "tests": [
      [
        [
          "mamão"
        ],
        "ma&ão"
      ],
      [
        [
          "aaaa"
        ],
        "a&&&"
      ],
      [
        [
          "a"
        ],
        "a"
      ],
      [
        [
          ""
        ],
        ""
      ]
    ],
    "solution": "def limpa_repetidos(s):\n    if not s:\n        return \"\"\n    primeiro = s[0]\n    return primeiro + s[1:].replace(primeiro, \"&\")"
  },
  {
    "exam": "p2",
    "number": 4,
    "title": "Dígitos ímpares no final",
    "topic": "resto da divisão",
    "task": "Dado um inteiro positivo, retorne quantos dígitos ímpares consecutivos há no final. Por exemplo, 12333 retorna 3.",
    "steps": [
      "Comece pela direita e pare assim que encontrar um dígito par."
    ],
    "fn": "conta_impar",
    "signature": "conta_impar(n)",
    "tests": [
      [
        [
          12333
        ],
        3
      ],
      [
        [
          13579
        ],
        5
      ],
      [
        [
          42
        ],
        0
      ],
      [
        [
          7
        ],
        1
      ]
    ],
    "solution": "def conta_impar(n):\n    total = 0\n    for digito in str(n)[::-1]:\n        if int(digito) % 2 == 0:\n            break\n        total += 1\n    return total"
  },
  {
    "exam": "p2",
    "number": 5,
    "title": "Números especiais",
    "topic": "ordenação",
    "task": "Retorne True se dois inteiros positivos tiverem exatamente os mesmos dígitos, incluindo repetições, em ordens diferentes. Não use for, while nem bibliotecas importadas.",
    "steps": [
      "Compare os dígitos ordenados e também confira se os números originais são diferentes."
    ],
    "notes": "O código do gabarito aceita números idênticos. Aqui vale a condição de ordens diferentes escrita no enunciado.",
    "fn": "especiais",
    "signature": "especiais(n1, n2)",
    "tests": [
      [
        [
          123,
          312
        ],
        true
      ],
      [
        [
          123,
          123
        ],
        false
      ],
      [
        [
          101,
          110
        ],
        true
      ],
      [
        [
          12,
          122
        ],
        false
      ],
      [
        [
          123,
          124
        ],
        false
      ]
    ],
    "solution": "def especiais(n1, n2):\n    return n1 != n2 and sorted(str(n1)) == sorted(str(n2))",
    "rules": { "noLoops": true }
  },
  {
    "exam": "p2",
    "number": 6,
    "title": "Soma de dígitos por posição",
    "topic": "for",
    "task": "Retorne a soma de cada dígito de s multiplicado por seu índice, começando pelo índice zero. Para '123', retorne 8.",
    "steps": [
      "Use o índice e converta o caractere correspondente com int()."
    ],
    "fn": "soma_posicao",
    "signature": "soma_posicao(s)",
    "tests": [
      [
        [
          "123"
        ],
        8
      ],
      [
        [
          "999"
        ],
        27
      ],
      [
        [
          "001"
        ],
        2
      ],
      [
        [
          ""
        ],
        0
      ]
    ],
    "solution": "def soma_posicao(s):\n    soma = 0\n    for i, digito in enumerate(s):\n        soma += i * int(digito)\n    return soma"
  },
  {
    "exam": "p2",
    "number": 7,
    "title": "Teste de mesa · atualização de vetor · ENADE",
    "topic": "listas",
    "task": "Mostre o vetor em cada um dos três prints. Na oficina, retorne uma lista contendo as três listas, na ordem.",
    "steps": [
      "A segunda fase altera os índices 0 a 3. A terceira altera os índices 9 a 5."
    ],
    "source": "v = []\nfor k in range(10):\n    v.append(9 - k)\nprint(\"1:\", v)\nfor k in range(4):\n    v[k] = v[9 - k] + v[k]\nprint(\"2:\", v)\nfor k in range(5):\n    v[9 - k] = 9 - k\nprint(\"3:\", v)",
    "fn": "resposta",
    "signature": "resposta()",
    "tests": [
      [
        [],
        [
          [
            9,
            8,
            7,
            6,
            5,
            4,
            3,
            2,
            1,
            0
          ],
          [
            9,
            9,
            9,
            9,
            5,
            4,
            3,
            2,
            1,
            0
          ],
          [
            9,
            9,
            9,
            9,
            5,
            5,
            6,
            7,
            8,
            9
          ]
        ]
      ]
    ],
    "solution": "def resposta():\n    return [\n        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],\n        [9, 9, 9, 9, 5, 4, 3, 2, 1, 0],\n        [9, 9, 9, 9, 5, 5, 6, 7, 8, 9],\n    ]"
  },
  {
    "exam": "p2",
    "number": 8,
    "title": "Cultura bacteriana · ENADE",
    "topic": "listas",
    "task": "A primeira medição vale 1 e a população dobra a cada hora. Armazene as 24 medições em uma lista e imprima a lista em ordem cronológica. Calcule e imprima o total acumulado. Não use ** nem pow().",
    "steps": [
      "Guarde o valor da medição atual antes de dobrar a população."
    ],
    "program": true,
    "cases": [
      {
        "expect": [
          {
            "list": [
              1,
              2,
              4,
              8,
              16,
              32,
              64,
              128,
              256,
              512,
              1024,
              2048,
              4096,
              8192,
              16384,
              32768,
              65536,
              131072,
              262144,
              524288,
              1048576,
              2097152,
              4194304,
              8388608
            ]
          },
          16777215
        ]
      }
    ],
    "solution": "populacao = []\nbacterias = 1\nfor medicao in range(24):\n    populacao.append(bacterias)\n    bacterias *= 2\nprint(populacao)\ntotal_acumulado = sum(populacao)\nprint(total_acumulado)",
    "quiz": [
      {
        "q": "Qual é o total acumulado das 24 medições?",
        "choices": [
          "16777215",
          "8388608",
          "16777216",
          "8388607"
        ],
        "answer": 0,
        "explain": "Resposta: 16777215. Guarde o valor da medição atual antes de dobrar a população."
      }
    ]
  }
];

PAST_EXAMS.forEach((question) => {
  const { exam, number, title, topic, task, steps, source, notes, solution } = question;
  const id = `prova-${exam}-${number}`;
  const ref = `${exam.toUpperCase()} · DSM · questão ${number}`;
  const sourceNote = `${ref} · ${exam === "p2" ? "adaptada do gabarito oficial" : "resolução do caderno"}`;
  let variants = question.quiz;
  if (!variants && question.program) variants = programQuiz(question);
  if (!variants) {
    variants = question.tests.slice(0, 2).map(([args, expected]) => ({
      q: `Qual é o retorno de ${question.fn}(${args.map(pythonRepr).join(", ")})?`,
      choices: quizChoices(expected, args, question.tests.map((test) => test[1])),
      answer: 0,
      explain: `O resultado esperado é ${pythonRepr(expected)}. ${steps[0]}`,
    }));
  }
  EXERCISES.push({
    id,
    exam,
    letter: String(number),
    title,
    ref,
    sourceNote,
    topics: [topic],
    summary: task,
    source,
    notes,
    hint: steps,
    steps,
    solution,
    variants,
  });
  CODE_SPECS[id] = question;
});
