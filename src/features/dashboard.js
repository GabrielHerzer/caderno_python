"use strict";
// Tela inicial: painel de progresso e prioridades de estudo.

function dashboard() {
  const s = stats(),
    seen = EXERCISES.filter((e) => stats(e.id).n).length;
  return (
    heading(
      "APRENDER → PRATICAR → REVISAR",
      "Vamos transformar estudo em prática.",
      "Seu treino de Python, com espaço para errar e tentar de novo.",
    ) +
    `<section class="hero"><div><span class="kicker">FOCO DA PRÓXIMA SESSÃO</span><h2>Primeiro, tente sozinho.<br>Depois, entenda cada passo.</h2><p>Um ciclo com as quatro questões anunciadas e os temas que mais precisam da sua atenção.</p><button class="lime" data-action="cycle">Começar ciclo de revisão →</button></div><div class="code-art"><span># o seu próximo passo</span><br>while aprendendo:<br>&nbsp;&nbsp;tentar()<br>&nbsp;&nbsp;entender()<br>&nbsp;&nbsp;<span>tentar_de_novo()</span></div></section><section class="stats" aria-label="Seu desempenho"><div class="stat"><small>Tentativas registradas</small><strong>${s.n}</strong><small>Seu ponto de partida conta.</small></div><div class="stat"><small>Acertos sem ajuda</small><strong>${s.n ? Math.round((s.independent / s.n) * 100) + "%" : "—"}</strong><small>${s.independent} de ${s.n} tentativas</small></div><div class="stat"><small>Exercícios explorados</small><strong>${seen}<small> / ${EXERCISES.length}</small></strong><small>Treinos com correção</small></div><div class="stat"><small>Ciclos concluídos</small><strong>${state.cycles}</strong><small>Consistência, uma volta por vez.</small></div></section><section class="panel margin"><div class="row"><div><span class="kicker">REVISÃO DO QUE VOCÊ VIU AGORA</span><h2>Métodos de strings e lógica, na prática</h2></div><a href="#revisao">Revisar a sintaxe →</a></div><div class="grid three">${["ends", "replace", "slice", "logica", "mesa_for", "mesa_while"].map((id) => card(byId(id))).join("")}</div></section><div class="split margin"><section><div class="row"><h2>Prioridade de estudo</h2><a href="#catalogo">Ver catálogo ↗</a></div><div class="grid">${EXERCISES.filter(
      (e) => e.priority,
    )
      .map(card)
      .join(
        "",
      )}</div></section><section><div class="panel"><span class="kicker">SEU MAPA DE REVISÃO</span><h2 class="margin">Onde concentrar energia</h2>${weakList()}<button class="text" data-action="cycle">Revisar esses pontos →</button></div><div class="notice">“Alta probabilidade de cair na prova” registra seu relato sobre a aula. Não é garantia de que uma questão aparecerá na prova.</div><div class="panel"><span class="badge-num">01</span><h3>Treine o raciocínio no papel</h3><p class="muted">Acompanhe cada variável antes de executar mentalmente a próxima linha.</p><button data-practice="mesa_for">Fazer um teste de mesa</button></div></section></div>`
  );
}

function weakList() {
  return topicStats()
    .slice(0, 5)
    .map(
      (t) =>
        `<div class="weak-row"><div class="row" style="margin:0"><span>${esc(t.topic)}</span><small>${t.rate === null ? "A explorar" : t.rate + "% sem ajuda"}</small></div><div class="progress" style="margin-bottom:0"><span style="width:${t.rate ?? 0}%"></span></div></div>`,
    )
    .join("");
}
