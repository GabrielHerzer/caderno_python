"use strict";
// Oficina: editor de código, execução livre e verificação com casos de teste.

let codingId = "fixa",
  codeResult = null,
  codeOutput = "",
  codeBusy = false,
  codeWorker = null,
  codeTimer = null,
  codeAttempted = false,
  codeHelp = 0,
  codeSolution = false,
  codeRecord = null;

function drafts() {
  return state.codeDrafts || (state.codeDrafts = {});
}

function codeDraft() {
  return drafts()[codingId] || { code: CODE_SPECS[codingId]?.starter || "", stdin: "" };
}

function caseCount(s) {
  return (s.program ? s.cases : s.tests).length;
}

// Interrompe a execução e esquece o resultado e a ajuda da oficina. Usado ao trocar de
// exercício e sempre que o histórico é substituído: codeRecord aponta para um índice de
// state.attempts, e dica/solução só podem voltar depois de uma nova tentativa.
function resetCodingSession() {
  stopCode(false);
  codeResult = null;
  codeOutput = "";
  codeAttempted = false;
  codeHelp = 0;
  codeSolution = false;
  codeRecord = null;
}

function openCoding(id) {
  resetCodingSession();
  codingId = id;
  go("codigo");
}

function codingPage() {
  const e = byId(codingId),
    s = CODE_SPECS[codingId],
    d = codeDraft();
  return (
    heading(
      "OFICINA DE PYTHON",
      "Escreva. Execute. Confira.",
      "Aqui você programa de verdade. A avaliação executa seu código em casos de teste.",
    ) +
    `<div class="code-layout"><section class="panel"><label>Exercício<select id="code-exercise" ${codeBusy ? "disabled" : ""}>${EXERCISES.map((e) => `<option value="${e.id}" ${e.id === codingId ? "selected" : ""}>${esc(e.title)}</option>`).join("")}</select></label><span class="tag ${e.priority ? "warm" : ""}">${e.priority ? "Anunciada verbalmente" : e.supplied ? "Lista " + e.list + " · " + e.letter : "Treino complementar autoral"}</span><h2 class="margin">${esc(e.title)}</h2><p>${esc(s.task)}</p>${s.notes ? `<div class="notice"><b>Nota sobre o material:</b> ${esc(s.notes)}</div>` : ``}${
      s.program
        ? `<p>Escreva um programa completo: leia os dados com <b>input()</b> e mostre o resultado com <b>print()</b>. O texto em volta dos números é livre.</p><p class="muted">${s.cases.length} ${s.cases.length === 1 ? "caso" : "casos"}. O corretor digita as entradas de cada caso por você e procura na saída os números e palavras esperados; o texto dos input() não conta. Passar confirma esses casos, não prova que todo programa possível está correto.</p>`
        : `<p>Escreva a função <code>${esc(s.signature)}</code>. Use <b>return</b> para entregar o resultado; apenas imprimir não atende ao contrato.</p><p class="muted">${s.tests.length} testes, incluindo casos de borda. Passar neles confirma esses casos, não prova que todo código possível está correto.</p>`
    }<div class="notice">Primeiro escreva sua tentativa. Dicas e solução completa só ficam disponíveis depois de clicar em Verificar meu código.</div><small>Python roda no seu navegador. É necessária internet para carregar o interpretador. Seu código não é enviado a um serviço de correção ou IA.</small>${
      codeAttempted
        ? `<div class="actions"><button id="code-hint" ${codeHelp >= e.hint.length ? "disabled" : ""}>Pedir dica (${codeHelp}/${e.hint.length})</button><button id="code-solution" ${codeSolution ? "disabled" : ""}>Quero ver a solução completa</button></div>${e.hint
            .slice(0, codeHelp)
            .map((h) => `<p class="notice">${esc(h)}</p>`)
            .join("")}${codeSolution ? `<pre>${esc(s.solution)}</pre>` : ""}`
        : ""
    }</section><section><div class="panel"><div class="row"><h2>Seu código</h2><small>Salvo automaticamente · Tab = 4 espaços</small></div><label class="sr" for="python-editor">Código Python</label><textarea id="python-editor" class="python-editor" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="${s.program ? "# Escreva seu programa aqui, com input() e print()." : "# Escreva sua função aqui. Você pode começar do zero."}" ${codeBusy ? "readonly" : ""}>${esc(d.code)}</textarea><label class="margin" style="display:block">Entradas para input() · uma por linha<textarea id="python-input" rows="2" placeholder="Opcional, usado em Executar livremente" ${codeBusy ? "readonly" : ""}>${esc(d.stdin)}</textarea></label><div class="actions"><button class="primary" id="check-code" ${codeBusy ? "disabled" : ""}>Verificar meu código</button><button id="run-code" ${codeBusy ? "disabled" : ""}>Executar livremente</button><button id="stop-code" ${codeBusy ? "" : "disabled"}>Parar</button></div><small>${s.program ? "Na verificação, cada caso roda seu programa do zero com as próprias entradas; o campo acima vale só para Executar livremente." : "Na verificação, os testes chamam sua função com argumentos. Use input() somente na execução livre. Cada envio começa em um ambiente Python novo."}</small></div><div id="code-status" class="panel margin" aria-live="polite">${codingResults()}</div></section></div>`
  );
}

function codingResults() {
  return `${codeBusy ? "<h3>Preparando / executando Python…</h3><p>O primeiro carregamento pode levar alguns segundos.</p>" : ""}${codeResult ? `<h3>${esc(codeResult.title)}</h3>${codeResult.error ? `<pre class="error-output">${esc(codeResult.error)}</pre>` : ""}${codeResult.rows ? `<p>${codeResult.rows.filter((r) => r.ok).length}/${codeResult.rows.length} ${CODE_SPECS[codingId].program ? "casos passaram" : "testes passaram"}. ${codeResult.rows.every((r) => r.ok) ? "Boa! Seu código atende a estes testes." : "Revise os casos abaixo e tente novamente."}</p>${codeResult.rows.map((r, i) => `<details class="test-row" ${r.ok ? "" : "open"}><summary>${r.ok ? "✓" : "✗"} ${CODE_SPECS[codingId].program ? "Caso" : "Teste"} ${i + 1} · ${esc(r.label)}</summary><p>Entrada: <code>${esc(r.input)}</code><br>Esperado: <code>${esc(r.expected)}</code><br>Recebido: <code>${esc(r.actual)}</code></p>${r.error ? `<pre class="error-output">${esc(r.error)}</pre>` : ""}</details>`).join("")}` : ""}` : !codeBusy ? `<h3>Seu resultado aparece aqui</h3><p>Escreva ${CODE_SPECS[codingId].program ? "o programa" : "a função"} e clique em Verificar meu código. Não precisa acertar de primeira.</p>` : ""}${codeOutput ? `<h3 class="margin">Saída do programa</h3><pre>${esc(codeOutput)}</pre>` : ""}`;
}

function bindCoding() {
  if (!$("#python-editor")) return;
  $("#code-exercise").onchange = (ev) => openCoding(ev.target.value);
  const persist = () => {
    drafts()[codingId] = { code: $("#python-editor").value, stdin: $("#python-input").value };
    save();
  };
  $("#python-editor").oninput = persist;
  $("#python-input").oninput = persist;
  $("#python-editor").onkeydown = (ev) => {
    if (ev.key === "Tab") {
      ev.preventDefault();
      const el = ev.target,
        a = el.selectionStart,
        b = el.selectionEnd;
      el.setRangeText("    ", a, b, "end");
      persist();
    }
  };
  $("#check-code").onclick = () => runCode(true);
  $("#run-code").onclick = () => runCode(false);
  $("#stop-code").onclick = () => stopCode(true);
  if ($("#code-hint"))
    $("#code-hint").onclick = () => {
      codeHelp++;
      markCodeHelp();
      render();
    };
  if ($("#code-solution"))
    $("#code-solution").onclick = () => {
      codeSolution = true;
      markCodeHelp();
      render();
    };
}

function markCodeHelp() {
  if (codeRecord !== null && state.attempts[codeRecord]) {
    state.attempts[codeRecord].assisted = true;
    save();
  }
}

function stopCode(show) {
  if (codeWorker) {
    codeWorker.terminate();
    codeWorker = null;
  }
  clearTimeout(codeTimer);
  codeBusy = false;
  if (show) {
    codeResult = {
      title: "Execução interrompida",
      error:
        "Você interrompeu a execução. Seu código foi preservado. Nenhum resultado novo foi registrado.",
    };
    render();
  }
}

function runCode(check) {
  if (codeBusy) return;
  const d = codeDraft();
  if (!d.code.trim()) {
    toast("Escreva sua tentativa antes de enviar.");
    return;
  }
  const id = codingId,
    s = CODE_SPECS[id];
  codeBusy = true;
  codeResult = null;
  codeOutput = "";
  render();
  const url = URL.createObjectURL(
    new Blob(["(" + pythonWorker.toString() + ")()"], { type: "application/javascript" }),
  );
  codeWorker = new Worker(url);
  URL.revokeObjectURL(url);
  let executionStarted = false;
  function end(result, recordResult = false) {
    stopCode(false);
    codeResult = result;
    if (check && recordResult) {
      codeAttempted = true;
      const correct =
        !!result.rows && result.rows.length === caseCount(s) && result.rows.every((r) => r.ok);
      state.attempts.push({
        id,
        variant: 0,
        answer: result.rows
          ? `${result.rows.filter((r) => r.ok).length}/${caseCount(s)} ${s.program ? "casos" : "testes"}`
          : "Erro ao executar",
        correct,
        assisted: codeHelp > 0 || codeSolution,
        time: Date.now(),
        mode: "codigo",
        scratch: d.code,
      });
      codeRecord = state.attempts.length - 1;
      save();
    }
    render();
  }
  codeTimer = setTimeout(
    () =>
      end({
        title: "Python não carregou",
        error:
          "Confira a conexão e tente novamente. O carregamento excedeu 60 segundos; isso não conta como erro seu.",
      }),
    60000,
  );
  codeWorker.onmessage = (ev) => {
    const m = ev.data;
    if (m.type === "ready") {
      executionStarted = true;
      clearTimeout(codeTimer);
      codeTimer = setTimeout(
        () =>
          end(
            {
              title: "Tempo de execução excedido",
              error:
                "O código ultrapassou 5 segundos. Verifique condições de parada e laços. A execução foi encerrada.",
            },
            check,
          ),
        5000,
      );
    } else if (m.type === "output") {
      codeOutput = (codeOutput + m.text + "\n").slice(0, 16000);
      if ($("#code-status")) $("#code-status").innerHTML = codingResults();
    } else if (m.type === "result") {
      end({ title: check ? "Verificação concluída" : "Execução concluída", rows: m.rows }, check);
    } else if (m.type === "error") {
      end(
        {
          title: executionStarted ? "Erro no código" : "Não foi possível carregar Python",
          error: m.error,
        },
        check && executionStarted,
      );
    }
  };
  codeWorker.onerror = () =>
    end({
      title: "Falha ao iniciar Python",
      error:
        "Confira sua conexão. Se estiver abrindo o arquivo diretamente e o navegador bloquear Python, siga o modo servidor local do README. Nenhuma tentativa foi registrada.",
    });
  codeWorker.postMessage({
    code: d.code,
    stdin: check ? "" : d.stdin,
    check,
    program: check && !!s.program,
    cases: s.cases || null,
    grader: s.program ? PROGRAM_GRADER : null,
    fn: s.fn,
    tests: s.tests,
    unchanged: !!s.unchanged,
    rules: s.rules || {},
    returnType: s.returnType || null,
  });
}
