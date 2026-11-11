"use strict";
// Página Listas e fontes: origem dos exercícios e referências ENADE.

function sources() {
  return (
    heading(
      "MATERIAIS E CONFERÊNCIA",
      "Listas recebidas e referências",
      "Cada pasta do catálogo corresponde a uma lista enviada: programas do Python para Zumbis nas listas 1 a 5, CodingBat nas listas 6, 7, 9 e 10 e Google’s Python Class nas listas 11 a 14.",
    ) +
    `<section class="panel"><h2>${LIST_ITEMS.length} exercícios das listas ${SUPPLIED_LIST_RANGE}</h2><div class="table-wrap"><table><thead><tr><th>Lista</th><th>Quantidade</th><th>Exercícios recebidos</th></tr></thead><tbody>${SUPPLIED_LIST_NUMBERS.map(
      (n) => {
        const rows = LIST_ITEMS.filter((s) => s.list === n);
        return `<tr><td>Lista ${n}</td><td>${rows.length}</td><td>${rows.map((s) => `${s.letter}. ${esc(s.name)}`).join(" · ")}</td></tr>`;
      },
    ).join(
      "",
    )}</tbody></table></div><p class="margin">Todos os testes fornecidos foram incorporados. Acrescentamos casos de borda, preservando tuplas e inteiros grandes sem perda de precisão. Treinos autorais anteriores continuam no painel e na revisão, fora das pastas das listas.</p><p>Listas 1 a 5: PDFs do curso Python para Zumbis, do professor Fernando Massanori; a lista 5 é a prova do Google Developer Day 2010 que o curso usa. Listas 6, 7, 9 e 10: arquivos enviados, atribuídos a Nick Parlante / CodingBat. Listas 11–14: trechos enviados da Google’s Python Class, Copyright 2010 Google Inc., Apache License 2.0. <a href="fontes/LICENSE-2.0.txt" target="_blank">Ler licença incluída</a>.</p></section><h2 class="margin">Ajustes explicados, sem esconder divergências</h2><div class="grid">${LIST_ITEMS.filter(
      (s) => s.notes,
    )
      .map(
        (s) =>
          `<article class="card"><h3>Lista ${s.list} · ${s.letter} · ${esc(s.name)}</h3><p>${esc(s.notes)}</p><button data-code="${s.id}">Abrir exercício</button></article>`,
      )
      .join(
        "",
      )}</div><section class="panel margin"><h2>Como as restrições são verificadas</h2><p>Anagrama e fila de tijolos: o corretor identifica for, while e compreensões na estrutura do código, ignorando comentários e strings. Soma invertida: detecta int/pow/eval/exec e usos comuns de potências ou multiplicações por 10 que reconstruiriam o número. Essa checagem didática não prova a abordagem de todo programa possível; os testes também verificam o comportamento, incluindo transporte em cascata.</p><p>Soluções só aparecem por pedido explícito após a tentativa. A correção não é uma conversa com IA e não comprova correção para todas as entradas possíveis.</p></section><h2 class="margin">ENADE · seis referências indicadas</h2><div class="grid">${REFERENCES.map((r) => `<article class="card"><span class="tag warm">${esc(r.status)}</span><h3>${esc(r.name)}</h3><p>${esc(r.text)}</p>${r.url ? `<a href="${r.url}" target="_blank" rel="noopener noreferrer">Consultar referência (pode conter gabarito) ↗</a>` : ""}${r.exercise ? `<button data-code="${r.exercise}">Praticar adaptação</button>` : ""}</article>`).join("")}</div><div class="notice">Receber as listas não altera a verificação das fontes ENADE. As quatro questões prioritárias continuam marcadas com alta probabilidade segundo seu relato, nunca como garantidas na prova real.</div>`
  );
}
