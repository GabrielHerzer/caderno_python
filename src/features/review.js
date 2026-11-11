"use strict";
// Revisão adaptativa: lições por tema, ordenadas pelo desempenho.

let lessonTopic = "";

function review() {
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
}
