let codingId='fixa', codeResult=null, codeOutput='', codeBusy=false, codeWorker=null, codeTimer=null, codeAttempted=false, codeHelp=0, codeSolution=false, codeRecord=null;
function drafts(){return state.codeDrafts||(state.codeDrafts={});}
function codeDraft(){return drafts()[codingId]||{code:'',stdin:''};}
function openCoding(id){stopCode(false);codingId=id;codeResult=null;codeOutput='';codeAttempted=false;codeHelp=0;codeSolution=false;codeRecord=null;go('codigo');}
function codingPage(){const e=byId(codingId),s=CODE_SPECS[codingId],d=codeDraft();return heading('OFICINA DE PYTHON','Escreva. Execute. Confira.','Aqui você programa de verdade. A avaliação executa seu código em casos de teste.')+`<div class="code-layout"><section class="panel"><label>Exercício<select id="code-exercise" ${codeBusy?'disabled':''}>${EXERCISES.map(e=>`<option value="${e.id}" ${e.id===codingId?'selected':''}>${esc(e.title)}</option>`).join('')}</select></label><span class="tag ${e.priority?'warm':''}">${e.priority?'Anunciada verbalmente':e.supplied?'Lista '+e.list+' · '+e.letter:'Treino complementar autoral'}</span><h2 class="margin">${esc(e.title)}</h2><p>${esc(s.task)}</p>${s.notes?`<div class="notice"><b>Nota sobre o material:</b> ${esc(s.notes)}</div>`:``}<p>Escreva a função <code>${esc(s.signature)}</code>. Use <b>return</b> para entregar o resultado; apenas imprimir não atende ao contrato.</p><p class="muted">${s.tests.length} testes, incluindo casos de borda. Passar neles confirma esses casos, não prova que todo código possível está correto.</p><div class="notice">Primeiro escreva sua tentativa. Dicas e solução completa só ficam disponíveis depois de clicar em Verificar meu código.</div><small>Python roda no seu navegador. É necessária internet para carregar o interpretador. Seu código não é enviado a um serviço de correção ou IA.</small>${codeAttempted?`<div class="actions"><button id="code-hint" ${codeHelp>=e.hint.length?'disabled':''}>Pedir dica (${codeHelp}/${e.hint.length})</button><button id="code-solution" ${codeSolution?'disabled':''}>Quero ver a solução completa</button></div>${e.hint.slice(0,codeHelp).map(h=>`<p class="notice">${esc(h)}</p>`).join('')}${codeSolution?`<pre>${esc(s.solution)}</pre>`:''}`:''}</section><section><div class="panel"><div class="row"><h2>Seu código</h2><small>Salvo automaticamente · Tab = 4 espaços</small></div><label class="sr" for="python-editor">Código Python</label><textarea id="python-editor" class="python-editor" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="# Escreva sua função aqui. Você pode começar do zero." ${codeBusy?'readonly':''}>${esc(d.code)}</textarea><label class="margin" style="display:block">Entradas para input() · uma por linha<textarea id="python-input" rows="2" placeholder="Opcional, usado em Executar livremente" ${codeBusy?'readonly':''}>${esc(d.stdin)}</textarea></label><div class="actions"><button class="primary" id="check-code" ${codeBusy?'disabled':''}>Verificar meu código</button><button id="run-code" ${codeBusy?'disabled':''}>Executar livremente</button><button id="stop-code" ${codeBusy?'':'disabled'}>Parar</button></div><small>Na verificação, os testes chamam sua função com argumentos. Use input() somente na execução livre. Cada envio começa em um ambiente Python novo.</small></div><div id="code-status" class="panel margin" aria-live="polite">${codingResults()}</div></section></div>`;}
function codingResults(){return `${codeBusy?'<h3>Preparando / executando Python…</h3><p>O primeiro carregamento pode levar alguns segundos.</p>':''}${codeResult?`<h3>${esc(codeResult.title)}</h3>${codeResult.error?`<pre class="error-output">${esc(codeResult.error)}</pre>`:''}${codeResult.rows?`<p>${codeResult.rows.filter(r=>r.ok).length}/${codeResult.rows.length} testes passaram. ${codeResult.rows.every(r=>r.ok)?'Boa! Seu código atende a estes testes.':'Revise os casos abaixo e tente novamente.'}</p>${codeResult.rows.map((r,i)=>`<details class="test-row" ${r.ok?'':'open'}><summary>${r.ok?'✓':'✗'} Teste ${i+1} · ${esc(r.label)}</summary><p>Entrada: <code>${esc(r.input)}</code><br>Esperado: <code>${esc(r.expected)}</code><br>Recebido: <code>${esc(r.actual)}</code></p>${r.error?`<pre class="error-output">${esc(r.error)}</pre>`:''}</details>`).join('')}`:''}`:!codeBusy?'<h3>Seu resultado aparece aqui</h3><p>Escreva a função e clique em Verificar meu código. Não precisa acertar de primeira.</p>':''}${codeOutput?`<h3 class="margin">Saída do programa</h3><pre>${esc(codeOutput)}</pre>`:''}`;}
function bindCoding(){if(!$('#python-editor'))return;$('#code-exercise').onchange=ev=>openCoding(ev.target.value);const persist=()=>{drafts()[codingId]={code:$('#python-editor').value,stdin:$('#python-input').value};save();};$('#python-editor').oninput=persist;$('#python-input').oninput=persist;$('#python-editor').onkeydown=ev=>{if(ev.key==='Tab'){ev.preventDefault();const el=ev.target,a=el.selectionStart,b=el.selectionEnd;el.setRangeText('    ',a,b,'end');persist();}};$('#check-code').onclick=()=>runCode(true);$('#run-code').onclick=()=>runCode(false);$('#stop-code').onclick=()=>stopCode(true);if($('#code-hint'))$('#code-hint').onclick=()=>{codeHelp++;markCodeHelp();render();};if($('#code-solution'))$('#code-solution').onclick=()=>{codeSolution=true;markCodeHelp();render();};}
function markCodeHelp(){if(codeRecord!==null&&state.attempts[codeRecord]){state.attempts[codeRecord].assisted=true;save();}}
function stopCode(show){if(codeWorker){codeWorker.terminate();codeWorker=null;}clearTimeout(codeTimer);codeBusy=false;if(show){codeResult={title:'Execução interrompida',error:'Você interrompeu a execução. Seu código foi preservado. Nenhum resultado novo foi registrado.'};render();}}
function runCode(check){if(codeBusy)return;const d=codeDraft();if(!d.code.trim()){toast('Escreva sua tentativa antes de enviar.');return;}const id=codingId,s=CODE_SPECS[id];codeBusy=true;codeResult=null;codeOutput='';render();const url=URL.createObjectURL(new Blob(['('+pythonWorker.toString()+')()'],{type:'application/javascript'}));codeWorker=new Worker(url);URL.revokeObjectURL(url);let executionStarted=false;
function end(result,recordResult=false){stopCode(false);codeResult=result;if(check&&recordResult){codeAttempted=true;const correct=!!result.rows&&result.rows.length===s.tests.length&&result.rows.every(r=>r.ok);state.attempts.push({id,variant:0,answer:result.rows?`${result.rows.filter(r=>r.ok).length}/${s.tests.length} testes`:'Erro ao executar',correct,assisted:codeHelp>0||codeSolution,time:Date.now(),mode:'codigo',scratch:d.code});codeRecord=state.attempts.length-1;save();}render();}
codeTimer=setTimeout(()=>end({title:'Python não carregou',error:'Confira a conexão e tente novamente. O carregamento excedeu 60 segundos; isso não conta como erro seu.'}),60000);
codeWorker.onmessage=ev=>{const m=ev.data;if(m.type==='ready'){executionStarted=true;clearTimeout(codeTimer);codeTimer=setTimeout(()=>end({title:'Tempo de execução excedido',error:'O código ultrapassou 5 segundos. Verifique condições de parada e laços. A execução foi encerrada.'},check),5000);}else if(m.type==='output'){codeOutput=(codeOutput+m.text+'\n').slice(0,16000);if($('#code-status'))$('#code-status').innerHTML=codingResults();}else if(m.type==='result'){end({title:check?'Verificação concluída':'Execução concluída',rows:m.rows},check);}else if(m.type==='error'){end({title:executionStarted?'Erro no código':'Não foi possível carregar Python',error:m.error},check&&executionStarted);}};
codeWorker.onerror=()=>end({title:'Falha ao iniciar Python',error:'Confira sua conexão. Se estiver abrindo o arquivo diretamente e o navegador bloquear Python, siga o modo servidor local do LEIA-ME. Nenhuma tentativa foi registrada.'});
codeWorker.postMessage({code:d.code,stdin:check?'':d.stdin,check,fn:s.fn,tests:s.tests,unchanged:!!s.unchanged,rules:s.rules||{},returnType:s.returnType||null});}
function pythonWorker(){self.onmessage=async({data})=>{try{let outputSize=0;const emit=t=>{outputSize+=t.length+1;if(outputSize>16000)throw Error('Saída excedeu 16.000 caracteres. Verifique se há um laço imprimindo sem parar.');self.postMessage({type:'output',text:t});};importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/',stdout:emit,stderr:emit});let lines=data.stdin?data.stdin.split('\n'):[],index=0;py.setStdin({stdin:()=>index<lines.length?lines[index++]:undefined});self.postMessage({type:'ready'});py.globals.set('__request_json',JSON.stringify(data));const result=await py.runPythonAsync(`
import json, traceback, math, copy, ast
def decode(value):
    if isinstance(value, dict) and '__int__' in value:
        return int(value['__int__'])
    if isinstance(value, dict) and '__tuple__' in value:
        return tuple(decode(v) for v in value['__tuple__'])
    if isinstance(value, list):
        return [decode(v) for v in value]
    if isinstance(value, dict):
        return {k:decode(v) for k,v in value.items()}
    return value
req = decode(json.loads(__request_json))
if req['check']:
    parsed = ast.parse(req['code'])
    rules = req.get('rules', {})
    if rules.get('noLoops'):
        blocked = (ast.For, ast.AsyncFor, ast.While, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)
        if any(isinstance(node, blocked) for node in ast.walk(parsed)):
            raise ValueError('Restrição da lista: não use for, while ou compreensões com for. Comentários e strings não contam como laços.')
    if rules.get('digitArithmetic'):
        for node in ast.walk(parsed):
            if isinstance(node, ast.Call):
                name = node.func.id if isinstance(node.func, ast.Name) else node.func.attr if isinstance(node.func, ast.Attribute) else ''
                if name in ('int', 'eval', 'exec', 'compile', 'pow'):
                    raise ValueError('Lista 14-G: some dígito por dígito, sem reconstruir o número com int/pow/eval/exec. O transporte com % 10 e // 10 é permitido.')
            if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Pow, ast.Mult)):
                if any(isinstance(v, ast.Constant) and v.value == 10 for v in (node.left, node.right)):
                    raise ValueError('Lista 14-G: não use potências ou multiplicação por 10 para reconstruir os números. Use a soma dos dígitos com transporte.')
def concise(value):
    text = repr(value)
    return text if len(text) <= 220 else text[:217] + '...'
def equal(a, b):
    if isinstance(b, bool):
        return isinstance(a, bool) and a == b
    if isinstance(b, (int, float)):
        return isinstance(a, (int, float)) and not isinstance(a, bool) and math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(b, tuple):
        return isinstance(a, tuple) and len(a) == len(b) and all(equal(x,y) for x,y in zip(a,b))
    if isinstance(b, list):
        return isinstance(a, (list, tuple)) and len(a) == len(b) and all(equal(x,y) for x,y in zip(a,b))
    return type(a) is type(b) and a == b
rows = []
if not req['check']:
    exec(compile(req['code'], '<seu_codigo>', 'exec'), {'__name__':'__main__'})
else:
    compiled = compile(req['code'], '<seu_codigo>', 'exec')
    for args, expected in req['tests']:
        ns = {'__name__':'__teste__'}
        row = {'ok':False, 'input':concise(args), 'expected':concise(expected), 'actual':'—', 'label':'Caso de teste'}
        try:
            exec(compiled, ns)
            func = ns.get(req['fn'])
            if not callable(func):
                raise NameError('Defina a função ' + req['fn'] + ' com o nome pedido no enunciado.')
            values = copy.deepcopy(args)
            result = func(*values)
            row['actual'] = concise(result)
            row['ok'] = equal(result, expected)
            if req.get('returnType') == 'list' and not isinstance(result, list):
                row['ok'] = False
                row['error'] = 'O retorno deve ser uma lista, conforme os testes do enunciado.'
            if req['unchanged'] and values != args:
                row['ok'] = False
                row['error'] = 'A função alterou a lista original; o enunciado pede preservar a entrada.'
            if result is None:
                row['error'] = 'A função retornou None. Confira se você usou return; print apenas exibe a saída.'
            row['label'] = 'Resultado correto' if row['ok'] else 'Resultado diferente do esperado'
        except BaseException:
            row['error'] = traceback.format_exc(limit=3)
            row['label'] = 'Erro durante a execução'
        rows.append(row)
json.dumps(rows, ensure_ascii=False)
`);self.postMessage({type:'result',rows:data.check?JSON.parse(result):null});}catch(err){self.postMessage({type:'error',error:String(err.message||err)});}};}
