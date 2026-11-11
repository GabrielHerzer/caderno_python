"use strict";
// Simulado Massanori: oito funções em Python corrigidas no navegador.

let exam = null;

let examGrading = false,
  examProgress = 0,
  examMessage = "",
  examCancel = null;

const LEGACY_FIXED = ["fixa", "anagrama", "arroz", "alturas"];

const EXAM_FIXED = [
  "arroz",
  "alturas",
  "count_code",
  "fixa",
  "busca",
  "zf",
  "sort_last",
  "anagrama",
];

const TRACE_IDS = ["mesa_for", "mesa_while", "matriz", "alias"];

function traceSpec(item) {
  const t = item.seed % 5;
  let source, expected, task;
  if (item.id === "mesa_for") {
    const n = 4 + t;
    let sum = 0;
    expected = [];
    for (let i = 1; i <= n; i++) {
      if (i % 2 === 0) sum += i;
      expected.push([i, sum]);
    }
    source = `total = 0\nfor i in range(1, ${n + 1}):\n    if i % 2 == 0:\n        total += i`;
    task =
      "Registre [i, total] ao final de CADA volta do for, inclusive as voltas em que total não muda.";
  } else if (item.id === "mesa_while") {
    const limit = 6 + t;
    let n = 1,
      sum = 0;
    expected = [];
    while (n < limit) {
      sum += n;
      n += 2;
      expected.push([n, sum]);
    }
    source = `n, total = 1, 0\nwhile n < ${limit}:\n    total += n\n    n += 2`;
    task = "Registre [n, total] ao final de CADA volta, depois de executar n += 2.";
  } else if (item.id === "alias") {
    source = `a = [${t + 1}, ${t + 2}]\nb = a\nc = a[:]\nb.append(${t + 3})\nc[0] = -1`;
    expected = [
      [t + 1, t + 2, t + 3],
      [t + 1, t + 2, t + 3],
      [-1, t + 2],
    ];
    task =
      "Acompanhe as referências. Retorne uma lista com os valores finais de [a, b, c], nessa ordem.";
  } else {
    source = `m = [[${t + 1}, ${t + 2}], [${t + 3}, ${t + 4}]]\nm[0][0] = m[1][1]\nm[1][1] = m[0][0]`;
    expected = [
      [
        [t + 4, t + 2],
        [t + 3, t + 4],
      ],
      [
        [t + 4, t + 2],
        [t + 3, t + 4],
      ],
    ];
    task =
      "Registre a matriz após a PRIMEIRA atribuição e após a SEGUNDA. Retorne a lista contendo essas duas matrizes, na ordem.";
  }
  return {
    fn: "resposta",
    signature: "resposta()",
    source,
    task:
      task +
      " Faça o teste de mesa e escreva def resposta(): com return da tabela/lista que você encontrou. Não é preciso usar input().",
    tests: [[[], expected]],
    solution: `def resposta():\n    return ${JSON.stringify(expected)}`,
    explanation:
      "Leia os comandos em ordem e use os valores atualizados. A tabela deve representar exatamente o ponto solicitado (fim da volta ou após a atribuição), não o estado anterior.",
  };
}

function examSpec(item) {
  return item.kind === "trace" ? traceSpec(item) : CODE_SPECS[item.id];
}

function validLegacyExam(e, finished = false) {
  if (
    !e ||
    e.format !== "codigo-v3" ||
    !Array.isArray(e.items) ||
    e.items.length !== 7 ||
    !e.answers ||
    typeof e.answers !== "object" ||
    Array.isArray(e.answers) ||
    !Number.isInteger(e.index) ||
    e.index < 0 ||
    e.index > 6 ||
    !Number.isFinite(e.started)
  )
    return false;
  const ids = e.items.map((x) => x?.id);
  if (new Set(ids).size !== 7 || !LEGACY_FIXED.every((id) => ids.includes(id))) return false;
  if (e.items.filter((x) => x.kind === "trace").length !== 2) return false;
  for (const x of e.items) {
    if (
      !byId(x.id) ||
      !["code", "trace"].includes(x.kind) ||
      !Number.isInteger(x.seed) ||
      x.seed < 0 ||
      x.seed > 999999
    )
      return false;
    if (x.kind === "trace" && !TRACE_IDS.includes(x.id)) return false;
    if (
      x.kind === "code" &&
      !LEGACY_FIXED.includes(x.id) &&
      (TRACE_IDS.includes(x.id) || (!byId(x.id).list && !byId(x.id).extra))
    )
      return false;
    if (LEGACY_FIXED.includes(x.id) && x.kind !== "code") return false;
  }
  if (Object.entries(e.answers).some(([i, v]) => !/^[0-6]$/.test(i) || typeof v !== "string"))
    return false;
  if (
    finished &&
    (!Number.isInteger(e.score) ||
      e.score < 0 ||
      e.score > 7 ||
      !Array.isArray(e.revealed) ||
      e.revealed.some((i) => !Number.isInteger(i) || i < 0 || i > 6) ||
      !e.finished ||
      !Array.isArray(e.results) ||
      e.results.length !== 7 ||
      e.results.some(
        (r) =>
          !r ||
          typeof r.correct !== "boolean" ||
          (r.rows &&
            (!Array.isArray(r.rows) || r.rows.some((row) => !row || typeof row.ok !== "boolean"))),
      ))
  )
    return false;
  return true;
}

function validExam(e, finished = false) {
  if (e?.format === "codigo-v3") return validLegacyExam(e, finished);
  if (!e || e.format !== "codigo-v4" || !Array.isArray(e.items) || e.items.length !== 8)
    return false;
  if (!e.answers || typeof e.answers !== "object" || Array.isArray(e.answers)) return false;
  if (!Number.isInteger(e.index) || e.index < 0 || e.index >= 8 || !Number.isFinite(e.started))
    return false;
  if (new Set(e.items.map((x) => x?.id)).size !== 8) return false;
  if (
    e.items.some(
      (x) =>
        !x ||
        !EXAM_FIXED.includes(x.id) ||
        x.kind !== "code" ||
        !Number.isInteger(x.seed) ||
        x.seed < 0 ||
        x.seed > 999999,
    )
  )
    return false;
  if (Object.entries(e.answers).some(([i, v]) => !/^[0-7]$/.test(i) || typeof v !== "string"))
    return false;
  if (finished) {
    if (!e.finished || !Number.isInteger(e.score) || e.score < 0 || e.score > 8) return false;
    if (
      !Array.isArray(e.revealed) ||
      e.revealed.some((i) => !Number.isInteger(i) || i < 0 || i >= 8)
    )
      return false;
    if (!Array.isArray(e.results) || e.results.length !== 8) return false;
    if (
      e.results.some(
        (r) =>
          !r ||
          typeof r.correct !== "boolean" ||
          (r.rows &&
            (!Array.isArray(r.rows) || r.rows.some((row) => !row || typeof row.ok !== "boolean"))),
      )
    )
      return false;
  }
  return true;
}

function validStoredExam(e) {
  return ["codigo-v3", "codigo-v4"].includes(e?.format) && validExam(e.detail, true);
}

function persistExam() {
  if (exam && !exam.finished && validExam(exam))
    state.pendingExam = JSON.parse(JSON.stringify(exam));
  else delete state.pendingExam;
  save();
}

function restoreExam() {
  if (!exam && state.pendingExam) {
    if (validExam(state.pendingExam) && !state.pendingExam.finished) {
      exam = JSON.parse(JSON.stringify(state.pendingExam));
      exam.revealed = [];
    } else {
      delete state.pendingExam;
      save();
    }
  }
}

function startExam() {
  if (examGrading) return;
  exam = {
    format: "codigo-v4",
    items: EXAM_FIXED.map((id) => ({ id, kind: "code", seed: 0 })),
    index: 0,
    answers: {},
    finished: false,
    revealed: [],
    started: Date.now(),
  };
  examMessage = "";
  persistExam();
  render();
}

function examPage() {
  restoreExam();
  if (!exam)
    return (
      heading(
        "SIMULADO MASSANORI · RESPOSTAS EM PYTHON",
        "Oito questões para revisar.",
        "As oito questões da indicação enviada por você, sempre na mesma ordem.",
      ) +
      `<div class="panel"><h2>As oito questões de cada rodada</h2><ol>${EXAM_FIXED.map((id) => `<li>${esc(byId(id).title)}</li>`).join("")}</ol><p>Escreva as oito funções e finalize para conferir os testes e receber sua nota de 0 a 8. Suas respostas são salvas automaticamente.</p><p>Use Reiniciar simulado para refazer as mesmas questões desde o começo. Soluções completas aparecem por pedido explícito após a correção.</p><p class="muted">Internet necessária para carregar Python. As questões ENADE usam as adaptações de treino e os estados de conferência indicados no catálogo.</p><button class="primary" data-action="start-exam">Começar simulado · 8 questões →</button></div>`
    );
  if (exam.finished) return examResult();
  const x = exam.items[exam.index],
    e = byId(x.id),
    s = examSpec(x),
    count = Object.values(exam.answers).filter((a) => a.trim()).length;
  return (
    heading(
      "SIMULADO EM ANDAMENTO",
      `Questão ${exam.index + 1} de ${exam.items.length} · ${esc(e.title)}`,
      `<span id="exam-count">${count}/${exam.items.length} respostas escritas</span> · salvo automaticamente neste navegador`,
    ) +
    `<div class="actions"><button data-action="refresh-exam" ${examGrading ? "disabled" : ""}>↻ Reiniciar simulado</button><small>Recomeça sem corrigir ou registrar nota para esta rodada.</small></div><div class="exam-nav">${exam.items.map((item, i) => `<button data-exam-index="${i}" ${examGrading ? "disabled" : ""} aria-label="Questão ${i + 1}${exam.answers[i]?.trim() ? ", respondida" : ""}" class="${exam.index === i ? "current" : ""} ${exam.answers[i]?.trim() ? "answered" : ""}">${i + 1}</button>`).join("")}</div><div class="panel"><span class="tag ${e.priority ? "warm" : ""}">${x.kind === "trace" ? "Teste de mesa" : e.priority ? "Alta probabilidade de cair na prova" : "Questão fixa do simulado"}</span>${importantBadge(e)}<p class="question">${esc(s.task)}</p>${s.notes ? `<div class="notice">${esc(s.notes)}</div>` : ``}${s.source ? `<h3>Algoritmo para acompanhar</h3><pre>${esc(s.source)}</pre>` : ""}<p>Assinatura: <code>${esc(s.signature)}</code>. Use <code>return</code> no formato pedido.</p><label for="exam-code"><b>Sua resposta em Python</b></label><textarea id="exam-code" class="python-editor" spellcheck="false" autocapitalize="off" ${examGrading ? "readonly" : ""} placeholder="Escreva sua função aqui, sem consultar a solução…">${esc(exam.answers[exam.index] || "")}</textarea><small>Tab insere 4 espaços. O código será testado no envio final; não haverá dica ou gabarito durante a rodada.</small><div class="actions"><button data-action="exam-prev" ${exam.index === 0 || examGrading ? "disabled" : ""}>← Anterior</button><button data-action="exam-next" ${exam.index === exam.items.length - 1 || examGrading ? "disabled" : ""}>Próxima →</button><button class="primary" data-action="finish-exam" ${count !== exam.items.length || examGrading ? "disabled" : ""}>Finalizar e corrigir as ${exam.items.length} questões</button>${examGrading ? '<button id="cancel-exam-grade">Cancelar correção</button>' : ""}</div><div id="exam-status" aria-live="polite">${examGrading ? `<p class="notice">Corrigindo questão ${examProgress + 1}/${exam.items.length}. Aguarde o resultado completo.</p>` : ""}${examMessage ? `<p class="notice">${esc(examMessage)}</p>` : ""}</div></div>`
  );
}

function evaluateCode(spec, code) {
  return new Promise((resolve, reject) => {
    let started = false,
      timer,
      done = false;
    const url = URL.createObjectURL(
      new Blob(["(" + pythonWorker.toString() + ")()"], { type: "application/javascript" }),
    );
    let worker;
    function close() {
      clearTimeout(timer);
      worker?.terminate();
      URL.revokeObjectURL(url);
      examCancel = null;
    }
    function finish(result, error) {
      if (done) return;
      done = true;
      close();
      error ? reject(error) : resolve(result);
    }
    try {
      worker = new Worker(url);
    } catch (e) {
      finish(
        null,
        Error("O navegador não iniciou Python. Tente abrir pelo servidor local do README."),
      );
      return;
    }
    examCancel = () => finish(null, Error("Correção cancelada. Suas respostas foram preservadas."));
    timer = setTimeout(
      () =>
        finish(
          null,
          Error(
            "Python não carregou em 60 segundos. Confira a internet e tente corrigir novamente.",
          ),
        ),
      60000,
    );
    worker.onmessage = (ev) => {
      const m = ev.data;
      if (m.type === "ready") {
        started = true;
        clearTimeout(timer);
        timer = setTimeout(
          () =>
            finish({
              correct: false,
              error: "Tempo excedido (5 segundos). Verifique a condição de parada dos laços.",
              rows: null,
            }),
          5000,
        );
      } else if (m.type === "result") {
        const rows = m.rows;
        finish({
          correct:
            Array.isArray(rows) && rows.length === spec.tests.length && rows.every((r) => r.ok),
          rows,
        });
      } else if (m.type === "error") {
        if (started) finish({ correct: false, error: m.error, rows: null });
        else finish(null, Error("Falha ao carregar Python. Confira a conexão e tente novamente."));
      }
    };
    worker.onerror = () =>
      finish(
        null,
        Error("Falha no interpretador. As respostas foram preservadas; tente novamente."),
      );
    worker.postMessage({
      code,
      check: true,
      stdin: "",
      fn: spec.fn,
      tests: spec.tests,
      unchanged: !!spec.unchanged,
      rules: spec.rules || {},
      returnType: spec.returnType || null,
    });
  });
}

async function finishExam() {
  if (
    examGrading ||
    !exam ||
    exam.finished ||
    Object.values(exam.answers).filter((a) => a.trim()).length !== exam.items.length
  )
    return;
  stopCode(false);
  examGrading = true;
  examMessage = "";
  examProgress = 0;
  const current = exam,
    owner = state,
    results = [];
  render();
  try {
    for (let i = 0; i < current.items.length; i++) {
      examProgress = i;
      render();
      results.push(await evaluateCode(examSpec(current.items[i]), current.answers[i]));
      if (exam !== current || state !== owner)
        throw Error("A sessão mudou. A correção não foi registrada.");
    }
    current.results = results;
    current.score = results.filter((r) => r.correct).length;
    current.finished = true;
    current.revealed = [];
    const time = Date.now();
    current.items.forEach((item, i) =>
      state.attempts.push({
        id: item.id,
        variant: 0,
        answer: results[i].rows
          ? `${results[i].rows.filter((r) => r.ok).length}/${examSpec(item).tests.length} testes`
          : "Erro de execução",
        correct: results[i].correct,
        assisted: false,
        time,
        mode: "simulado",
        scratch: current.answers[i],
      }),
    );
    state.exams.push({
      format: current.format,
      score: current.score,
      total: current.items.length,
      time,
      detail: JSON.parse(JSON.stringify(current)),
    });
    delete state.pendingExam;
    save();
  } catch (e) {
    examMessage = e.message;
    persistExam();
  } finally {
    examGrading = false;
    examCancel = null;
    render();
  }
}

function examResult() {
  return (
    heading(
      "SIMULADO MASSANORI · CONCLUÍDO",
      `${exam.score} de ${exam.items.length} acertos.`,
      "Cada questão vale um acerto quando todos os testes passam. O resultado e suas respostas estão no histórico.",
    ) +
    `<div class="actions"><button class="primary" data-action="new-exam">${state.pendingExam ? "Voltar ao simulado em andamento" : "Preparar novo simulado"}</button><a href="#revisao">Revisar por tema</a><a href="#historico">Ver meus resultados</a></div><div class="grid margin">${exam.items
      .map((x, i) => {
        const e = byId(x.id),
          s = examSpec(x),
          r = exam.results[i];
        return `<article class="card"><span class="tag ${r.correct ? "" : "warm"}">${r.correct ? "✓ Acerto" : "↻ Revisar"} · Questão ${i + 1} · ${x.kind === "trace" ? "teste de mesa" : "código"}</span><h3>${esc(e.title)}</h3><p>${esc(s.task)}</p>${s.source ? `<pre>${esc(s.source)}</pre>` : ""}<details><summary>Minha resposta enviada</summary><pre>${esc(exam.answers[i])}</pre></details>${r.error ? `<pre class="error-output">${esc(r.error)}</pre>` : ""}${r.rows ? `<p><b>${r.rows.filter((row) => row.ok).length}/${r.rows.length} testes aprovados</b></p>${r.rows.map((row, k) => `<details class="test-row"><summary>${row.ok ? "✓" : "✗"} Teste ${k + 1}</summary><p>Entrada: <code>${esc(row.input)}</code><br>Esperado: <code>${esc(row.expected)}</code><br>Recebido: <code>${esc(row.actual)}</code></p>${row.error ? `<pre>${esc(row.error)}</pre>` : ""}</details>`).join("")}` : ""}<h3 class="margin">Como revisar</h3>${x.kind === "trace" ? `<p>${esc(s.explanation)}</p>` : `<ol>${e.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>`}<button data-exam-solution="${i}" ${exam.revealed.includes(i) ? "disabled" : ""}>Quero ver a solução completa</button>${exam.revealed.includes(i) ? `<pre>${esc(s.solution)}</pre>` : ""}</article>`;
      })
      .join("")}</div>`
  );
}

function bindExam() {
  const el = $("#exam-code");
  if (el) {
    el.oninput = () => {
      exam.answers[exam.index] = el.value;
      persistExam();
      const count = Object.values(exam.answers).filter((a) => a.trim()).length;
      const send = document.querySelector('[data-action="finish-exam"]');
      if (send) send.disabled = count !== exam.items.length || examGrading;
      if ($("#exam-count"))
        $("#exam-count").textContent = count + "/" + exam.items.length + " respostas escritas";
    };
    el.onkeydown = (ev) => {
      if (ev.key === "Tab") {
        ev.preventDefault();
        el.setRangeText("    ", el.selectionStart, el.selectionEnd, "end");
        el.oninput();
      }
    };
  }
  if ($("#cancel-exam-grade")) $("#cancel-exam-grade").onclick = () => examCancel?.();
  document.querySelectorAll("[data-exam-index]").forEach(
    (b) =>
      (b.onclick = () => {
        if (examGrading) return;
        exam.index = Number(b.dataset.examIndex);
        persistExam();
        render();
      }),
  );
  document.querySelectorAll("[data-exam-solution]").forEach(
    (b) =>
      (b.onclick = () => {
        exam.revealed.push(Number(b.dataset.examSolution));
        render();
      }),
  );
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
}
