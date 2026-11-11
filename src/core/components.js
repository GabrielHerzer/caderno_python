"use strict";
// Pedaços de HTML reaproveitados por várias telas.

function heading(k, title, sub) {
  return `<div class="kicker">${k}</div><h1>${title}</h1><p class="muted">${sub}</p>`;
}

const tags = (e) => e.topics.map((t) => `<span class="tag">${esc(t)}</span>`).join("");

function card(e) {
  const s = stats(e.id);
  return `<article class="card"><div>${e.priority ? '<span class="tag warm">Alta probabilidade de cair na prova</span>' : ""}</div>${importantBadge(e)}<h3>${esc(e.title)}</h3><small>${esc(e.sourceNote)}</small><p>${esc(e.summary)}</p><div>${tags(e)}</div><small>${s.n ? `${s.ok}/${s.n} acertos · ${s.independent} sem ajuda` : "Ainda não praticado"}</small><div class="actions"><button class="primary" data-code="${e.id}">Escrever código ↗</button><button data-practice="${e.id}">Questão objetiva</button></div></article>`;
}

function importantBadge(e) {
  if (e.priority)
    return '<p class="notice"><strong>Massanori gostou muito dessa questão.</strong><br><small>Alta probabilidade segundo seu relato sobre a aula; não é confirmação da prova.</small></p>';
  return e.teacherLiked
    ? '<p class="notice">★ <strong>Importante.</strong> Massanori falou que gostou do exercício.<br><small>Indicado como importante na postagem “Dicas P2”. Não é garantia de cair na prova.</small></p>'
    : "";
}
