# Python em prática — listas completas recebidas · 04/11/2026

## Abrir e atualizar

Extraia o ZIP inteiro e abra `index.html` no Chrome, Edge ou Firefox. Mantenha todos os arquivos juntos. As questões objetivas e a leitura dos guias funcionam offline. A oficina e a correção do simulado precisam de internet para carregar Python no navegador.

No Windows, você também pode dar dois cliques em `INICIAR.cmd` (requer Python instalado). Ele abre http://127.0.0.1:8765. Mantenha a janela aberta durante o estudo; use Ctrl+C ou feche-a para encerrar. O servidor atende somente neste computador.

Alternativa no terminal, dentro desta pasta:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Para atualizar, exporte um backup pelo histórico, substitua os arquivos na mesma pasta e reabra. Se aparecer a versão antiga, use Ctrl+F5. Preserve o mesmo navegador e endereço: os históricos de arquivo local e de HTTP são separados. Exporte e importe o backup para transferir.

## Catálogo em pastas

As pastas são listas 10, 11, 12, 13, 14 e ENADE. Todos os 33 exercícios recebidos estão liberados, com escrita de código e questões objetivas: lista 10 (13), lista 11 (6), lista 12 (6), lista 13 (3), lista 14 (5). Dentro de uma pasta, filtre por tema ou busque por texto. Lista 9 excluída.

Os cinco blocos foram associados às listas 10–14 na ordem confirmada pelo usuário. As pastas contêm somente exercícios desses materiais. Os 12 treinos anteriores de ENADE/preparação e complementos continuam disponíveis no painel e na revisão, totalizando 45 contratos de programação. Os conteúdos ENADE mantêm seus estados próprios de verificação; receber as listas não valida seus enunciados pendentes.

Atribuições dos originais e licença estão na pasta `fontes`. Ajustes editoriais ficam visíveis em cada exercício e em **Listas e fontes**. Os testes originais foram preservados e complementados com casos de borda.

## Painel e revisão por tema

O painel reforça `endswith`, `replace`, slicing, lógica e laços, mantendo as quatro prioridades. A revisão oferece 22 guias com definição, sintaxe, exemplo comentado, passos, armadilhas e exercícios relacionados.

Abra um tema e clique em **Treinar este tema** para um ciclo focado. O ciclo geral inclui sempre as quatro prioridades. Os erros retornam ao fim da fila uma vez por exercício. A seleção considera as últimas cinco tentativas por exercício: acerto sem ajuda vale 1; com ajuda, 0,5; erro, 0. O mapa usa as últimas 20 tentativas por tema e a porcentagem de acertos sem ajuda.

## Programar e verificar

Abra **Escrever código**, escolha o exercício e siga a assinatura. Escreva sua tentativa e clique em **Verificar meu código**. O site executa casos de teste e mostra entrada, resultado esperado, recebido e erros. São 303 casos nos 45 contratos de programação: 257 casos pertencem aos 33 exercícios recebidos, incluindo os testes fornecidos e casos adicionais.

O editor começa em branco. Código e entradas são salvos automaticamente. Use `return` para entregar o resultado; `print` sozinho não substitui o retorno. Para testar `input()` e `print()`, use **Executar livremente** e preencha as entradas, uma por linha. A execução livre não recebe nota.

Dicas e solução completa exigem uma tentativa anterior e clique explícito. Consultá-las marca ajuda. **Parar** cancela sem registrar nova nota. Depois de carregar Python, cada envio tem limite de cinco segundos. Laços intermináveis são interrompidos.

## Simulado Massanori — oito questões fixas

Toda nova rodada contém, nesta ordem: arroz 4×4 (ENADE 2011 Q5), alturas (ENADE 2021 Q3), count_code (10-G), fixa_primeiro (11-C), busca (11-F), zf (12-J), sort_last (13-C) e anagrama (14-H).

Escreva as oito funções e envie para receber a nota de 0 a 8. Cada questão vale um acerto quando passa em todos os testes. As respostas são salvas automaticamente. Reiniciar simulado descarta as respostas após confirmação e começa novamente com as mesmas oito questões. Soluções completas exigem pedido explícito após a correção.

Simulados antigos de sete questões continuam acessíveis no histórico e podem ser retomados se já estavam pendentes. Ao reiniciar, passa a valer a composição de oito questões. Os testes de mesa seguem disponíveis no catálogo e na revisão.

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

