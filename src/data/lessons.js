"use strict";
// Guias de revisão por tema. merge-lists.js acrescenta lições e vincula exercícios.
const LESSONS = [
  {
    topic: "endswith",
    title: "endswith · conferir o final",
    description:
      "Um método de string que retorna True ou False. O nome inclui o s de ends: endswith, e não endwith.",
    syntax: "texto.endswith(sufixo)\ntexto.endswith((sufixo1, sufixo2))",
    example:
      "nome = 'foto.png'\nprint(nome.endswith('.png'))       # True\nprint(nome.endswith(('.jpg', '.png')))  # True\nprint('foto.PNG'.endswith('.png'))  # False",
    steps: [
      "Identifique o final que você quer reconhecer.",
      "Chame o método com ponto e parênteses.",
      "Use o booleano diretamente em um if. Para ignorar maiúsculas, normalize com lower() antes.",
    ],
    pitfall:
      "Não confunda com in: in procura em qualquer posição; endswith verifica o final. Não remove nem modifica o sufixo.",
    check: "Qual seria o resultado para um nome terminado em .png.bak?",
    ids: ["ends", "slice"],
  },
  {
    topic: "replace",
    title: "replace · produzir uma nova string",
    description:
      "Substitui ocorrências de um trecho e devolve outra string. A string original é imutável.",
    syntax: "texto.replace(antigo, novo)\ntexto.replace(antigo, novo, quantidade)",
    example:
      "texto = 'coco'\nnovo = texto.replace('o', 'a', 1)\nprint(novo)   # caco\nprint(texto)  # coco",
    steps: [
      "Escolha o trecho procurado e o substituto.",
      "O terceiro argumento é opcional e limita quantas ocorrências serão trocadas.",
      "Guarde o retorno em uma variável para usar o texto modificado.",
    ],
    pitfall:
      "texto.replace(...) sozinho não muda a variável texto. Para preservar uma posição, separe-a antes de substituir o restante.",
    check: "O que muda ao retirar o argumento 1 do exemplo?",
    ids: ["replace", "fixa"],
  },
  {
    topic: "for",
    title: "for · percorrer uma sequência",
    description:
      "Use quando você quer visitar os itens de uma sequência ou repetir algo uma quantidade definida de vezes.",
    syntax:
      "for item in sequencia:\n    comando\n\nfor i in range(inicio, fim, passo):\n    comando",
    example:
      "total = 0\nfor valor in [2, 5, 1]:\n    total += valor\nprint(total)  # 8\n\nfor i in range(2, 8, 2):\n    print(i)  # 2, depois 4, depois 6",
    steps: [
      "Inicialize o acumulador antes do laço.",
      "A variável do for recebe cada elemento, não necessariamente o índice.",
      "range exclui o limite final. Com passo negativo, o início precisa estar do lado apropriado do fim.",
    ],
    pitfall:
      "Reiniciar total dentro do laço descarta o que já foi somado. range(4) gera 0, 1, 2, 3.",
    check: "Se total = 0 estivesse dentro do primeiro for, qual valor sobraria?",
    ids: ["mesa_for", "arroz", "repetidos"],
  },
  {
    topic: "while",
    title: "while · repetir enquanto for verdadeiro",
    description: "A condição é testada antes de cada volta. O corpo pode executar zero vezes.",
    syntax: "while condicao:\n    comando\n    atualizacao",
    example: "n = 2\nwhile n < 9:\n    print(n)  # 2, 4, 6, 8\n    n += 2\nprint(n)     # 10",
    steps: [
      "Anote o estado inicial das variáveis.",
      "Teste a condição antes de entrar.",
      "Execute na ordem e atualize a variável que controla a repetição.",
      "Repita o teste com os novos valores.",
    ],
    pitfall:
      "Sem uma atualização que leve à saída, o laço pode ser infinito. < e <= mudam a última iteração.",
    check: "O que muda se n começar em 12?",
    ids: ["mesa_while", "logica"],
  },
  {
    topic: "strings",
    title: "Strings · caracteres e imutabilidade",
    description:
      "Uma string é uma sequência de caracteres. Índices começam em zero; índices negativos contam a partir do fim.",
    syntax:
      "s[0]     # primeiro caractere\ns[-1]    # último caractere\nlen(s)   # quantidade de caracteres",
    example:
      "s = 'caderno'\nprint(s[0], s[-1])  # c o\nprint(len(s))      # 7\nprint(s.lower())   # caderno",
    steps: [
      "Confira se a string não está vazia antes de acessar s[0].",
      "Para criar uma alteração, combine trechos ou use métodos que retornem outra string.",
      "Comparações distinguem maiúsculas, acentos e espaços, salvo normalização explícita.",
    ],
    pitfall: "s[0] = outra_letra não funciona: strings são imutáveis.",
    check: "É possível acessar a primeira posição de uma string vazia?",
    ids: ["fixa", "ends", "replace", "anagrama"],
  },
  {
    topic: "slicing",
    title: "Slicing · recortar com início, fim e passo",
    description:
      "Um recorte seleciona posições sem incluir o limite final. Omitir limites usa os padrões adequados à direção do passo.",
    syntax: "sequencia[inicio:fim:passo]\nsequencia[::-1]  # ordem inversa",
    example:
      "s = 'abcdef'\nprint(s[1:5:2])  # bd\nprint(s[:3])     # abc\nprint(s[::-1])   # fedcba",
    steps: [
      "Marque os índices da sequência.",
      "Comece na posição inicial e avance pelo passo.",
      "Pare antes de atingir ou ultrapassar o limite final na direção do passo.",
    ],
    pitfall:
      "O passo não pode ser zero. Recortar uma lista cria uma cópia superficial; objetos internos ainda podem ser compartilhados.",
    check: "Quais posições s[::2] visita?",
    ids: ["slice", "fixa", "alias", "invertida"],
  },
  {
    topic: "listas",
    title: "Listas · guardar, percorrer e alterar",
    description:
      "Listas são sequências mutáveis. Podem receber elementos novos e ter posições substituídas.",
    syntax: "valores = []\nvalores.append(item)\nvalores[indice] = novo_valor",
    example: "a = [8, 2]\nb = a[:]\nb.append(5)\nprint(a)  # [8, 2]\nprint(b)  # [8, 2, 5]",
    steps: [
      "Use append para adicionar um item ao final.",
      "Use for item in lista para percorrer valores.",
      "Use uma cópia quando o exercício pedir para preservar a lista de origem.",
    ],
    pitfall: "append retorna None. Escrever a = a.append(5) faz a deixar de referenciar a lista.",
    check: "O que mudaria no exemplo se b = a?",
    ids: ["alias", "repetidos", "alturas"],
  },
  {
    topic: "lógica",
    title: "Condições · if, comparações e booleanos",
    description:
      "Condições escolhem quais comandos serão executados. and exige ambas as partes; or aceita pelo menos uma; not inverte o booleano.",
    syntax: "if condicao:\n    comando\nelif outra_condicao:\n    comando\nelse:\n    comando",
    example:
      "idade = 17\nacompanhado = True\nliberado = idade >= 18 or acompanhado\nprint(liberado)  # True",
    steps: [
      "Resolva comparações como ==, < e >=.",
      "A precedência é not, depois and, depois or.",
      "Use parênteses para deixar a intenção clara.",
    ],
    pitfall:
      "= atribui; == compara. Um if/elif escolhe no máximo um ramo, mas dois if independentes podem executar ambos.",
    check: "Quando uma expressão com and retorna False?",
    ids: ["logica", "anagrama", "ends"],
  },
  {
    topic: "funções e return",
    title: "Funções · receber argumentos e retornar",
    description:
      "def define uma função. Parâmetros recebem as entradas. return entrega o resultado a quem chamou e encerra a função.",
    syntax: "def nome(parametro):\n    resultado = parametro * 2\n    return resultado",
    example: "def triplo(x):\n    return x * 3\n\nvalor = triplo(4)\nprint(valor)  # 12",
    steps: [
      "Leia a assinatura e identifique as entradas.",
      "Calcule o resultado no corpo indentado.",
      "Retorne o tipo solicitado: booleano, número, string, lista ou tupla.",
    ],
    pitfall:
      "print apenas mostra algo; não substitui return. Uma função sem return explícito devolve None.",
    check: "Qual valor uma variável recebe ao guardar o retorno de uma função que só imprime?",
    ids: ["fixa", "derivada", "ends"],
  },
  {
    topic: "testes de mesa",
    title: "Teste de mesa · executar uma linha por vez",
    description:
      "Monte uma tabela de variáveis e atualize-a depois de cada etapa. Use os valores atuais, inclusive depois de uma atribuição anterior.",
    syntax: "Etapa | variável de controle | acumulador\ninício | ... | ...\nvolta 1 | ... | ...",
    example:
      "s = 1\nfor x in [2, 3]:\n    s *= x\n\n# fim da volta | x | s\n# 1            | 2 | 2\n# 2            | 3 | 6",
    steps: [
      "Registre os valores antes do laço.",
      "Verifique condições e os limites de range.",
      "Faça as atribuições na ordem do programa.",
      "Registre o estado no ponto pedido pelo enunciado, por exemplo ao fim de cada volta.",
    ],
    pitfall:
      "Confundir o valor antes e depois do incremento muda a tabela inteira. Uma atribuição não troca dois valores automaticamente.",
    check: "No exemplo, qual é s antes de começar a segunda volta?",
    ids: ["mesa_for", "mesa_while", "matriz", "alias"],
  },
  {
    topic: "anagramas",
    title: "Anagramas · frequências, não só letras",
    description:
      "Verificar anagramas compara duas strings. Contar anagramas calcula quantos arranjos distintos podem ser formados: são tarefas diferentes.",
    syntax:
      "sorted(texto)  # lista de caracteres ordenada\n# Contagem de arranjos: n! / (f1! * f2! * ...)",
    example:
      "print(sorted('sol'))   # ['l', 'o', 's']\nprint(sorted('los'))   # ['l', 'o', 's']\n# 'aa' e 'a' têm o mesmo conjunto, mas frequências diferentes.",
    steps: [
      "Defina se espaços, acentos e maiúsculas são significativos.",
      "Para verificar, compare frequências ou caracteres ordenados.",
      "Para contar arranjos distintos, desconte as permutações entre letras iguais.",
    ],
    pitfall: "set elimina repetições. Comparar só conjuntos aceita pares que não são anagramas.",
    check: "Por que aab e abb não são anagramas?",
    ids: ["anagrama", "contar"],
  },
  {
    topic: "derivada",
    title: "Derivada · coeficientes e posições",
    description:
      "Neste treino, o índice da lista é o grau do termo: coef[i] multiplica x elevado a i.",
    syntax: "d/dx (a * x**n) = n * a * x**(n-1)",
    example: "# [7, 4, 3] representa 7 + 4x + 3x²\n# derivada: 4 + 6x\n# representação: [4, 6]",
    steps: [
      "A derivada da constante é zero.",
      "Multiplique cada coeficiente pelo grau original.",
      "O grau de cada termo diminui uma unidade.",
      "Siga a convenção de zeros descrita no exercício.",
    ],
    pitfall:
      "Não confunda ordem crescente e decrescente dos coeficientes. A convenção precisa ser lida no enunciado.",
    check: "Em qual posição fica o coeficiente de x³?",
    ids: ["derivada"],
  },
  {
    topic: "soma de listas invertidas",
    title: "Dígitos invertidos · unidades primeiro",
    description:
      "A lista representa dígitos de um número da menor para a maior ordem. Somar os itens posição a posição exige tratar o vai-um.",
    syntax: "numero = soma(digito[i] * 10**i)\n# 10**0 → unidades; 10**1 → dezenas",
    example:
      "# [6, 4] representa 46\n# [5, 1] representa 15\n# 46 + 15 = 61, representado por [1, 6]",
    steps: [
      "Reconstrua os números ou implemente a soma com transporte.",
      "Inclua o transporte na próxima posição.",
      "Se sobrar transporte ao final, adicione um dígito.",
    ],
    pitfall:
      "Listas podem ter comprimentos diferentes. Zero deve ter a representação solicitada, aqui [0].",
    check: "Por que um dígito 12 não pode permanecer como item da lista de resultado?",
    ids: ["invertida"],
  },
  {
    topic: "remoção de repetidos",
    title: "Remover repetidos preservando a ordem",
    description:
      "Percorra a entrada na ordem e mantenha apenas a primeira ocorrência de cada valor.",
    syntax: "if item not in resultado:\n    resultado.append(item)",
    example:
      "# entrada: [4, 2, 4, 7, 2]\n# primeiras ocorrências: 4, depois 2, depois 7\n# saída: [4, 2, 7]",
    steps: [
      "Crie um resultado vazio.",
      "Verifique se o item já apareceu.",
      "Só adicione quando ainda estiver ausente.",
    ],
    pitfall:
      "Ordenar a saída altera a ordem original. Evite remover itens da própria lista enquanto percorre suas posições.",
    check: "O que acontece com uma entrada composta somente por valores iguais?",
    ids: ["repetidos"],
  },
  {
    topic: "matrizes",
    title: "Matrizes · linha e coluna",
    description:
      "Uma matriz pode ser representada como uma lista de listas. m[i][j] acessa a linha i e a coluna j.",
    syntax: "for i in range(linhas):\n    for j in range(colunas):\n        valor = m[i][j]",
    example:
      "m = [[2, 5], [7, 9]]\nprint(m[1][0])  # 7\n# linhas independentes:\nnova = [[0 for j in range(2)] for i in range(2)]",
    steps: [
      "Anote as dimensões e os índices válidos.",
      "Use o laço externo para as linhas e o interno para as colunas.",
      "Se o algoritmo modifica a matriz, cada leitura seguinte usa o valor atual.",
    ],
    pitfall: "[[0]*2]*2 compartilha a mesma linha duas vezes. Alterar uma pode alterar ambas.",
    check: "Qual posição representa a segunda linha e a primeira coluna?",
    ids: ["matriz", "arroz"],
  },
];
