"use strict";
// Catálogo em pastas (uma por lista recebida, mais ENADE e provas) com busca e filtro por tema.

let folder = "";

let filters = { search: "", topic: "" };

function catalog() {
  const folders = [...SUPPLIED_LIST_NUMBERS, "enade", "provas"];
  const title =
    folder === "enade"
      ? "ENADE · questões indicadas"
      : folder === "provas"
        ? "Provas"
        : folder
          ? `Lista ${folder}`
          : "Catálogo em pastas";
  return (
    heading(
      "BIBLIOTECA DE TREINO",
      title,
      "Escolha uma pasta. Todos os treinos disponíveis ficam liberados, sem ordem obrigatória.",
    ) +
    `<div class="notice">Listas recebidas, uma por pasta: ${SUPPLIED_LIST_NUMBERS.join(", ")} (o material não tem lista 8). Os ${LIST_ITEMS.length} exercícios enviados estão disponíveis; nas listas 1 a 5, você escreve programas completos com input() e print(). Ajustes em comentários ou soluções inconsistentes são explicados nos respectivos enunciados. A conferência das referências ENADE continua indicada separadamente.</div><div class="folder-grid" aria-label="Pastas de exercícios">${folders
      .map((f) => {
        const count = EXERCISES.filter((e) => (inCatalogFolder(e, f))).length;
        return `<button class="folder ${folder === String(f) ? "selected" : ""}" data-folder="${f}" aria-pressed="${folder === String(f)}"><span aria-hidden="true">${icon("folder")}</span><strong>${f === "enade" ? "ENADE" : f === "provas" ? "Provas" : `Lista ${f}`}</strong><small>${count} exercícios disponíveis${f === "enade" ? " · 6 referências" : f === "provas" ? " · P0, P1 e P2 · 14 PDFs" : ""}</small></button>`;
      })
      .join("")}</div>${
      folder
        ? `<div class="row margin"><h2>${folder === "enade" ? "Treinos de preparação" : folder === "provas" ? "Provas anteriores · DSM" : `Exercícios disponíveis · lista ${folder}`}</h2><button data-folder="">Ver todas as pastas</button></div>${listVideos(folder)}${folder === "provas" ? pastExamDownloads() : ""}<section class="filters"><label>Buscar nesta pasta<input id="search" type="search" value="${esc(filters.search)}" placeholder="Título ou tema…"></label><label>Tema<select id="topic"><option value="">Todos</option>${[
            ...new Set(EXERCISES.flatMap((e) => e.topics)),
          ]
            .sort()
            .map((t) => `<option ${filters.topic === t ? "selected" : ""}>${esc(t)}</option>`)
            .join(
              "",
            )}</select></label><button data-action="clear-filters">Limpar busca</button></section><div id="results">${catalogResults()}</div>${folder === "enade" ? `<h2 class="margin">As seis referências indicadas</h2><div class="grid">${REFERENCES.map((r) => `<article class="card"><span class="tag ${r.verified ? "" : "warm"}">${esc(r.status)}</span><h3>${esc(r.name)}</h3><p>${esc(r.text)}</p>${r.exercise ? `<button data-code="${r.exercise}">Escrever código · adaptação</button>` : "<p>Enunciado pendente: ainda não há exercício completo para responder.</p>"}${r.url ? `<a href="${r.url}" target="_blank" rel="noopener noreferrer">Consultar fonte (pode conter gabarito) ${icon("external-link")}</a>` : ""}</article>`).join("")}</div>` : ""}`
        : '<div class="empty margin">Abra uma pasta acima para encontrar os exercícios.</div>'
    }`
  );
}

function inCatalogFolder(exercise, key) {
  if (key === "enade") return exercise.enade;
  if (key === "provas") return Boolean(exercise.exam);
  return !key || exercise.list === Number(key);
}

function catalogResults() {
  const items = EXERCISES.filter(
    (e) =>
      inCatalogFolder(e, folder) &&
      (!filters.topic || e.topics.includes(filters.topic)) &&
      (!filters.search ||
        (e.title + " " + e.summary + " " + e.topics.join(" ") + (e.exam ? " " + e.ref : ""))
          .toLocaleLowerCase("pt-BR")
          .includes(filters.search.toLocaleLowerCase("pt-BR"))),
  ).sort((a, b) => (a.letter || "").localeCompare(b.letter || "", "pt-BR", { numeric: true }));
  if (folder === "provas" && items.length) {
    return ["p0", "p1", "p2"].map((exam) => {
      const questions = items.filter((item) => item.exam === exam);
      return questions.length ? `<h3 class="margin">${exam.toUpperCase()}</h3><div class="grid three">${questions.map(card).join("")}</div>` : "";
    }).join("");
  }
  return `<p class="muted">${items.length} exercícios disponíveis · todos liberados</p><div class="grid three">${items.map(card).join("")}</div>${items.length ? "" : '<div class="empty">Nenhum exercício com esses filtros. Limpe a busca ou escolha outro tema.</div>'}`;
}

function pastExamDownloads() {
  return (
    '<section class="panel margin" aria-label="Provas completas em PDF"><h2>Provas completas em PDF</h2><p>Material compartilhado pelo professor Massanori para estudo. Abra uma prova para consultar o arquivo original.</p>' +
    ["P0", "P1", "P2", "Sub"]
      .map((exam) => {
        const files = PAST_EXAM_PDFS.filter((pdf) => pdf.exam === exam);
        return files.length
          ? `<h3 class="margin">${exam}</h3><div class="grid three">${files
              .map(
                (pdf) =>
                  `<article class="card"><h3>${esc(pdf.title)}</h3><a href="${esc(pdf.path)}" target="_blank" rel="noopener noreferrer">Abrir prova em PDF ${icon("external-link")}</a></article>`,
              )
              .join("")}</div>`
          : "";
      })
      .join("") +
    "</section>"
  );
}

// Aulas do professor para a lista aberta. As de dicas/resolução só aparecem como link depois que
// o aluno enviar uma tentativa em algum exercício da lista, como acontece com as soluções.
function listVideos(folder) {
  const videos = LIST_VIDEOS[folder];
  if (!videos) return "";
  const n = Number(folder);
  const tried = state.attempts.some((a) => byId(a.id)?.list === n);
  const after = tried
    ? videos.depois.map(videoLink).join("")
    : videos.depois.map(lockedVideo).join("") +
      `<p class="muted">Libera depois que você enviar uma tentativa em qualquer exercício da lista ${n}.</p>`;
  return `<section class="panel margin videos" aria-label="Aulas do professor"><div class="row"><h2>Aulas do professor Massanori</h2><small>Python para Zumbis · abrem no YouTube</small></div><h3>Assista antes</h3><div class="video-grid" data-videos="antes">${videos.antes.map(videoLink).join("")}</div><h3 class="margin">Depois da tentativa · dicas e resolução</h3><div class="video-grid" data-videos="depois">${after}</div></section>`;
}

function videoLink(code) {
  const v = VIDEOS[code];
  return `<a class="video-card" href="https://www.youtube.com/watch?v=${v.youtube}" target="_blank" rel="noopener noreferrer"><span class="video-icon" aria-hidden="true">${icon("play")}</span><span><b>${code}</b> ${esc(v.title)}</span><span class="sr"> (abre no YouTube)</span></a>`;
}

function lockedVideo(code) {
  return `<div class="video-card locked"><span class="video-icon" aria-hidden="true">${icon("lock")}</span><span><b>${code}</b> ${esc(VIDEOS[code].title)}</span></div>`;
}
