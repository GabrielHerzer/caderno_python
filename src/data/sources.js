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
    text: "Matrizes, conforme relato. O treino disponível é autoral; enunciado e algoritmo originais pendentes.",
    exercise: "matriz",
  },
  {
    name: "2011 · Discursiva 4",
    status: "Não verificada",
    text: "Indicada na conversa. Tema e enunciado ainda não conferidos.",
  },
  {
    name: "2011 · Discursiva 5",
    status: "Verificação pendente",
    text: "Grãos no tabuleiro 4 × 4, conforme relato. Link oficial recuperado, mas o PDF não abriu na conferência desta sessão. Anunciada verbalmente segundo seu relato.",
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
    text: "Indicada na conversa. Tema e enunciado ainda não conferidos.",
  },
  {
    name: "2021 · Discursiva 3",
    status: "Tema verificado",
    text: "Padrão oficial confirma análise das alturas de 1.000 pessoas. Os exercícios objetivos do site são adaptações autorais. Anunciada verbalmente segundo seu relato.",
    url: SOURCES.alturas,
    exercise: "alturas",
  },
];
