# Login com GitHub e progresso na nuvem (Supabase)

Data: 2026-11-11 · Situação: implementado (projeto `python-para-zumbis`, `wkoorvthqurqbctgotzk`)

## Por que

Hoje o progresso (tentativas, simulados, ciclos de revisão) fica só no `localStorage` do navegador
(`src/core/state.js`, chave `massanori-python-v1`). Trocar de computador ou limpar o navegador perde
tudo, e o único jeito de levar o histórico é exportar e importar um backup JSON à mão.

O objetivo é que os dois usuários do site, João (GitHub `JohnPetros`) e Gabriel (GitHub
`GabrielHerzer`), entrem com a conta do GitHub e encontrem o mesmo progresso em qualquer aparelho.

## Objetivos

- Login com GitHub via Supabase Auth, pedido só quando o usuário faz algo que grava progresso.
- Progresso de cada usuário guardado no Supabase e sincronizado entre aparelhos.
- Ninguém perde dados: o que já está no navegador sobe para a conta no primeiro login.

## Fora do escopo

- Outros provedores de login (Google, e-mail).
- Ranking, compartilhamento ou qualquer visão dos dados de outro usuário.
- Sincronizar rascunhos de código (`codeDrafts`) e o simulado em andamento (`pendingExam`): continuam
  só no navegador.
- Edição colaborativa em tempo real (Supabase Realtime).

## O que não pode acontecer

- O site deixar de funcionar sem conta, sem internet, aberto por `file://` ou com o CDN do Supabase
  fora do ar. Nesses casos ele se comporta exatamente como hoje.
- Uma resposta se perder porque o usuário recusou o login ou porque a gravação na nuvem falhou.
- Um usuário ler ou alterar os dados de outro.
- Login obrigatório para usar qualquer tela.

## Comportamento (decidido na conversa)

1. **Sem conta, tudo funciona como hoje.** Toda gravação continua indo para o `localStorage`.
2. **O diálogo de login aparece na primeira vez que algo é gravado** num navegador sem sessão: responder
   uma questão objetiva, corrigir código, terminar um ciclo de revisão ou um simulado.
   - Botões: "Entrar com GitHub" e "Continuar sem conta".
   - Texto curto: o progresso fica salvo na conta e aparece em qualquer computador.
3. **"Continuar sem conta"**: a ação segue e o diálogo não volta a aparecer sozinho naquele navegador
   (marca guardada no `localStorage`). O menu lateral mostra um aviso discreto, "Salvo só neste
   navegador · Entrar", que abre o mesmo login.
4. **"Entrar com GitHub"**: vai ao GitHub e volta para a mesma tela. O progresso local é mesclado com o
   da conta e enviado. A partir daí, cada gravação vai para o navegador e para a nuvem.
5. **Só João e Gabriel podem gravar na nuvem.** Qualquer pessoa consegue clicar em "Entrar", mas uma
   conta fora da lista recebe uma mensagem ("sua conta do GitHub não está liberada para salvar na
   nuvem"), é desconectada e continua usando o site só com o navegador.
6. **Sair da conta**: os dados ficam na nuvem; o navegador mantém a cópia local que já tinha (marcada
   como da conta que saiu; ver abaixo).

### Decisões minhas (Claude), para conferir

- **A ação grava no navegador antes de o diálogo abrir**, e o diálogo aparece por cima da tela de
  resultado. Assim a resposta nunca depende do login dar certo.
- **O login do GitHub abre numa janela popup**, e a tela de trás não é recarregada. Isso preserva o
  que só existe na memória: ciclo de revisão em andamento, tela de resultado, `codeRecord` (para a dica
  posterior ainda marcar `assisted`) e o resultado do simulado. Usar `signInWithOAuth` com
  `skipBrowserRedirect: true`, abrir a URL num popup a partir do clique no botão (não é bloqueado),
  e a página de retorno troca o código PKCE e fecha a janela; a aba principal recebe a sessão pelo
  `onAuthStateChange` (sessão compartilhada pelo `localStorage` da mesma origem). Se o popup não abrir,
  cair para o redirecionamento normal, que só perde o estado em memória.
- **O progresso local registra a qual conta pertence.** Dados locais sem dono (de antes do login) são
  mesclados na primeira conta que entrar. Se entrar uma conta diferente da dona, não há mesclagem: a cópia
  local antiga é guardada numa chave de backup (como `keepOriginal` já faz) e o navegador passa a mostrar
  o progresso da conta nova. Assim o histórico de um nunca vai parar na conta do outro.
- **Um documento JSON por usuário**, e não uma tabela por tentativa (detalhes abaixo).
- **Região do projeto: São Paulo (`sa-east-1`), plano gratuito**, na organização "Python para Zumbis"
  do Supabase (já existe e está vazia).
- **Ao sair, a cópia local fica.** Os dois usuários usam computadores próprios; apagar o local ao sair
  arriscaria perder o que ainda não subiu.

## Como guardar os dados

O estado de hoje já é um objeto só:
`{version: 1, attempts: [], cycles: 0, exams: [], codeDrafts?, pendingExam?}`. Tentativas não são
só acrescentadas: `coding.js` marca `assisted = true` numa tentativa já gravada quando o aluno pede
dica depois, "Apagar histórico" zera tudo e "Importar backup" substitui tudo.

Por isso, uma tabela com uma linha por usuário guarda o estado sem `codeDrafts` e `pendingExam`:

```
progress (
  user_id    uuid primary key references auth.users on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now()
)
```

com RLS: cada usuário só lê e grava a linha em que `user_id = auth.uid()`, e só se estiver na lista de
autorizados.

### Lista de autorizados

Uma tabela `allowed_github_users (github_id bigint primary key, login text)` com os dois IDs numéricos
do GitHub. A política de RLS confere a identidade do GitHub em `auth.identities` (provider `github`,
`provider_id`) por meio de uma função `security definer`. **Não usar `user_metadata`/`raw_user_meta_data`
para isso**: o próprio usuário consegue alterar esses campos.

### Mesclagem

Ao entrar, ao abrir o site com sessão e quando a aba volta a ficar visível: lê o documento da nuvem,
mescla com o local, grava o resultado nos dois lados. Cada `save()` local agenda o envio (com um pequeno
atraso para juntar gravações seguidas) e o envio sempre lê, mescla e grava.

Regras:

- **Tentativas**: união pela chave `id + time + mode + variant`. Se a mesma tentativa existe dos dois
  lados, `assisted` fica verdadeiro se for verdadeiro em qualquer um.
- **Simulados**: união pela chave `time`.
- **Ciclos**: o maior dos dois valores.
- **Apagar histórico e importar backup** passam a gravar um `baseAt` (instante da troca) no estado.
  Na mesclagem, se os dois lados têm o mesmo `baseAt`, faz a união. Se não, vale o lado com o `baseAt`
  mais recente, mais as tentativas e simulados do outro lado com `time` posterior a esse `baseAt`.
  Sem isso, um aparelho com dados antigos ressuscitaria o histórico apagado.
  - A confirmação de "Apagar histórico" passa a dizer que apaga também na conta, quando houver sessão.
- **A mesclagem nunca descarta registros de exercícios desconhecidos.** Uma cópia do site mais antiga
  (ex.: clone não atualizado aberto pelo INICIAR) não conhece exercícios novos; se ela limpasse o
  documento antes de gravar, apagaria da nuvem tentativas válidas. Então: o documento da nuvem guarda
  tudo; `repairState`/`validateState` se aplicam só à cópia usada pela tela. A validação do que vem da
  nuvem confere só o formato de cada registro, não se o exercício existe nesta versão do conteúdo.
  (Decisão minha.)

## Restrições técnicas

- Site estático, scripts clássicos no escopo global, sem build (ver `index.html`). O cliente do Supabase
  entra como os outros: `@supabase/supabase-js` v2 pelo jsDelivr, versão exata, com `integrity` e
  `crossorigin`, e um teste igual ao do Lucide (`tests/icones.test.js`) que confere versão e hash com o
  pacote do npm.
- URL do projeto e chave pública (publishable/anon) ficam num arquivo versionado
  (ex.: `src/core/supabase-config.js`). Isso é seguro com RLS; a chave secreta nunca entra no repositório.
- O roteador usa o hash da URL (`#catalogo`). O login precisa usar o fluxo PKCE (o retorno vem em
  `?code=` na query) para não brigar com as rotas; depois da troca do código, a query é limpa da URL.
- O login só é oferecido em origem `http(s)`. Em `file://` o diálogo não aparece e o aviso do menu diz
  que é preciso abrir pelo INICIAR ou pelo site publicado.
- Origens que o Supabase precisa aceitar como retorno: `https://gabrielherzer.github.io/caderno_python/`,
  `http://127.0.0.1:8765/` (INICIAR) e a porta de desenvolvimento local em uso.
- Erros de rede ou da nuvem nunca bloqueiam a tela: o dado já está no navegador, e o menu mostra
  "Sem conexão, salvo neste navegador" até o próximo envio dar certo.
- Testes: `npm test` (node:test + jsdom) com um cliente Supabase falso. As políticas de RLS conferidas
  com SQL no projeto real (usuário autorizado, não autorizado e anônimo).

## Passos manuais (só uma pessoa consegue fazer)

- Criar o OAuth App no GitHub (Settings → Developer settings) com a URL de callback do Supabase e
  colar o Client ID e o Client Secret no Supabase (Authentication → Providers → GitHub).
- Configurar Site URL e Redirect URLs no Supabase, se o conector não permitir.
- Aprovar o custo da criação do projeto (plano gratuito).

## Pausa do plano gratuito (decisão minha, sem resposta na conversa)

Só avisar: o menu mostra "Sem conexão, salvo neste navegador" e o README explica como reativar o
projeto. Sem tarefa agendada para mantê-lo ativo.

## O que fica com quem for construir

- Visual do diálogo e do aviso no menu, seguindo o estilo atual (`assets/style.css`, ícones Lucide).
- Atraso exato do envio, mensagens de erro, nomes de funções e arquivos.
- Como organizar o código de sincronização (ex.: `src/core/cloud.js`) e como `save()` chama ele.
