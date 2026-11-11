let folder = "",
  lessonTopic = "",
  historyAll = false;
const oldDashboard = dashboard,
  oldHistory = history,
  oldBind = bind,
  oldAction = action;
dashboard = function () {
  const html = oldDashboard();
  return html.replace(
    '<div class="split">',
    `<section class="panel margin"><div class="row"><div><span class="kicker">REVISÃO DO QUE VOCÊ VIU AGORA</span><h2>Métodos de strings e lógica, na prática</h2></div><a href="#revisao">Revisar a sintaxe →</a></div><div class="grid three">${["ends", "replace", "slice", "logica", "mesa_for", "mesa_while"].map((id) => card(byId(id))).join("")}</div></section><div class="split margin">`,
  );
};
catalog = function () {
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
};
catalogResults = function () {
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
};
review = function () {
  const map = topicStats(),
    lesson = LESSONS.find((l) => l.topic === lessonTopic);
  return (
    heading(
      "REVISÃO ADAPTATIVA POR TEMA",
      "Entenda a regra. Depois pratique.",
      "Sintaxe, exemplos, armadilhas e exercícios escolhidos a partir do seu desempenho.",
    ) +
    `<div class="row"><p class="muted">Os temas com menor taxa de acerto sem ajuda aparecem primeiro; temas ainda não praticados entram como diagnóstico.</p><button class="primary" data-topic-cycle="">Ciclo geral de revisão</button></div><div class="topic-grid">${[
      ...LESSONS,
    ]
      .sort(
        (a, b) =>
          (map.find((t) => t.topic === a.topic)?.rate ?? -1) -
          (map.find((t) => t.topic === b.topic)?.rate ?? -1),
      )
      .map((l) => {
        const t = map.find((t) => t.topic === l.topic);
        return `<button class="topic-card ${l.topic === lessonTopic ? "selected" : ""}" data-lesson="${esc(l.topic)}" aria-pressed="${l.topic === lessonTopic}"><strong>${esc(l.topic)}</strong><small>${t?.n ? `${t.rate}% sem ajuda · ${t.n} tentativas` : "Ainda sem diagnóstico"}</small></button>`;
      })
      .join("")}</div>${
      lesson
        ? `<article class="panel margin lesson"><span class="kicker">GUIA DE REVISÃO</span><h2>${esc(lesson.title)}</h2><p>${esc(lesson.description)}</p><div class="grid"><section><h3>Sintaxe</h3><pre>${esc(lesson.syntax)}</pre></section><section><h3>Exemplo comentado</h3><pre>${esc(lesson.example)}</pre></section></div><h3>Como raciocinar</h3><ol>${lesson.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><div class="notice"><b>Armadilha comum:</b> ${esc(lesson.pitfall)}</div><p><b>Pense antes de avançar:</b> ${esc(lesson.check)}</p><button class="primary" data-topic-cycle="${esc(lesson.topic)}">Treinar este tema →</button><h3 class="margin">Exercícios relacionados, na sua ordem de revisão</h3><div class="grid">${lesson.ids
            .map(byId)
            .sort((a, b) => weakness(b) - weakness(a))
            .map(card)
            .join("")}</div></article>`
        : '<div class="empty margin">Escolha um tema para abrir a explicação completa. Comece por endswith, replace, for ou while.</div>'
    }<div class="notice">A revisão usa os últimos cinco resultados por exercício; o mapa usa as últimas 20 tentativas por tema. Acertos com ajuda indicam domínio parcial. O ciclo geral sempre inclui as quatro questões anunciadas; o ciclo de um tema concentra-se nos exercícios relacionados.</div>`
  );
};
function topicCycle(topic) {
  if (!topic) {
    cycle = null;
    startCycle();
    return;
  }
  const lesson = LESSONS.find((l) => l.topic === topic);
  const items = (
    lesson ? lesson.ids.map(byId) : EXERCISES.filter((e) => e.topics.includes(topic))
  ).sort(
    (a, b) =>
      weakness(b) - weakness(a) || (stats(a.id).last?.time || 0) - (stats(b.id).last?.time || 0),
  );
  if (!items.length) return;
  cycle = { queue: items.map((e) => e.id), index: 0, repeated: [], topic };
  startPractice(cycle.queue[0], true);
}
history = function () {
  const completed = state.exams,
    latest = completed.at(-1),
    best = completed.reduce((a, b) => (!a || b.score / b.total > a.score / a.total ? b : a), null);
  const exams = `<section class="stats"><div class="stat"><small>Simulados concluídos</small><strong>${completed.length}</strong></div><div class="stat"><small>Último simulado</small><strong>${latest ? `${latest.score}/${latest.total}` : "—"}</strong></div><div class="stat"><small>Melhor proporção de acertos</small><strong>${best ? `${best.score}/${best.total}` : "—"}</strong></div><div class="stat"><small>Exercícios respondidos</small><strong>${state.attempts.length}</strong></div></section><section class="panel"><h2>Resultados · simulado Massanori</h2>${
    completed.length
      ? `<div class="table-wrap"><table><thead><tr><th>Data</th><th>Acertos</th><th>Formato</th><th>Revisão</th></tr></thead><tbody>${completed
          .map((x, i) => ({ x, i }))
          .reverse()
          .map(
            ({ x, i }) =>
              `<tr><td>${new Date(x.time).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</td><td><strong>${x.score}/${x.total}</strong> · ${Math.round((x.score / x.total) * 100)}%</td><td>${x.format === "codigo-v4" ? "8 questões fixas" : x.format === "codigo-v3" ? "5 funções + 2 testes de mesa" : "Objetivo · versão anterior"}</td><td>${validStoredExam(x) ? `<button data-exam-history="${i}">Ver correção</button>` : "Resultado preservado"}</td></tr>`,
          )
          .join("")}</tbody></table></div>`
      : '<p class="muted">Seus acertos aparecerão aqui depois do primeiro simulado finalizado.</p>'
  }</section><h2 class="margin">${historyAll ? "Todas as tentativas" : "Últimos exercícios feitos"}</h2><button id="history-toggle">${historyAll ? "Mostrar só os 20 últimos" : "Ver histórico completo"}</button>`;
  const original = oldHistory();
  const marker = '<div class="actions">';
  const pos = original.indexOf(marker);
  let tail = original.slice(pos);
  if (!historyAll && state.attempts.length > 20) {
    const start = tail.indexOf("<tbody>") + 7,
      end = tail.indexOf("</tbody>", start);
    const rows = tail
      .slice(start, end)
      .split("</tr>")
      .filter(Boolean)
      .slice(0, 20)
      .map((r) => r + "</tr>")
      .join("");
    tail = tail.slice(0, start) + rows + tail.slice(end);
  }
  return (
    heading(
      "SEU PERCURSO",
      "Meu histórico",
      "Veja os exercícios mais recentes e a quantidade de acertos em cada simulado.",
    ) +
    exams +
    tail
  );
};
bind = function () {
  oldBind();
  document.querySelectorAll("[data-folder]").forEach(
    (b) =>
      (b.onclick = () => {
        folder = b.dataset.folder;
        filters.search = "";
        filters.topic = "";
        render();
      }),
  );
  document.querySelectorAll("[data-lesson]").forEach(
    (b) =>
      (b.onclick = () => {
        lessonTopic = b.dataset.lesson;
        render();
        document.querySelector(".lesson")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }),
  );
  document
    .querySelectorAll("[data-topic-cycle]")
    .forEach((b) => (b.onclick = () => topicCycle(b.dataset.topicCycle)));
  if ($("#history-toggle"))
    $("#history-toggle").onclick = () => {
      historyAll = !historyAll;
      render();
    };
  document.querySelectorAll("[data-exam-history]").forEach(
    (b) =>
      (b.onclick = () => {
        const stored = state.exams[Number(b.dataset.examHistory)];
        if (validStoredExam(stored)) {
          exam = JSON.parse(JSON.stringify(stored.detail));
          go("simulado");
        }
      }),
  );
  bindExam();
};
action = function (name) {
  if (name === "refresh-exam") {
    if (examGrading) return;
    if (
      exam &&
      !exam.finished &&
      Object.values(exam.answers).some((a) => a.trim()) &&
      !confirm(
        "Reiniciar as questões deste simulado? As respostas desta rodada serão descartadas, sem correção ou nota. Seu histórico de simulados concluídos será preservado.",
      )
    )
      return;
    startExam();
    return;
  }
  if (
    (name === "exam-prev" || name === "exam-next") &&
    ["codigo-v3", "codigo-v4"].includes(exam?.format)
  ) {
    if (examGrading) return;
    exam.index = Math.max(
      0,
      Math.min(exam.items.length - 1, exam.index + (name === "exam-next" ? 1 : -1)),
    );
    persistExam();
    render();
    return;
  }
  if (name === "new-exam") {
    if (examGrading) return;
    exam = null;
    save();
    render();
    return;
  }
  if (name === "clear-filters") {
    filters.search = "";
    filters.topic = "";
    render();
    return;
  }
  if (name === "reset" && examGrading) {
    toast("Aguarde ou cancele a correção antes de apagar o histórico.");
    return;
  }
  oldAction(name);
};
sources = function () {
  return (
    heading(
      "MATERIAIS E CONFERÊNCIA",
      "Listas recebidas e referências",
      "As pastas agora correspondem aos cinco blocos enviados, na ordem que você confirmou.",
    ) +
    `<section class="panel"><h2>33 exercícios das listas 10–14</h2><div class="table-wrap"><table><thead><tr><th>Lista</th><th>Quantidade</th><th>Exercícios recebidos</th></tr></thead><tbody>${[
      10, 11, 12, 13, 14,
    ]
      .map((n) => {
        const rows = SUPPLIED_LISTS.filter((s) => s.list === n);
        return `<tr><td>Lista ${n}</td><td>${rows.length}</td><td>${rows.map((s) => `${s.letter}. ${esc(s.fn)}`).join(" · ")}</td></tr>`;
      })
      .join(
        "",
      )}</tbody></table></div><p class="margin">Todos os testes fornecidos foram incorporados. Acrescentamos casos de borda, preservando tuplas e inteiros grandes sem perda de precisão. Treinos autorais anteriores continuam no painel e na revisão, fora das pastas das listas.</p><p>Lista 10: arquivo enviado, atribuído a Nick Parlante / CodingBat. Listas 11–14: trechos enviados da Google’s Python Class, Copyright 2010 Google Inc., Apache License 2.0. <a href="fontes/LICENSE-2.0.txt" target="_blank">Ler licença incluída</a>.</p></section><h2 class="margin">Ajustes explicados, sem esconder divergências</h2><div class="grid">${SUPPLIED_LISTS.filter(
      (s) => s.notes,
    )
      .map(
        (s) =>
          `<article class="card"><h3>Lista ${s.list} · ${s.letter} · ${esc(s.fn)}</h3><p>${esc(s.notes)}</p><button data-code="${s.id}">Abrir exercício</button></article>`,
      )
      .join(
        "",
      )}</div><section class="panel margin"><h2>Como as restrições são verificadas</h2><p>Anagrama e fila de tijolos: o corretor identifica for, while e compreensões na estrutura do código, ignorando comentários e strings. Soma invertida: detecta int/pow/eval/exec e usos comuns de potências ou multiplicações por 10 que reconstruiriam o número. Essa checagem didática não prova a abordagem de todo programa possível; os testes também verificam o comportamento, incluindo transporte em cascata.</p><p>Soluções só aparecem por pedido explícito após a tentativa. A correção não é uma conversa com IA e não comprova correção para todas as entradas possíveis.</p></section><h2 class="margin">ENADE · seis referências indicadas</h2><div class="grid">${REFERENCES.map((r) => `<article class="card"><span class="tag warm">${esc(r.status)}</span><h3>${esc(r.name)}</h3><p>${esc(r.text)}</p>${r.url ? `<a href="${r.url}" target="_blank" rel="noopener noreferrer">Consultar referência (pode conter gabarito) ↗</a>` : ""}${r.exercise ? `<button data-code="${r.exercise}">Praticar adaptação</button>` : ""}</article>`).join("")}</div><div class="notice">Receber as listas não altera a verificação das fontes ENADE. As quatro questões prioritárias continuam marcadas com alta probabilidade segundo seu relato, nunca como garantidas na prova real.</div>`
  );
};
