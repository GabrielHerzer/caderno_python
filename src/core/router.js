"use strict";
// Navegação por hash: cada rota é uma função que devolve o HTML da tela.

function go(route) {
  if (location.hash === "#" + route) render();
  else location.hash = route;
}

function render() {
  const route = location.hash.slice(1) || "inicio";
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.hash === "#" + route);
    if (a.hash === "#" + route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  const pages = {
    inicio: dashboard,
    catalogo: catalog,
    revisao: review,
    simulado: examPage,
    historico: historyPage,
    fontes: sources,
    pratica: practice,
    codigo: codingPage,
  };
  $("#app").innerHTML =
    (!storageOK
      ? '<p class="storage-warning">Armazenamento indisponível ou dados inválidos. O progresso desta sessão pode não persistir. Exporte um backup.</p>'
      : "") + (pages[route] || dashboard)();
  bind();
  bindCoding();
}
