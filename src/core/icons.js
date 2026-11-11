"use strict";
// Ícones do Lucide (https://lucide.dev), carregados do CDN no index.html (lucide@0.469.0).
// icon("nome") deixa um <i data-icon="nome"> no HTML; drawIcons troca cada um pelo SVG do Lucide,
// herdando a cor e o tamanho do texto em volta. Os ícones são decorativos: o texto ao lado diz o
// que eles significam. Sem internet, o CDN não carrega e os ícones simplesmente não aparecem.

function icon(name, cls = "") {
  return `<i data-icon="${name}" class="icon${cls ? " " + cls : ""}" aria-hidden="true"></i>`;
}

const pascalCase = (name) => name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

function drawIcons() {
  if (!window.lucide) return;
  for (const el of document.querySelectorAll("i[data-icon]")) {
    const node = lucide.icons[pascalCase(el.dataset.icon)];
    if (!node) continue;
    const svg = lucide.createElement(node);
    svg.setAttribute("class", el.getAttribute("class"));
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    el.replaceWith(svg);
  }
}

// As telas são redesenhadas com innerHTML; desenha os ícones novos a cada mudança no DOM. O SVG
// gerado não tem data-icon, então a troca não dispara outra rodada.
new MutationObserver(drawIcons).observe(document.body, { childList: true, subtree: true });
drawIcons();
