"use strict";
// Liga os eventos da tela renderizada e inicia o app. Carregado por último.

// Chamado por render() depois de cada troca de tela.
function bind() {
  document
    .querySelectorAll("[data-code]")
    .forEach((b) => (b.onclick = () => openCoding(b.dataset.code)));
  document
    .querySelectorAll("[data-practice]")
    .forEach((b) => (b.onclick = () => startPractice(b.dataset.practice)));
  document
    .querySelectorAll("[data-action]")
    .forEach((b) => (b.onclick = () => action(b.dataset.action)));
  if ($("#attempt-form"))
    $("#attempt-form").onsubmit = (ev) => {
      ev.preventDefault();
      if (active.submitted) return;
      const chosen = $("[name=answer]:checked");
      if (!chosen) return;
      active.selected = Number(chosen.value);
      active.scratch = $("#scratch").value;
      const a = record(active, active.selected, cycle ? "ciclo" : "pratica", active.scratch);
      active.recordIndex = state.attempts.length - 1;
      active.correct = a.correct;
      active.submitted = true;
      render();
    };
  for (const key of ["search", "topic"]) {
    const el = $("#" + key);
    if (el)
      el.addEventListener(key === "search" ? "input" : "change", () => {
        filters[key] = key === "priority" ? el.checked : el.value;
        $("#results").innerHTML = catalogResults();
        document
          .querySelectorAll("[data-code]")
          .forEach((b) => (b.onclick = () => openCoding(b.dataset.code)));
        document
          .querySelectorAll("[data-practice]")
          .forEach((b) => (b.onclick = () => startPractice(b.dataset.practice)));
      });
  }
  if ($("#import-file")) $("#import-file").onchange = importBackup;
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
  bindExam();
}

function action(name) {
  switch (name) {
    case "cycle":
      startCycle();
      break;
    case "clear-filters":
      filters.search = "";
      filters.topic = "";
      render();
      break;
    case "hint":
      if (active?.submitted) {
        active.hints = Math.min(active.hints + 1, byId(active.id).hint.length);
        markAssisted();
        render();
      }
      break;
    case "solution":
      if (active?.submitted) {
        active.shown = true;
        markAssisted();
        render();
      }
      break;
    case "retry":
      startPractice(active.id);
      break;
    case "next-cycle":
      nextCycle();
      break;
    case "start-exam":
      startExam();
      break;
    case "refresh-exam":
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
    case "exam-prev":
    case "exam-next":
      if (examGrading || !exam) return;
      exam.index = Math.max(
        0,
        Math.min(exam.items.length - 1, exam.index + (name === "exam-next" ? 1 : -1)),
      );
      persistExam();
      render();
      break;
    case "finish-exam":
      finishExam();
      break;
    case "new-exam":
      if (examGrading) return;
      exam = null;
      save();
      render();
      break;
    case "export":
      exportBackup();
      break;
    case "import":
      if (examGrading) {
        toast("Aguarde ou cancele a correção antes de importar um backup.");
        return;
      }
      $("#import-file").click();
      break;
    case "reset":
      if (examGrading) {
        toast("Aguarde ou cancele a correção antes de apagar o histórico.");
        return;
      }
      if (
        confirm(
          "Apagar todas as tentativas, ciclos e simulados? Exporte um backup antes se quiser preservá-los.",
        )
      ) {
        state = { version: 1, attempts: [], cycles: 0, exams: [] };
        resetCodingSession();
        active = cycle = exam = null;
        save();
        render();
        toast("Histórico apagado.");
      }
      break;
  }
}

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
});

window.addEventListener("beforeunload", (ev) => {
  if (examGrading) {
    ev.preventDefault();
    ev.returnValue = "";
  }
});

render();
