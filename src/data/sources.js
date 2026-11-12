"use strict";
// Links das provas ENADE no INEP e referências indicadas.
const SOURCES = {
  alturas:
    "https://download.inep.gov.br/enade/padrao_resposta/2021_tecnologia_em_analise_e_desenvolvimento_de_sistemas.pdf",
  arroz:
    "https://download.inep.gov.br/educacao_superior/enade/provas/2011/ANALISE_E_DESENVOLVIMENTO_DE_SISTEMAS.pdf",
  matriz2014:
    "https://download.inep.gov.br/educacao_superior/enade/provas/2014/40_tecnologia_analise_desenv_sistemas.pdf",
};

const REFERENCES = [
  {
    name: "2008 · Discursiva 40",
    status: "Não verificada",
    text: "Matrizes, segundo o que foi dito em aula. O treino disponível é autoral; enunciado e algoritmo originais pendentes.",
    exercise: "matriz",
  },
  {
    name: "2011 · Discursiva 4",
    status: "Não verificada",
    text: "Indicada em aula. Tema e enunciado ainda não conferidos.",
  },
  {
    name: "2011 · Discursiva 5",
    status: "Enunciado conferido",
    verified: true,
    text: "Conferida no PDF oficial: grãos de trigo num tabuleiro 4 × 4 com as casas numeradas de 1 a 16, linha por linha; 1 grão na primeira casa, dobrando até a última. Pede os grãos de cada casa, guardados numa estrutura, e o total. O treino do site segue esse enunciado. Anunciada pelo professor em aula.",
    url: SOURCES.arroz,
    exercise: "arroz",
  },
  {
    name: "2014 · Discursiva 5",
    status: "Conferência parcial",
    text: "PDF oficial localizado. A questão não foi transcrita nem incorporada ao treino; conferência integral pendente.",
    url: SOURCES.matriz2014,
  },
  {
    name: "2017 · Discursiva 3",
    status: "Não verificada",
    text: "Indicada em aula. Tema e enunciado ainda não conferidos.",
  },
  {
    name: "2021 · Discursiva 3",
    status: "Tema verificado",
    verified: true,
    text: "Padrão oficial confirma análise das alturas de 1.000 pessoas. Os exercícios objetivos do site são adaptações autorais. Anunciada pelo professor em aula.",
    url: SOURCES.alturas,
    exercise: "alturas",
  },
];
