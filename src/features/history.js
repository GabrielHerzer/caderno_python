"use strict";
// Histórico de tentativas e simulados, com exportação e importação de backup.

let historyAll = false;

function historyPage() {
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
  return (
    heading(
      "SEU PERCURSO",
      "Meu histórico",
      "Veja os exercícios mais recentes e a quantidade de acertos em cada simulado.",
    ) +
    exams +
    historyAttempts()
  );
}

// Mostra as 20 tentativas mais recentes, ou todas quando historyAll está ativo.
function historyAttempts() {
  return `<div class="actions"><button data-action="export">Exportar backup</button><button data-action="import">Importar backup</button><input id="import-file" type="file" accept="application/json,.json" hidden><button class="danger" data-action="reset">Apagar histórico…</button></div><p class="muted margin">${state.attempts.length} tentativas · ${state.exams.length} simulados. O backup inclui os rascunhos. Importar substitui o histórico atual após confirmação.</p>${
    state.attempts.length
      ? `<div class="panel table-wrap"><table><thead><tr><th>Data / hora</th><th>Exercício</th><th>Resposta enviada</th><th>Resultado</th><th>Modo</th></tr></thead><tbody>${state.attempts
          .slice()
          .reverse()
          .slice(0, historyAll ? undefined : 20)
          .map(
            (a) =>
              `<tr><td>${new Date(a.time).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</td><td>${esc(byId(a.id).title)}${a.scratch ? `<details><summary>Meu rascunho</summary><pre>${esc(a.scratch)}</pre></details>` : ""}</td><td>${esc(a.answer)}</td><td>${a.correct ? "✓ Acerto" : "↻ Erro"}${a.assisted ? "<br><small>Ajuda consultada após envio</small>" : ""}</td><td>${a.mode === "codigo" ? "Código" : a.mode === "simulado" ? "Simulado" : a.mode === "ciclo" ? "Ciclo" : "Prática"}</td></tr>`,
          )
          .join("")}</tbody></table></div>`
      : '<div class="empty">Seu histórico começa na primeira tentativa. <a href="#catalogo">Escolha um exercício.</a></div>'
  }`;
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "python-em-pratica-backup.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importBackup(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  // A correção em andamento gravaria o resultado (ou apagaria o simulado pendente) no
  // histórico recém-importado.
  if (examGrading) {
    toast("Aguarde ou cancele a correção antes de importar um backup.");
    ev.target.value = "";
    return;
  }
  try {
    if (file.size > 5000000) throw Error("Arquivo maior que 5 MB");
    const next = JSON.parse(await file.text());
    validateState(next);
    if (confirm(`Substituir seu histórico por ${next.attempts.length} tentativas deste backup?`)) {
      resetCodingSession();
      state = next;
      active = cycle = exam = null;
      save();
      render();
      toast("Backup importado.");
    }
  } catch (e) {
    toast("Backup inválido: " + e.message);
  }
  ev.target.value = "";
}
