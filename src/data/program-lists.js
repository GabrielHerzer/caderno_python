"use strict";
/* Listas 1–5 do Python para Zumbis (professor Fernando Massanori): programas com input() e print().
O corretor (src/core/program-grader.js) roda o programa com as entradas de cada caso e procura na
saída os números e palavras esperados; o texto em volta é livre. Os formatos de expect estão
descritos no cabeçalho do corretor. Enunciados normalizados a partir dos PDFs enviados. */
const PROGRAM_LISTS = (() => {
  const evens = (xs) => xs.filter((x) => x % 2 === 0);
  const odds = (xs) => xs.filter((x) => x % 2 !== 0);
  const interleave = (a, b) => a.flatMap((x, i) => [x, b[i]]);
  const unique = (xs) => [...new Set(xs)];

  // Lista 4: sorteios que o corretor entrega a random.randint, em ordem.
  const draws10 = [
    [37, 5, 88, 12, 99, 41, 3, 60, 70, 18],
    [64, 64, 22, 91, 7, 100, 58, 1, 33, 45],
    [42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
  ];
  const draws20 = [
    [23, 8, 71, 44, 90, 5, 16, 37, 62, 99, 14, 3, 58, 81, 26, 47, 70, 11, 6, 93],
    [2, 4, 6, 8, 10, 1, 3, 5, 7, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 100],
  ];
  const vectors = [
    [17, 42, 8, 99, 63, 5, 28, 71, 34, 56, 3, 88, 46, 12, 77, 60, 21, 94, 39, 65],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91],
  ];

  // Lista 4, exercícios 4 e 5: o statement de diversidade da PSF, como está no PDF.
  const statement =
    "The Python Software Foundation and the global Python community welcome and encourage participation by everyone. Our community is based on mutual respect, tolerance, and encouragement, and we are working to help each other live up to these principles. We want our community to be more diverse: whoever you are, and whatever your background, we welcome you.";
  const words = statement
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z]/g, ""));
  const startsOrEnds = words.filter((w) => "python".includes(w[0]) || "python".includes(w.at(-1)));
  const longWithLetter = words.filter(
    (w) => w.length > 4 && [...w].some((c) => "python".includes(c)),
  );

  // Lista 5, questão E: telefones do PDF.
  const phones = `213752 216732 221063 221545 225583 229133 230648 233222
236043 237330 239636 240138 242123 246224 249183 252936
254711 257200 257607 261424 263814 266794 268649 273050
275001 277606 278997 283331 287104 287953 289137 291591
292559 292946 295180 295566 297529 300400 304707 306931
310638 313595 318449 319021 322082 323796 326266 326880
327249 329914 334392 334575 336723 336734 338808 343269
346040 350113 353631 357154 361633 361891 364889 365746
365749 366426 369156 369444 369689 372896 374983 375223
379163 380712 385640 386777 388599 389450 390178 392943
394742 395921 398644 398832 401149 402219 405364 408088
412901 417683 422267 424767 426613 430474 433910 435054
440052 444630 447852 449116 453865 457631 461750 462985
463328 466458 469601 473108 476773 477956 481991 482422
486195 488359 489209 489388 491928 496569 496964 497901
500877 502386 502715 507617 512526 512827 513796 518232
521455 524277 528496 529345 531231 531766 535067 535183
536593 537360 539055 540582 543708 547492 550779 551595
556493 558807 559102 562050 564962 569677 570945 575447
579937 580112 580680 582458 583012 585395 586244 587393
590483 593112 593894 594293 597525 598184 600455 600953
601523 605761 608618 609198 610141 610536 612636 615233
618314 622752 626345 626632 628889 629457 629643 633673
637656 641136 644176 644973 647617 652218 657143 659902
662224 666265 668010 672480 672695 676868 677125 678315`;

  const INVALID = "inválid|invalid|incorret|erro";
  const RANDOM_NOTE =
    "O corretor controla os sorteios: use random.randint(1, 100), um número por vez, para que cada caso tenha valores conhecidos. Em Executar livremente, os sorteios são aleatórios de verdade.";
  const ANSWER_NOTE =
    "O PDF traz a resposta da questão. O corretor confere o número; o treino é escrever o programa que chega nele, sem imprimir a resposta pronta.";

  return [
    // ------------------------------------------------------------------ Lista 1
    {
      id: "soma_dois",
      list: 1,
      letter: "1",
      title: "Soma de dois inteiros",
      task: "Peça dois números inteiros e imprima a soma deles.",
      topics: ["entrada e saída", "operadores"],
      solution:
        "a = int(input('Primeiro número: '))\nb = int(input('Segundo número: '))\nprint('Soma:', a + b)",
      cases: [
        { stdin: ["10", "25"], expect: [35] },
        { stdin: ["-8", "3"], expect: [-5] },
        { stdin: ["0", "0"], expect: [0] },
      ],
      steps: [
        "input() sempre devolve texto; converta cada valor com int().",
        "Guarde os dois números em variáveis e some.",
        "Mostre o resultado com print.",
      ],
      notes: "",
    },
    {
      id: "metros_mm",
      list: 1,
      letter: "2",
      title: "Metros em milímetros",
      task: "Leia um valor em metros (pode ter casas decimais) e exiba o valor convertido em milímetros.",
      topics: ["entrada e saída", "operadores"],
      solution: "metros = float(input('Metros: '))\nprint(metros * 1000, 'mm')",
      cases: [
        { stdin: ["2"], expect: [2000] },
        { stdin: ["1.5"], expect: [1500] },
        { stdin: ["0.25"], expect: [250] },
      ],
      steps: [
        "Um metro tem 1000 milímetros.",
        "Use float(), e não int(), porque o valor pode ser 1.5.",
        "Multiplique e imprima.",
      ],
      notes: "",
    },
    {
      id: "total_segundos",
      list: 1,
      letter: "3",
      title: "Dias, horas, minutos e segundos",
      task: "Leia, nesta ordem, uma quantidade de dias, horas, minutos e segundos. Calcule e imprima o total em segundos.",
      topics: ["entrada e saída", "operadores"],
      solution:
        "dias = int(input('Dias: '))\nhoras = int(input('Horas: '))\nminutos = int(input('Minutos: '))\nsegundos = int(input('Segundos: '))\ntotal = ((dias * 24 + horas) * 60 + minutos) * 60 + segundos\nprint('Total em segundos:', total)",
      cases: [
        { stdin: ["1", "2", "3", "4"], expect: [93784] },
        { stdin: ["0", "0", "1", "30"], expect: [90] },
        { stdin: ["2", "0", "0", "0"], expect: [172800] },
      ],
      steps: [
        "Um dia tem 24 horas, uma hora tem 60 minutos e um minuto tem 60 segundos.",
        "Converta tudo para segundos e some: dias * 86400 + horas * 3600 + minutos * 60 + segundos.",
        "Confira com 1 dia, 2 horas, 3 minutos e 4 segundos: 93784.",
      ],
      notes: "",
    },
    {
      id: "aumento_salario",
      list: 1,
      letter: "4",
      title: "Aumento de salário",
      task: "Peça o valor do salário e a porcentagem de aumento. Exiba o valor do aumento e o novo salário.",
      topics: ["entrada e saída", "operadores"],
      solution:
        "salario = float(input('Salário: '))\npercentual = float(input('Aumento (%): '))\naumento = salario * percentual / 100\nprint('Aumento:', aumento)\nprint('Novo salário:', salario + aumento)",
      cases: [
        { stdin: ["1500", "10"], expect: [150, 1650] },
        { stdin: ["1200", "5"], expect: [60, 1260] },
        { stdin: ["2000", "8"], expect: [160, 2160] },
      ],
      steps: [
        "O aumento é salário × porcentagem / 100.",
        "O novo salário é o salário mais o aumento.",
        "Imprima os dois valores.",
      ],
      notes: "",
    },
    {
      id: "desconto",
      list: 1,
      letter: "5",
      title: "Preço com desconto",
      task: "Peça o preço de uma mercadoria e o percentual de desconto. Exiba o valor do desconto e o preço a pagar.",
      topics: ["entrada e saída", "operadores"],
      solution:
        "preco = float(input('Preço: '))\npercentual = float(input('Desconto (%): '))\ndesconto = preco * percentual / 100\nprint('Desconto: R$', round(desconto, 2))\nprint('A pagar: R$', round(preco - desconto, 2))",
      cases: [
        { stdin: ["80", "25"], expect: [20, 60] },
        { stdin: ["59.90", "10"], expect: [5.99, 53.91] },
        { stdin: ["200", "0"], expect: [0, 200] },
      ],
      steps: [
        "O desconto é preço × percentual / 100.",
        "O preço a pagar é o preço menos o desconto.",
        "Valores em reais podem ser mostrados com duas casas: round(valor, 2).",
      ],
      notes: "",
    },
    {
      id: "tempo_viagem",
      list: 1,
      letter: "6",
      title: "Tempo de viagem",
      task: "Pergunte a distância a percorrer (km) e a velocidade média esperada (km/h). Calcule e exiba o tempo da viagem em horas.",
      topics: ["entrada e saída", "operadores"],
      solution:
        "distancia = float(input('Distância (km): '))\nvelocidade = float(input('Velocidade média (km/h): '))\nprint('Tempo:', distancia / velocidade, 'horas')",
      cases: [
        { stdin: ["300", "60"], expect: [5] },
        { stdin: ["150", "100"], expect: [1.5] },
        { stdin: ["45", "90"], expect: [0.5] },
      ],
      steps: [
        "Tempo = distância / velocidade.",
        "Use / (divisão real), não // (divisão inteira): 150 / 100 é 1.5.",
      ],
      notes: "",
    },
    {
      id: "celsius_fahrenheit",
      list: 1,
      letter: "7",
      title: "Celsius para Fahrenheit",
      task: "Converta uma temperatura digitada em Celsius para Fahrenheit: F = 9 * C / 5 + 32.",
      topics: ["entrada e saída", "operadores"],
      solution: "c = float(input('Celsius: '))\nprint('Fahrenheit:', 9 * c / 5 + 32)",
      cases: [
        { stdin: ["100"], expect: [212] },
        { stdin: ["0"], expect: [32] },
        { stdin: ["37"], expect: [98.6] },
      ],
      steps: [
        "Leia a temperatura com float().",
        "Aplique a fórmula do enunciado na ordem: 9 * C / 5 + 32.",
      ],
      notes: "No PDF, os itens 7 e 8 aparecem na mesma linha; aqui são dois exercícios.",
    },
    {
      id: "fahrenheit_celsius",
      list: 1,
      letter: "8",
      title: "Fahrenheit para Celsius",
      task: "Faça o contrário do exercício anterior: converta uma temperatura em Fahrenheit para Celsius.",
      topics: ["entrada e saída", "operadores"],
      solution: "f = float(input('Fahrenheit: '))\nprint('Celsius:', (f - 32) * 5 / 9)",
      cases: [
        { stdin: ["212"], expect: [100] },
        { stdin: ["32"], expect: [0] },
        { stdin: ["98.6"], expect: [37] },
      ],
      steps: [
        "Isole C na fórmula F = 9 * C / 5 + 32.",
        "C = (F - 32) * 5 / 9. Os parênteses são necessários.",
      ],
      notes: "No PDF, os itens 7 e 8 aparecem na mesma linha; aqui são dois exercícios.",
    },
    {
      id: "aluguel_carro",
      list: 1,
      letter: "9",
      title: "Aluguel de carro",
      task: "Pergunte, nesta ordem, os km percorridos por um carro alugado e por quantos dias ele foi alugado. Calcule o preço a pagar: R$ 60,00 por dia e R$ 0,15 por km rodado.",
      topics: ["entrada e saída", "operadores"],
      solution:
        "km = float(input('Km percorridos: '))\ndias = int(input('Dias de aluguel: '))\nprint('Total a pagar: R$', dias * 60 + km * 0.15)",
      cases: [
        { stdin: ["100", "2"], expect: [135] },
        { stdin: ["250", "5"], expect: [337.5] },
        { stdin: ["0", "1"], expect: [60] },
      ],
      steps: [
        "Some as duas partes: dias × 60 e km × 0.15.",
        "Em Python o separador decimal é ponto: 0.15, não 0,15.",
      ],
      notes: "",
    },
    {
      id: "fumante",
      list: 1,
      letter: "10",
      title: "Vida perdida pelo fumante",
      task: "Pergunte, nesta ordem, quantos cigarros a pessoa fuma por dia e há quantos anos fuma. Considerando que cada cigarro tira 10 minutos de vida, calcule e exiba quantos dias de vida ela perdeu.",
      topics: ["entrada e saída", "operadores"],
      solution:
        "cigarros = int(input('Cigarros por dia: '))\nanos = int(input('Anos fumando: '))\nminutos = cigarros * 365 * anos * 10\nprint('Dias perdidos:', round(minutos / (24 * 60), 2))",
      cases: [
        { stdin: ["20", "10"], expect: [506.94] },
        { stdin: ["10", "1"], expect: [25.35] },
        { stdin: ["1", "1"], expect: [2.53] },
      ],
      steps: [
        "Total de cigarros = cigarros por dia × 365 × anos.",
        "Minutos perdidos = total × 10.",
        "Um dia tem 24 × 60 = 1440 minutos.",
      ],
      notes: "Considera anos de 365 dias.",
    },
    {
      id: "digitos_potencia",
      list: 1,
      letter: "11",
      title: "Dígitos de 2 elevado a 10000",
      task: "Sabendo que str() converte números em texto, calcule e imprima quantos dígitos há em 2 elevado a 10000.",
      topics: ["entrada e saída", "strings"],
      solution: "print(len(str(2 ** 10000)))",
      cases: [{ expect: [3011] }],
      steps: [
        "2 elevado a 10000 é 2 ** 10000.",
        "len() conta os caracteres do texto gerado por str().",
      ],
      notes: "",
    },

    // ------------------------------------------------------------------ Lista 2
    {
      id: "triangulo",
      list: 2,
      letter: "1",
      title: "Tipo de triângulo",
      task: "Peça os três lados de um triângulo. Informe se os valores podem formar um triângulo (cada lado menor que a soma dos outros dois). Se formarem, diga se ele é equilátero, isósceles ou escaleno; se não, mostre uma mensagem com “não”.",
      topics: ["entrada e saída", "lógica"],
      solution:
        "a = float(input('Lado 1: '))\nb = float(input('Lado 2: '))\nc = float(input('Lado 3: '))\nif a < b + c and b < a + c and c < a + b:\n    if a == b == c:\n        print('Triângulo equilátero')\n    elif a == b or a == c or b == c:\n        print('Triângulo isósceles')\n    else:\n        print('Triângulo escaleno')\nelse:\n    print('Os lados não formam um triângulo')",
      cases: [
        {
          stdin: ["3", "4", "5"],
          expect: ["escaleno"],
          absent: ["não", "equilátero", "isósceles"],
        },
        {
          stdin: ["2", "2", "2"],
          expect: ["equilátero"],
          absent: ["não", "isósceles", "escaleno"],
        },
        {
          stdin: ["5", "5", "8"],
          expect: ["isósceles"],
          absent: ["não", "equilátero", "escaleno"],
        },
        {
          stdin: ["1", "2", "10"],
          expect: ["não"],
          absent: ["equilátero", "isósceles", "escaleno"],
        },
        {
          stdin: ["1", "2", "3"],
          expect: ["não"],
          absent: ["equilátero", "isósceles", "escaleno"],
        },
      ],
      steps: [
        "Primeiro teste se os lados formam um triângulo; só depois classifique.",
        "Lados 1, 2 e 3 não formam triângulo: 3 não é menor que 1 + 2.",
        "Equilátero: três lados iguais. Isósceles: exatamente dois iguais. Escaleno: todos diferentes.",
      ],
      notes: "",
      quiz: [
        {
          q: "Com os lados 5, 5 e 8, o que o programa deve informar?",
          choices: ["isósceles", "equilátero", "escaleno", "não forma triângulo"],
          answer: 0,
          explain:
            "5 < 5 + 8 e 8 < 5 + 5, então forma triângulo; dois lados iguais fazem dele isósceles.",
        },
        {
          q: "Com os lados 1, 2 e 3, o que o programa deve informar?",
          choices: ["não forma triângulo", "escaleno", "isósceles", "equilátero"],
          answer: 0,
          explain: "3 não é menor que 1 + 2 (é igual): os lados ficariam deitados numa reta.",
        },
      ],
    },
    {
      id: "bissexto",
      list: 2,
      letter: "2",
      title: "Ano bissexto",
      task: "Leia um ano e diga se ele é bissexto. Um ano é bissexto se for divisível por 4 e não por 100, ou se for divisível por 400. Quando não for, a mensagem deve conter “não” (por exemplo, “não é bissexto”).",
      topics: ["entrada e saída", "lógica", "resto da divisão"],
      solution:
        "ano = int(input('Ano: '))\nif ano % 400 == 0 or (ano % 4 == 0 and ano % 100 != 0):\n    print(ano, 'é bissexto')\nelse:\n    print(ano, 'não é bissexto')",
      cases: [
        { stdin: ["2024"], expect: ["bissext"], absent: ["não"] },
        { stdin: ["1900"], expect: ["não", "bissext"] },
        { stdin: ["2000"], expect: ["bissext"], absent: ["não"] },
        { stdin: ["2023"], expect: ["não", "bissext"] },
      ],
      steps: [
        "Divisível por n significa ano % n == 0.",
        "1900 é divisível por 4 e por 100, mas não por 400: não é bissexto.",
        "2000 é divisível por 400: é bissexto.",
      ],
      notes: "O PDF manda pesquisar a regra; ela está no enunciado.",
      quiz: [
        {
          q: "O ano 1900 é bissexto?",
          choices: [
            "Não: é divisível por 100 e não por 400",
            "Sim: é divisível por 4",
            "Sim: é divisível por 100",
          ],
          answer: 0,
          explain:
            "Divisíveis por 100 só são bissextos se também forem divisíveis por 400, como 2000.",
        },
      ],
    },
    {
      id: "pescador",
      list: 2,
      letter: "3",
      title: "Multa do pescador",
      task: "João Papo-de-Pescador paga multa de R$ 4,00 por quilo de peixe acima de 50 kg. Leia o peso de peixes, guarde o excesso na variável excesso e a multa na variável multa, e mostre as duas (por exemplo, “Excesso: 10” e “Multa: 40”). Se não houver excesso, mostre as duas com o valor zero.",
      topics: ["entrada e saída", "lógica"],
      solution:
        "peso = float(input('Peso dos peixes (kg): '))\nexcesso = 0\nmulta = 0\nif peso > 50:\n    excesso = peso - 50\n    multa = excesso * 4\nprint('Excesso:', excesso)\nprint('Multa: R$', multa)",
      cases: [
        {
          stdin: ["60"],
          expect: [
            { label: "excesso", value: 10 },
            { label: "multa", value: 40 },
          ],
        },
        {
          stdin: ["50"],
          expect: [
            { label: "excesso", value: 0 },
            { label: "multa", value: 0 },
          ],
        },
        {
          stdin: ["73.5"],
          expect: [
            { label: "excesso", value: 23.5 },
            { label: "multa", value: 94 },
          ],
        },
        {
          stdin: ["12"],
          expect: [
            { label: "excesso", value: 0 },
            { label: "multa", value: 0 },
          ],
        },
      ],
      steps: [
        "Comece com excesso = 0 e multa = 0.",
        "Se o peso passar de 50, excesso = peso - 50 e multa = excesso × 4.",
        "Mostre as duas variáveis nos dois casos.",
      ],
      notes: "",
    },
    {
      id: "maior_de_tres",
      list: 2,
      letter: "4",
      title: "Maior de três números",
      task: "Leia três números e mostre o maior deles na forma “Maior: 9”.",
      topics: ["entrada e saída", "lógica"],
      solution:
        "a = float(input('Número 1: '))\nb = float(input('Número 2: '))\nc = float(input('Número 3: '))\nmaior = a\nif b > maior:\n    maior = b\nif c > maior:\n    maior = c\nprint('Maior:', maior)",
      cases: [
        { stdin: ["3", "9", "5"], expect: [{ label: "maior", value: 9 }] },
        { stdin: ["-1", "-7", "-3"], expect: [{ label: "maior", value: -1 }] },
        { stdin: ["4", "4", "2"], expect: [{ label: "maior", value: 4 }] },
        { stdin: ["2", "8", "8"], expect: [{ label: "maior", value: 8 }] },
      ],
      steps: [
        "Suponha que o primeiro é o maior e compare com os outros.",
        "Com >, empates como 4, 4, 2 ainda precisam mostrar um maior.",
      ],
      notes: "",
    },
    {
      id: "maior_menor",
      list: 2,
      letter: "5",
      title: "Maior e menor de três números",
      task: "Leia três números e mostre o maior e o menor deles, cada um com seu rótulo: “Maior: 9” e “Menor: 3”.",
      topics: ["entrada e saída", "lógica"],
      solution:
        "a = float(input('Número 1: '))\nb = float(input('Número 2: '))\nc = float(input('Número 3: '))\nmaior = menor = a\nfor n in (b, c):\n    if n > maior:\n        maior = n\n    if n < menor:\n        menor = n\nprint('Maior:', maior)\nprint('Menor:', menor)",
      cases: [
        {
          stdin: ["3", "9", "5"],
          expect: [
            { label: "maior", value: 9 },
            { label: "menor", value: 3 },
          ],
        },
        {
          stdin: ["7", "7", "7"],
          expect: [
            { label: "maior", value: 7 },
            { label: "menor", value: 7 },
          ],
        },
        {
          stdin: ["-2", "10", "0"],
          expect: [
            { label: "maior", value: 10 },
            { label: "menor", value: -2 },
          ],
        },
        {
          stdin: ["5", "1", "1"],
          expect: [
            { label: "maior", value: 5 },
            { label: "menor", value: 1 },
          ],
        },
      ],
      steps: [
        "Comece com maior = menor = primeiro número.",
        "Compare cada um dos outros com os dois.",
        "Teste também três números iguais.",
      ],
      notes: "",
    },
    {
      id: "salario_liquido",
      list: 2,
      letter: "6",
      title: "Salário bruto e descontos",
      task: "Pergunte quanto você ganha por hora e quantas horas trabalhou no mês. Mostre, cada um com seu rótulo: salário bruto, IR (11%), INSS (8%), sindicato (5%) e salário líquido (bruto menos os descontos).",
      topics: ["entrada e saída", "operadores"],
      solution:
        "por_hora = float(input('Ganho por hora: '))\nhoras = float(input('Horas no mês: '))\nbruto = por_hora * horas\nir = bruto * 0.11\ninss = bruto * 0.08\nsindicato = bruto * 0.05\nprint('+ Salário bruto: R$', bruto)\nprint('- IR (11%): R$', ir)\nprint('- INSS (8%): R$', inss)\nprint('- Sindicato (5%): R$', sindicato)\nprint('= Salário líquido: R$', bruto - ir - inss - sindicato)",
      cases: [
        {
          stdin: ["20", "160"],
          expect: [
            { label: "bruto", value: 3200 },
            { label: "ir|imposto", value: 352 },
            { label: "inss", value: 256 },
            { label: "sindicato", value: 160 },
            { label: "liquido", value: 2432 },
          ],
        },
        {
          stdin: ["12.5", "100"],
          expect: [
            { label: "bruto", value: 1250 },
            { label: "ir|imposto", value: 137.5 },
            { label: "inss", value: 100 },
            { label: "sindicato", value: 62.5 },
            { label: "liquido", value: 950 },
          ],
        },
      ],
      steps: [
        "Salário bruto = ganho por hora × horas.",
        "Cada desconto é uma porcentagem do bruto: 0.11, 0.08 e 0.05.",
        "Líquido = bruto - IR - INSS - sindicato.",
      ],
      notes:
        "Os rótulos podem ter texto em volta; o corretor procura o valor na mesma linha de cada rótulo.",
    },
    {
      id: "tintas",
      list: 2,
      letter: "7",
      title: "Loja de tintas",
      task: "Peça a área a pintar em m². Um litro de tinta cobre 3 m², e a tinta é vendida em latas de 18 litros que custam R$ 80,00. Só se vendem latas inteiras. Informe a quantidade de latas (por exemplo, “Latas: 2”) e o preço total (“Preço: R$ 160”).",
      topics: ["entrada e saída", "operadores", "lógica"],
      solution:
        "area = float(input('Área em m²: '))\nlitros = area / 3\nlatas = int(litros // 18)\nif litros % 18 != 0:\n    latas += 1\nprint('Latas:', latas)\nprint('Preço: R$', latas * 80)",
      cases: [
        {
          stdin: ["54"],
          expect: [
            { label: "lata", value: 1 },
            { label: "preço|total|valor|pagar|r$", value: 80 },
          ],
        },
        {
          stdin: ["100"],
          expect: [
            { label: "lata", value: 2 },
            { label: "preço|total|valor|pagar|r$", value: 160 },
          ],
        },
        {
          stdin: ["540"],
          expect: [
            { label: "lata", value: 10 },
            { label: "preço|total|valor|pagar|r$", value: 800 },
          ],
        },
        {
          stdin: ["541"],
          expect: [
            { label: "lata", value: 11 },
            { label: "preço|total|valor|pagar|r$", value: 880 },
          ],
        },
      ],
      steps: [
        "Litros = área / 3; latas = litros / 18.",
        "Sobrou um pedaço de lata? Arredonde para cima: 54 m² usam 1 lata, 541 m² usam 11.",
        "math.ceil faz o arredondamento para cima; também dá para usar // e %.",
      ],
      notes: "",
    },

    // ------------------------------------------------------------------ Lista 3
    {
      id: "nota_valida",
      list: 3,
      letter: "1",
      title: "Nota válida",
      task: "Peça uma nota entre zero e dez. Se o valor for inválido, mostre uma mensagem com a palavra “inválida” e continue pedindo até que o usuário informe um valor válido.",
      topics: ["entrada e saída", "while"],
      solution:
        "nota = float(input('Nota: '))\nwhile nota < 0 or nota > 10:\n    print('Nota inválida')\n    nota = float(input('Nota: '))\nprint('Nota registrada:', nota)",
      cases: [
        { stdin: ["11", "-1", "7"], expect: [INVALID] },
        { stdin: ["7"], expect: [], absent: [INVALID] },
        { stdin: ["10.5", "0"], expect: [INVALID] },
        { stdin: ["10"], expect: [], absent: [INVALID] },
      ],
      steps: [
        "Leia a nota uma vez antes do laço.",
        "Enquanto ela for menor que 0 ou maior que 10, mostre a mensagem e leia de novo.",
        "0 e 10 são válidos.",
      ],
      notes:
        "O corretor confere quantas vezes o programa pede a nota: cada caso tem exatamente as entradas necessárias.",
      quiz: [
        {
          q: "Com as entradas 11, -1 e 7, quantas vezes o programa pede a nota?",
          choices: ["3", "1", "2", "4"],
          answer: 0,
          explain:
            "11 e -1 são inválidas e fazem o programa pedir de novo; 7 é válida e encerra o laço.",
        },
      ],
    },
    {
      id: "usuario_senha",
      list: 3,
      letter: "2",
      title: "Senha diferente do usuário",
      task: "Leia um nome de usuário e uma senha. Se a senha for igual ao nome, mostre uma mensagem de erro (com a palavra “erro” ou “inválida”) e peça os dois de novo, até que sejam diferentes.",
      topics: ["entrada e saída", "while", "strings"],
      solution:
        "usuario = input('Usuário: ')\nsenha = input('Senha: ')\nwhile senha == usuario:\n    print('Erro: a senha não pode ser igual ao usuário')\n    usuario = input('Usuário: ')\n    senha = input('Senha: ')\nprint('Cadastro concluído')",
      cases: [
        { stdin: ["ana", "ana", "ana", "segredo"], expect: ["erro|inválid|invalid|igual"] },
        { stdin: ["bia", "1234"], expect: [], absent: ["erro|inválid|invalid"] },
        {
          stdin: ["joão", "joão", "maria", "maria", "maria", "x1"],
          expect: ["erro|inválid|invalid|igual"],
        },
      ],
      steps: [
        "Leia usuário e senha antes do laço.",
        "Enquanto forem iguais, mostre o erro e leia os dois de novo.",
        "Compare as strings com ==.",
      ],
      notes: "",
      quiz: [
        {
          q: "Com as entradas ana, ana, ana, segredo (usuário, senha, usuário, senha), quantas vezes o programa pede o usuário?",
          choices: ["2", "1", "3", "4"],
          answer: 0,
          explain: "A primeira dupla é ana/ana (igual, erro); a segunda é ana/segredo e encerra.",
        },
      ],
    },
    {
      id: "populacao",
      list: 3,
      letter: "3",
      title: "Crescimento de populações",
      task: "O país A tem 80000 habitantes e cresce 3% ao ano; o país B tem 200000 e cresce 1,5% ao ano. Calcule e escreva quantos anos são necessários para a população de A ultrapassar ou igualar a de B, mantidas as taxas.",
      topics: ["while", "operadores"],
      solution:
        "a = 80000\nb = 200000\nanos = 0\nwhile a < b:\n    a *= 1.03\n    b *= 1.015\n    anos += 1\nprint('Anos necessários:', anos)",
      cases: [{ expect: [63] }],
      steps: [
        "Repita enquanto A for menor que B.",
        "A cada ano: a = a * 1.03, b = b * 1.015 e anos += 1.",
      ],
      notes: "",
    },
    {
      id: "fibonacci",
      list: 3,
      letter: "4",
      title: "Número de Fibonacci",
      task: "Na sequência de Fibonacci (1, 1, 2, 3, 5, 8, 13, …), os dois primeiros elementos são 1 e cada um dos seguintes é a soma dos dois anteriores. Leia um inteiro n e mostre Fn: F1 = 1, F2 = 1, F3 = 2.",
      topics: ["while"],
      solution:
        "n = int(input('n: '))\na, b = 1, 1\nfor _ in range(n - 1):\n    a, b = b, a + b\nprint('F' + str(n), '=', a)",
      cases: [
        { stdin: ["2"], expect: [1] },
        { stdin: ["10"], expect: [55] },
        { stdin: ["20"], expect: [6765] },
        { stdin: ["3"], expect: [2] },
      ],
      steps: [
        "Guarde os dois últimos termos em duas variáveis, começando com 1 e 1.",
        "A cada passo, o par (a, b) vira (b, a + b).",
        "Confira: F10 = 55.",
      ],
      notes: "",
    },
    {
      id: "mdc",
      list: 3,
      letter: "5",
      title: "MDC pelo algoritmo de Euclides",
      task: "Dados dois inteiros positivos, calcule o máximo divisor comum entre eles usando o algoritmo de Euclides.",
      topics: ["while", "resto da divisão"],
      solution:
        "a = int(input('Primeiro número: '))\nb = int(input('Segundo número: '))\nwhile b != 0:\n    a, b = b, a % b\nprint('MDC:', a)",
      cases: [
        { stdin: ["12", "18"], expect: [6] },
        { stdin: ["17", "5"], expect: [1] },
        { stdin: ["100", "75"], expect: [25] },
        { stdin: ["48", "36"], expect: [12] },
      ],
      steps: [
        "Euclides: o MDC de a e b é o MDC de b e a % b.",
        "Repita até o segundo número virar 0; o MDC é o primeiro.",
      ],
      notes: "",
    },

    // ------------------------------------------------------------------ Lista 4
    {
      id: "maior_menor_sorteio",
      list: 4,
      letter: "1",
      title: "Maior e menor sorteados",
      task: "Sorteie 10 inteiros entre 1 e 100 para uma lista e descubra o maior e o menor valor, sem usar as funções max e min. Mostre “Maior: …” e “Menor: …”.",
      topics: ["listas", "for", "random"],
      solution:
        "from random import randint\nnumeros = []\nfor _ in range(10):\n    numeros.append(randint(1, 100))\nmaior = menor = numeros[0]\nfor n in numeros:\n    if n > maior:\n        maior = n\n    if n < menor:\n        menor = n\nprint(numeros)\nprint('Maior:', maior)\nprint('Menor:', menor)",
      cases: draws10.map((r) => ({
        random: r,
        expect: [
          { label: "maior", value: Math.max(...r) },
          { label: "menor", value: Math.min(...r) },
        ],
      })),
      rules: { noMaxMin: true },
      steps: [
        "Sorteie com randint(1, 100) dentro de um for de 10 voltas.",
        "Comece com maior = menor = primeiro elemento e compare com os demais.",
      ],
      notes: RANDOM_NOTE,
    },
    {
      id: "par_impar",
      list: 4,
      letter: "2",
      title: "Listas PAR e IMPAR",
      task: "Sorteie 20 inteiros entre 1 e 100 numa lista. Guarde os pares na lista PAR e os ímpares na lista IMPAR. Imprima as três listas.",
      topics: ["listas", "for", "random"],
      solution:
        "from random import randint\nnumeros = [randint(1, 100) for _ in range(20)]\nPAR = []\nIMPAR = []\nfor n in numeros:\n    if n % 2 == 0:\n        PAR.append(n)\n    else:\n        IMPAR.append(n)\nprint('Sorteados:', numeros)\nprint('PAR:', PAR)\nprint('IMPAR:', IMPAR)",
      cases: draws20.map((r) => ({
        random: r,
        expect: [{ list: r }, { list: evens(r) }, { list: odds(r) }],
      })),
      steps: [
        "Sorteie os 20 números primeiro.",
        "Percorra a lista e use n % 2 == 0 para decidir em qual lista colocar.",
        "Imprima as três listas com print.",
      ],
      notes: RANDOM_NOTE,
      quiz: [
        {
          q: "Se os sorteios fossem 7, 12, 9 e 4, como ficaria a lista PAR?",
          choices: ["[12, 4]", "[7, 9]", "[4, 12]", "[7, 12, 9, 4]"],
          answer: 0,
          explain: "Os pares entram na ordem em que aparecem: 12 e depois 4.",
        },
      ],
    },
    {
      id: "intercala",
      list: 4,
      letter: "3",
      title: "Vetores intercalados",
      task: "Crie dois vetores com 10 elementos aleatórios entre 1 e 100. Gere um terceiro vetor de 20 elementos com os elementos dos dois intercalados (o 1º do primeiro, o 1º do segundo, o 2º do primeiro…). Imprima os três vetores.",
      topics: ["listas", "for", "random"],
      solution:
        "from random import randint\na = [randint(1, 100) for _ in range(10)]\nb = [randint(1, 100) for _ in range(10)]\nc = []\nfor i in range(10):\n    c.append(a[i])\n    c.append(b[i])\nprint(a)\nprint(b)\nprint(c)",
      cases: vectors.map((r) => {
        const [a, b] = [r.slice(0, 10), r.slice(10)];
        // Quem sorteia os dois vetores no mesmo laço recebe os sorteios alternados.
        const [a2, b2] = [r.filter((_, i) => i % 2 === 0), r.filter((_, i) => i % 2 === 1)];
        return {
          random: r,
          expectAny: [
            [{ list: a }, { list: b }, { list: interleave(a, b) }],
            [{ list: a2 }, { list: b2 }, { list: interleave(a2, b2) }],
          ],
        };
      }),
      steps: [
        "Sorteie os dois vetores de 10 elementos.",
        "Para cada índice i de 0 a 9, acrescente a[i] e depois b[i] no terceiro vetor.",
      ],
      notes: RANDOM_NOTE,
      quiz: [
        {
          q: "Com A = [1, 2, 3] e B = [7, 8, 9], como fica o vetor intercalado?",
          choices: ["[1, 7, 2, 8, 3, 9]", "[1, 2, 3, 7, 8, 9]", "[7, 1, 8, 2, 9, 3]", "[1, 8, 3]"],
          answer: 0,
          explain: "Alterne: o primeiro de A, o primeiro de B, o segundo de A, o segundo de B…",
        },
      ],
    },
    {
      id: "palavras_python",
      list: 4,
      letter: "4",
      title: "Palavras com as letras de python",
      task: "Use o statement sobre diversidade da Python Software Foundation (já está no editor). Gere a lista de palavras com split(), remova os caracteres especiais, passe tudo para minúsculas e crie uma lista com as palavras que começam ou terminam com uma das letras de “python”. Imprima a lista resultante.",
      topics: ["listas", "strings", "split e join"],
      starter: `texto = """${statement}"""\n`,
      solution: `texto = """${statement}"""\npalavras = []\nfor palavra in texto.lower().split():\n    limpa = ''.join(c for c in palavra if c.isalpha())\n    if limpa[0] in 'python' or limpa[-1] in 'python':\n        palavras.append(limpa)\nprint(palavras)`,
      cases: [{ expectAny: [[{ list: startsOrEnds }], [{ list: unique(startsOrEnds) }]] }],
      steps: [
        "split() separa por espaços; a pontuação continua grudada (everyone., diverse:).",
        "Remova o que não for letra e use lower() antes de comparar.",
        "Teste a primeira letra (palavra[0]) e a última (palavra[-1]) com in 'python'.",
      ],
      notes: "Palavras repetidas podem ficar ou sair da lista; o corretor aceita as duas formas.",
      quiz: [
        {
          q: "Qual destas palavras do texto NÃO entra na lista?",
          choices: ["and", "the", "you", "help"],
          answer: 0,
          explain: "and começa com a e termina com d; nenhuma das duas letras está em python.",
        },
      ],
    },
    {
      id: "conta_palavras",
      list: 4,
      letter: "5",
      title: "Palavras longas com letras de python",
      task: "Com o mesmo texto (já está no editor), em minúsculas e sem caracteres especiais, calcule quantas palavras têm pelo menos uma das letras de “python” e mais de 4 caracteres. Imprima a quantidade.",
      topics: ["listas", "strings", "split e join"],
      starter: `texto = """${statement}"""\n`,
      solution: `texto = """${statement}"""\nconta = 0\nfor palavra in texto.lower().split():\n    limpa = ''.join(c for c in palavra if c.isalpha())\n    if len(limpa) > 4 and any(letra in limpa for letra in 'python'):\n        conta += 1\nprint('Quantidade:', conta)`,
      cases: [{ expectAny: [[longWithLetter.length], [unique(longWithLetter).length]] }],
      steps: [
        "Limpe as palavras como no exercício anterior.",
        "Mais de 4 caracteres: len(palavra) > 4.",
        "Para ter uma das letras, teste cada letra de 'python' com in.",
      ],
      notes: "Contar palavras repetidas uma vez só também é aceito.",
    },

    // ------------------------------------------------------------------ Lista 5
    {
      id: "pseudo_soma",
      list: 5,
      letter: "A",
      title: "Pseudocódigo: x + y",
      task: "Prova do Google Developer Day 2010. Traduza o pseudocódigo para Python e imprima o que ele imprime:\nx = 2\ny = 5\nse y > 8 então\n    y = y * 2\ncaso contrário,\n    x = x * 2\nimprime (x + y)",
      topics: ["testes de mesa", "lógica"],
      solution: "x = 2\ny = 5\nif y > 8:\n    y = y * 2\nelse:\n    x = x * 2\nprint(x + y)",
      cases: [{ expect: [9] }],
      steps: ["y > 8 é falso para y = 5, então só x dobra.", "x + y = 4 + 5."],
      notes: ANSWER_NOTE,
    },
    {
      id: "pseudo_oi",
      list: 5,
      letter: "B",
      title: "Pseudocódigo: quantos 'oi'",
      task: "Quantas vezes o pseudocódigo imprime 'oi'? O laço inclui os extremos (1 até 4 é 1, 2, 3, 4). Escreva um programa que conte e imprima a quantidade.\npara i = 1 até 9\n    se i != 3, então\n        para j = 1 até 6\n            imprime 'oi'",
      topics: ["testes de mesa", "for"],
      solution:
        "conta = 0\nfor i in range(1, 10):\n    if i != 3:\n        for j in range(1, 7):\n            conta += 1\nprint(conta)",
      cases: [{ expect: [48] }],
      steps: [
        "1 até 9 em Python é range(1, 10).",
        "Conte em vez de imprimir 'oi': o laço de dentro roda 6 vezes para cada i diferente de 3.",
      ],
      notes: ANSWER_NOTE,
    },
    {
      id: "pares_div7",
      list: 5,
      letter: "C",
      title: "Pares divisíveis por 7",
      task: "Entre 1067 e 3627 (inclusive), quantos números são pares e também divisíveis por 7? Imprima a quantidade.",
      topics: ["testes de mesa", "for", "resto da divisão"],
      solution:
        "conta = 0\nfor n in range(1067, 3628):\n    if n % 2 == 0 and n % 7 == 0:\n        conta += 1\nprint(conta)",
      cases: [{ expect: [183] }],
      steps: ["Inclusive: range(1067, 3628).", "Par e divisível por 7: n % 2 == 0 and n % 7 == 0."],
      notes: ANSWER_NOTE,
    },
    {
      id: "sortudos",
      list: 5,
      letter: "D",
      title: "Números sortudos da Daniela",
      task: "Para Daniela, um número é sortudo se contém o dígito 2 mas não o dígito 7. Quantos números sortudos existem entre 18644 e 33087, incluindo os extremos? Imprima a quantidade.",
      topics: ["testes de mesa", "for", "strings"],
      solution:
        "conta = 0\nfor n in range(18644, 33088):\n    texto = str(n)\n    if '2' in texto and '7' not in texto:\n        conta += 1\nprint(conta)",
      cases: [{ expect: [7995] }],
      steps: [
        "Transforme o número em texto com str() para procurar dígitos com in.",
        "Contém 2 e não contém 7: '2' in s and '7' not in s.",
      ],
      notes: ANSWER_NOTE,
    },
    {
      id: "telefones",
      list: 5,
      letter: "E",
      title: "Telefones de Ponteironuloville",
      task: "Em Ponteironuloville, todo telefone tem 6 dígitos. Um número é válido se: não tem dois dígitos consecutivos iguais; a soma dos dígitos é par; e o último dígito é diferente do primeiro. Quantos telefones da lista (já está no editor) são válidos? Imprima a quantidade.",
      topics: ["testes de mesa", "for", "strings"],
      starter: `telefones = """\n${phones}\n""".split()\n`,
      solution: `telefones = """\n${phones}\n""".split()\nvalidos = 0\nfor t in telefones:\n    sem_repetir = all(t[i] != t[i + 1] for i in range(5))\n    soma_par = sum(int(d) for d in t) % 2 == 0\n    if sem_repetir and soma_par and t[0] != t[-1]:\n        validos += 1\nprint(validos)`,
      cases: [{ expect: [39] }],
      steps: [
        "Cada telefone é uma string de 6 caracteres; t[i] e t[i + 1] são dígitos vizinhos.",
        "Some os dígitos convertendo cada um com int().",
        "Conte só os que passam nas três regras.",
      ],
      notes: ANSWER_NOTE,
    },
  ];
})();
