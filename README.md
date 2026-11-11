# Caderno Python

**[Abrir o Caderno Python](https://gabrielherzer.github.io/caderno_python/)**

Listas, exercícios e simulados para estudar Python. Todas as listas da Fatec feitas e resolvidas, mais um site para simular as provas do professor Massanori com base no que ele deu em aula.

## O que tem no site

- **Meu painel**: acompanhe seu progresso e comece um ciclo de revisão.
- **Catálogo**: encontre os 62 exercícios das listas 6, 7, 9 e 10 a 14 e os treinos do ENADE. Filtre por tema e veja os exercícios destacados pelo professor.
- **Prática**: responda a questões objetivas ou escreva seu próprio código Python. Envie sua tentativa para ver a correção e os casos de teste. A solução completa só aparece quando você pede.
- **Revisão adaptativa**: reveja os temas em que mais errou, com explicações de sintaxe, exemplos e exercícios para praticar.
- **Simulado**: escreva as funções pedidas e receba a nota quando finalizar. Você pode retomar a rodada ou recomeçar antes de finalizar.
- **Meu histórico**: consulte seus acertos, erros e notas dos simulados. Você pode exportar ou importar um backup do seu progresso.
- **Listas e fontes**: consulte a origem dos exercícios e o que já foi conferido nas referências do ENADE.

## Como abrir

Abra `index.html` no Chrome, Edge ou Firefox, mantendo todos os arquivos juntos. As questões objetivas e a leitura dos guias funcionam offline. A oficina e a correção do simulado precisam de internet para carregar Python no navegador.

No Windows, você também pode dar dois cliques em `INICIAR.cmd` (requer Python instalado). Ele abre http://127.0.0.1:8765. Mantenha a janela aberta durante o estudo; use Ctrl+C ou feche-a para encerrar. O servidor atende somente neste computador.

Alternativa no terminal, na raiz do repositório:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Para atualizar, exporte um backup pelo histórico, substitua os arquivos na mesma pasta e reabra. Se aparecer a versão antiga, use Ctrl+F5. Preserve o mesmo navegador e endereço: os históricos de arquivo local e de HTTP são separados. Exporte e importe o backup para transferir.

## Estrutura do projeto

```
index.html              página única; carrega os scripts na ordem certa
INICIAR.cmd             atalho do Windows para o servidor local
assets/style.css
src/
  data/                 conteúdo: exercícios, lições, contratos de código, listas recebidas
    sources.js          links do INEP e referências ENADE
    exercises.js        treinos autorais e ENADE (EXERCISES)
    lessons.js          guias de revisão por tema (LESSONS)
    code-specs.js       contratos de função e casos de teste (CODE_SPECS)
    supplied-lists.js   listas 6–14 recebidas (SUPPLIED_LISTS)
    merge-lists.js      junta as listas recebidas ao catálogo, lições e contratos
  core/                 base compartilhada
    utils.js            $, esc, byId, toast, shuffle
    state.js            estado salvo no localStorage e estatísticas de progresso
    components.js       pedaços de HTML reaproveitados (heading, card…)
    python-worker.js    Web Worker que roda o Python (Pyodide)
    router.js           go() e render(): cada rota do hash é uma tela
  features/             uma tela por arquivo
    dashboard.js  catalog.js  review.js  practice.js
    coding.js     exam.js     history.js sources.js
  main.js               bind() e action(): eventos da tela; inicia o app
fontes/                 atribuições, licença Apache-2.0 e lista 10 recebida
exercicios/             listas 1–14 resolvidas em Markdown (não há lista 8)
tools/iniciar.py        servidor local usado pelo INICIAR.cmd
```

### Para quem for mexer no código

- **Sem build e sem módulos ES.** Os scripts são clássicos e compartilham o escopo global, para o site continuar abrindo com dois cliques no `index.html` (o navegador bloqueia `import`/`export` em `file://`). Por isso, a ordem dos `<script>` no `index.html` importa: dados → core → telas → `main.js`.
- **Cache:** ao alterar qualquer arquivo, aumente o `?v=` de todos os `<script>` e do CSS no `index.html`.
- **Formatação:** `npm install` e depois `npm run format` (Prettier). `npm run format:check` só confere.
- **Testes:** `npm test` carrega o site no jsdom (`tests/helpers.js`), com um Worker falso no lugar do Pyodide. Ao corrigir um bug, escreva primeiro um teste que falhe.
- **Nova tela:** crie `src/features/<tela>.js` com uma função que devolve o HTML, registre a rota em `render()` (`src/core/router.js`), ligue os eventos em `bind()`/`action()` (`src/main.js`) e adicione o `<script>` antes do `main.js`.
- **Progresso salvo:** fica no `localStorage`, na chave `massanori-python-v1`. Mudanças no formato precisam continuar aceitando os backups antigos (`validateState` em `src/core/state.js`).

# Guia de uso

## Catálogo em pastas

As pastas são as listas 6, 7, 9, 10, 11, 12, 13, 14 e ENADE (o material recebido não tem lista 8). Todos os 62 exercícios recebidos estão liberados, com escrita de código e questões objetivas: lista 6 (9), lista 7 (10), lista 9 (10), lista 10 (13), lista 11 (6), lista 12 (6), lista 13 (3), lista 14 (5). Dentro de uma pasta, filtre por tema ou busque por texto.

As listas 6, 7, 9 e 10 vêm do CodingBat e as listas 11 a 14, da Google’s Python Class. As pastas contêm somente exercícios desses materiais. Os 12 treinos anteriores de ENADE/preparação e complementos continuam disponíveis no painel e na revisão, totalizando 74 contratos de programação. Os conteúdos ENADE mantêm seus estados próprios de verificação; receber as listas não valida seus enunciados pendentes.

Atribuições dos originais e licença estão na pasta `fontes`. Ajustes editoriais ficam visíveis em cada exercício e em **Listas e fontes**. Os testes originais foram preservados e complementados com casos de borda.

## Painel e revisão por tema

O painel reforça `endswith`, `replace`, slicing, lógica e laços, mantendo as quatro prioridades. A revisão oferece 22 guias com definição, sintaxe, exemplo comentado, passos, armadilhas e exercícios relacionados.

Abra um tema e clique em **Treinar este tema** para um ciclo focado. O ciclo geral inclui sempre as quatro prioridades. Os erros retornam ao fim da fila uma vez por exercício. A seleção considera as últimas cinco tentativas por exercício: acerto sem ajuda vale 1; com ajuda, 0,5; erro, 0. O mapa usa as últimas 20 tentativas por tema e a porcentagem de acertos sem ajuda.

## Programar e verificar

Abra **Escrever código**, escolha o exercício e siga a assinatura. Escreva sua tentativa e clique em **Verificar meu código**. O site executa casos de teste e mostra entrada, resultado esperado, recebido e erros. São 556 casos nos 74 contratos de programação: 510 casos pertencem aos 62 exercícios recebidos, incluindo os testes fornecidos e casos adicionais.

O editor começa em branco. Código e entradas são salvos automaticamente. Use `return` para entregar o resultado; `print` sozinho não substitui o retorno. Para testar `input()` e `print()`, use **Executar livremente** e preencha as entradas, uma por linha. A execução livre não recebe nota.

Dicas e solução completa exigem uma tentativa anterior e clique explícito. Consultá-las marca ajuda. **Parar** cancela sem registrar nova nota. Depois de carregar Python, cada envio tem limite de cinco segundos. Laços intermináveis são interrompidos.

## Simulado Massanori — sete respostas em Python

Cada rodada contém exatamente:

- Quatro prioridades: `fixa_primeiro`, verificar anagramas, arroz no tabuleiro e análise de alturas.
- Dois testes de mesa sorteados entre laços, listas/referências e matrizes, com dados variáveis.
- Uma questão de programação sorteada dos 31 exercícios elegíveis das listas 10–14 recebidas (excluindo fixa_primeiro e anagrama, já presentes nas quatro prioridades), sem duplicação e sem virar um terceiro teste de mesa.

Nas cinco questões de programação, escreva a função pedida. Nos dois testes de mesa, acompanhe o algoritmo e escreva `def resposta():` retornando a tabela/lista encontrada. Observe o ponto exato solicitado: fim de cada volta ou depois de cada atribuição. Não há alternativas.

As respostas são salvas enquanto você escreve e podem ser retomadas depois de fechar ou recarregar. A correção ocorre somente ao finalizar as sete questões. Não há dicas ou gabarito durante a rodada. Cada questão vale um acerto se todos os testes passarem; o resultado é de 0 a 7. O relatório também mostra os casos individuais e os erros.

Se Python não carregar, a correção é cancelada sem nota e as respostas são preservadas. Você pode tentar novamente. Erros de sintaxe, execução, retorno incorreto ou tempo de execução excedido contam como erro na questão. Resultados concluídos são registrados uma única vez. Código de referência aparece somente por pedido explícito.

## Histórico e backup

O histórico mostra as últimas 20 tentativas, com opção de ver todas, códigos/rascunhos enviados e acertos/erros. A seção de simulados mostra data, quantidade de acertos, último resultado, melhor proporção de acertos e acesso à correção de cada rodada em código. Resultados objetivos de versões antigas permanecem identificados.

**Exportar backup** inclui tentativas, códigos, simulados concluídos e simulado pendente. **Importar backup** substitui o histórico atual após confirmação. Tudo fica neste navegador. Limpar seus dados ou usar janela anônima pode apagar o progresso.

## Origem e limites

As quatro prioridades foram anunciadas verbalmente segundo seu relato. Sua presença é garantida apenas no simulado do site, nunca na prova real. O simulado, seus contratos de função e testes são adaptações autorais, não uma reprodução confirmada da avaliação do professor.

Verificar anagramas e contar arranjos são problemas distintos. O anúncio sobre contagem permanece ambíguo; o simulado usa a verificação do par, enquanto a contagem fica como extensão no catálogo.

ENADE 2021 D3: tema conferido no padrão oficial. 2011 D5: treino 4×4 conforme relato, com PDF ainda não conferido. 2008 D40: referência e treino preparatório autoral, sem transcrição validada do algoritmo. 2011 D4, 2014 D5 e 2017 D3 têm pendências. Fontes estão na pasta ENADE e em **Listas e fontes**.

O corretor é automático por testes, não uma IA conversacional. Passar nos testes não prova correção para todas as entradas e não avalia estilo nem comprova a abordagem de todo programa possível. Há checagens específicas das restrições de laços e de soma por dígitos, descritas abaixo. Python roda localmente via Pyodide 0.27.7, carregado de `cdn.jsdelivr.net`. O site não envia seu código a uma IA. As soluções existem nos arquivos locais: ocultá-las na interface é um recurso de estudo, não uma proteção para prova sigilosa.

Documentação do interpretador: https://pyodide.org/en/0.27.7/usage/webworker.html

## Verificação desta atualização

Verificados: 1.000 sorteios com composição 4+2+1 sem duplicatas, recuperação de respostas, notas 7/7 e 0/7, envio único, histórico, backup e falha de rede sem nota. As soluções passaram em 303 casos de programação; o mecanismo de teste de mesa foi conferido em 20 variações. Os sorteios cobriram todos os 31 exercícios adicionais elegíveis. No Chrome, uma rodada com cinco funções corretas e dois testes de mesa intencionalmente errados recebeu 5/7, após recuperar as respostas com uma recarga da página.

## Regras e divergências do material recebido

- `multstring` (lista 7): o texto pede n positivo, mas os testes incluem n = 0, que devolve a string vazia.
- `make_tags`, `sem_pontas`, `roda2` (lista 7): o arquivo usa nomes antigos (`tab`, `without_end`, `left2`); valem os nomes das assinaturas.
- `pego_correndo` (lista 9): o texto deixa 81 km/h sem regra (“entre 61 e 80”, “maior que 81”). Seguimos o CodingBat: acima de 80 a multa é grave.
- `alarm_clock` (lista 9): o texto diz `'07:00'`, mas os testes esperam `'7:00'`.
- `near_ten`: a frase “pelo menos dois” contradiz os testes. A correção segue distância **no máximo 2**.
- `lucky_sum`: usamos o nome da assinatura e dos testes, corrigindo o cabeçalho `luck_sum`.
- `busca`: os testes exigem ocorrências sobrepostas. `str.count` sozinho não resolve.
- `soma_na_lista`: dois valores iguais não servem, mesmo em posições diferentes.
- `sum13`: esta lista ignora tudo a partir do primeiro 13, conforme o material recebido.
- `inip2`: método correto `startswith`; retorna expoente, não potência. Incluímos expoente zero como convenção explícita.
- `sort_last`: recebe tuplas reais e retorna uma lista de tuplas, como os testes; o comentário “retorna uma tupla” foi esclarecido.
- `remove_iguais`: adotamos ordem crescente, como nos testes. `list(set(...))` não garante essa ordem. O treino complementar `sem_repetidos` preserva a primeira ocorrência e permanece separado.
- `derivada`: para constante ou entrada vazia, a representação agora é `[]`, conforme a abordagem enviada; a versão antiga do site usava `[0]`.
- `soma`: opera por dígitos com transporte, sem reconstruir inteiros. O código recebido tem um problema em transporte em cascata; a referência foi corrigida e os testes adicionais detectam o erro.
- `anagrama` e `fila_tijolos`: sem for, while ou compreensões. A estrutura do código é examinada; essas palavras em comentários ou strings não são tratadas como laços.

Na soma invertida, o corretor detecta chamadas int/pow/eval/exec e potências ou multiplicações por 10 que reconstruiriam números. É uma checagem didática de formas comuns, não uma análise completa de todas as formas de conversão. Operações nos dígitos com % 10 e // 10 são permitidas. A descrição dos testes inclui notas sobre essas decisões.

Inteiros grandes e tuplas dos testes são preservados por uma representação que evita arredondamento no JavaScript. Em particular, o teste de zf com 90000000000000000010 chega ao Python como inteiro exato.
