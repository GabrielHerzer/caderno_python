"use strict";
// Catálogo em pastas (listas 10–14 e ENADE) com busca e filtro por tema.

let folder = "";

let filters = { search: "", topic: "" };

function catalog() {
  const folders = [10, 11, 12, 13, 14, "enade"];
  const title =
    folder === "enade"
      ? "ENADE · questões indicadas"
      : folder
        ? `Lista ${folder}`
        : "Catálogo em pastas";
  return (
    heading(
      "BIBLIOTECA DE TREINO",
      title,
      "Escolha uma pasta. Todos os treinos disponíveis ficam liberados, sem ordem obrigatória.",
    ) +
    `<div class="notice">Listas recebidas e organizadas na ordem confirmada: 10, 11, 12, 13 e 14. Os 33 exercícios enviados estão disponíveis. Ajustes em comentários ou soluções inconsistentes são explicados nos respectivos enunciados. A conferência das referências ENADE continua indicada separadamente.</div><div class="folder-grid" aria-label="Pastas de exercícios">${folders
      .map((f) => {
        const count = EXERCISES.filter((e) => (f === "enade" ? e.enade : e.list === f)).length;
        return `<button class="folder ${folder === String(f) ? "selected" : ""}" data-folder="${f}" aria-pressed="${folder === String(f)}"><span aria-hidden="true">▰</span><strong>${f === "enade" ? "ENADE" : `Lista ${f}`}</strong><small>${count} exercícios disponíveis${f === "enade" ? " · 6 referências" : ""}</small></button>`;
      })
      .join("")}</div>${
      folder
        ? `<div class="row margin"><h2>${folder === "enade" ? "Treinos de preparação" : `Exercícios disponíveis · lista ${folder}`}</h2><button data-folder="">Ver todas as pastas</button></div><section class="filters"><label>Buscar nesta pasta<input id="search" type="search" value="${esc(filters.search)}" placeholder="Título ou tema…"></label><label>Tema<select id="topic"><option value="">Todos</option>${[
            ...new Set(EXERCISES.flatMap((e) => e.topics)),
          ]
            .sort()
            .map((t) => `<option ${filters.topic === t ? "selected" : ""}>${esc(t)}</option>`)
            .join(
              "",
            )}</select></label><button data-action="clear-filters">Limpar busca</button></section><div id="results">${catalogResults()}</div>${folder === "enade" ? `<h2 class="margin">As seis referências indicadas</h2><div class="grid">${REFERENCES.map((r) => `<article class="card"><span class="tag warm">${esc(r.status)}</span><h3>${esc(r.name)}</h3><p>${esc(r.text)}</p>${r.exercise ? `<button data-code="${r.exercise}">Escrever código · adaptação</button>` : "<p>Enunciado pendente: ainda não há exercício completo para responder.</p>"}${r.url ? `<a href="${r.url}" target="_blank" rel="noopener noreferrer">Consultar fonte (pode conter gabarito) ↗</a>` : ""}</article>`).join("")}</div>` : ""}`
        : '<div class="empty margin">Abra uma pasta acima para encontrar os exercícios. A lista 9 não faz parte deste catálogo.</div>'
    }`
  );
}

function catalogResults() {
  const items = EXERCISES.filter(
    (e) =>
      (folder === "enade" ? e.enade : !folder || e.list === Number(folder)) &&
      (!filters.topic || e.topics.includes(filters.topic)) &&
      (!filters.search ||
        (e.title + " " + e.summary + " " + e.topics.join(" "))
          .toLocaleLowerCase("pt-BR")
          .includes(filters.search.toLocaleLowerCase("pt-BR"))),
  ).sort((a, b) => (a.letter || "").localeCompare(b.letter || ""));
  return `<p class="muted">${items.length} exercícios disponíveis · todos liberados</p><div class="grid three">${items.map(card).join("")}</div>${items.length ? "" : '<div class="empty">Nenhum exercício com esses filtros. Limpe a busca ou escolha outro tema.</div>'}`;
}
