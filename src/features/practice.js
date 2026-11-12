"use strict";
// Questões objetivas, ciclos de revisão e registro das tentativas.

let active = null,
  cycle = null;

function makeItem(id) {
  const e = byId(id),
    variant = attempts(id).length % e.variants.length,
    v = e.variants[variant];
  return { id, variant, order: shuffle(v.choices.map((_, i) => i)) };
}

function startPractice(id, inCycle = false) {
  if (!inCycle) cycle = null;
  active = {
    ...makeItem(id),
    submitted: false,
    hints: 0,
    shown: false,
    selected: null,
    scratch: "",
  };
  go("pratica");
}

function startCycle() {
  if (cycle && active) {
    go("pratica");
    return;
  }
  const prioritized = EXERCISES.filter((e) => e.priority),
    others = EXERCISES.filter((e) => !e.priority)
      .sort(
        (a, b) =>
          weakness(b) - weakness(a) ||
          (stats(a.id).last?.time || 0) - (stats(b.id).last?.time || 0),
      )
      .slice(0, 4);
  cycle = { queue: [...prioritized, ...others].map((e) => e.id), index: 0, repeated: [] };
  startPractice(cycle.queue[0], true);
}

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

function practice() {
  if (!active)
    return (
      heading(
        "PRÁTICA",
        "Escolha seu próximo desafio.",
        "Abra o catálogo ou inicie um ciclo de revisão.",
      ) + '<button data-action="cycle">Começar ciclo</button>'
    );
  const e = byId(active.id),
    v = e.variants[active.variant];
  return `<div class="exercise"><div class="row"><a href="#catalogo">${icon("arrow-left")} Catálogo</a><span class="pill">${cycle ? `Ciclo · ${cycle.index + 1} de ${cycle.queue.length}` : "Prática livre"} · exemplo ${active.variant + 1}/${e.variants.length}</span></div><div class="panel"><span class="kicker">${e.priority ? "ALTA PROBABILIDADE DE CAIR NA PROVA · SEGUNDO A AULA" : "TREINO AUTORAL"}</span>${importantBadge(e)}<h1>${esc(e.title)}</h1><small>${esc(e.sourceNote)}</small><p class="muted">${esc(e.summary)}</p><div>${tags(e)}</div><p class="question">${esc(v.q)}</p><form id="attempt-form"><fieldset style="border:0;padding:0;margin:0" ${active.submitted ? "disabled" : ""}><legend class="sr">Escolha sua resposta</legend><div class="options">${active.order.map((original, i) => `<label class="option"><input type="radio" required name="answer" value="${original}" ${active.selected === original ? "checked" : ""}><span><b>${String.fromCharCode(65 + i)}.</b> <code>${esc(v.choices[original])}</code></span></label>`).join("")}</div></fieldset><label class="margin" style="display:block">Seu raciocínio / teste de mesa (opcional)<textarea id="scratch" placeholder="Anote variáveis, passos ou sua tentativa em Python…" ${active.submitted ? "readonly" : ""}>${esc(active.scratch)}</textarea></label><small>O site corrige a alternativa escolhida. Este rascunho não é executado. Use Escrever código no catálogo para programar e verificar sua função.</small>${!active.submitted ? '<div class="actions"><button class="primary" type="submit">Enviar minha tentativa ${icon("arrow-right")}</button><small>Dicas e correção são liberadas depois da tentativa.</small></div>' : ""}</form>${active.submitted ? feedback(e, v) : ""}</div></div>`;
}

function feedback(e, v) {
  return `<section aria-live="polite"><div class="feedback ${active.correct ? "" : "wrong"}"><h3>${active.correct ? icon("circle-check") + " Você acertou." : "Ainda não. Vamos entender o raciocínio."}</h3><p>${esc(v.explain)}</p><small>Sua escolha: ${esc(v.choices[active.selected])}<br>Resposta: ${esc(v.choices[v.answer])}</small></div><div class="step"><h3>O caminho, passo a passo</h3><ol>${e.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div><div class="actions"><button data-action="hint" ${active.hints >= e.hint.length ? "disabled" : ""}>${active.hints ? "Próxima dica" : "Ver uma dica"} (${active.hints}/${e.hint.length})</button><button data-action="solution" ${active.shown ? "disabled" : ""}>Quero ver a solução completa</button></div>${e.hint
    .slice(0, active.hints)
    .map((h, i) => `<p class="notice">Dica ${i + 1}: ${esc(h)}</p>`)
    .join(
      "",
    )}${active.shown ? `<h3 class="margin">Uma solução em Python</h3><pre>${esc(e.solution)}</pre><small>A solução é uma referência para estudar; seu código pode usar outra abordagem correta.</small>` : ""}<div class="actions"><button class="primary" data-action="${cycle ? "next-cycle" : "retry"}">${cycle ? "Próxima questão" : "Tentar outro exemplo"} ${icon("arrow-right")}</button><a href="#revisao">Ver revisão</a></div></section>`;
}

function record(item, selected, mode, scratch = "") {
  const e = byId(item.id),
    v = e.variants[item.variant],
    a = {
      id: item.id,
      variant: item.variant,
      answer: v.choices[selected],
      correct: selected === v.answer,
      assisted: false,
      time: Date.now(),
      mode,
      scratch,
    };
  state.attempts.push(a);
  save();
  return a;
}

function nextCycle() {
  if (!cycle) return;
  if (!active.correct && !cycle.repeated.includes(active.id)) {
    cycle.queue.push(active.id);
    cycle.repeated.push(active.id);
  }
  cycle.index++;
  if (cycle.index >= cycle.queue.length) {
    state.cycles++;
    save();
    cycle = null;
    active = null;
    go("revisao");
    toast("Ciclo concluído! Seu mapa de revisão foi atualizado.");
  } else startPractice(cycle.queue[cycle.index], true);
}

function markAssisted() {
  // Referência ao objeto, não ao índice: a sincronização com a nuvem pode reordenar o histórico.
  const a = active.record;
  if (a && state.attempts.includes(a)) {
    a.assisted = true;
    save();
  }
}
