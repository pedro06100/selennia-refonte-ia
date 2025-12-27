import { initRouter, navigate } from "./router.js";
import { initKeyboard } from "./state-machine.js";
import { catalogue } from "../data/catalogue.mock.js";
import "./payment.overlay.js";

const app = document.getElementById("analysis");

export const AppState = {
  view: null,
  activeCategory: null,
  activeItem: null,
  activeItemId: null,
  exhibition: [],
  isLoading: false,
  index: 0,
  snipcartReady: false,
};

/**
 * RENDER GLOBAL 
 * Nettoyé des manipulations de la div Snipcart
 */
export function render(html, mode = "state", afterRender) {
  if (!app) return;

  app.className = mode === "intro" ? "is-home" : "is-state";
  app.classList.add("view-exit-active");

  setTimeout(() => {
    // On ne change QUE le contenu de <main>, 
    // donc la div #snipcart qui est à côté ne bouge pas.
    app.innerHTML = html;

    app.classList.remove("view-exit-active");
    app.classList.add("view-enter");

    requestAnimationFrame(() => {
      app.classList.add("view-enter-active");
    });

    setTimeout(() => {
      app.classList.remove("view-enter", "view-enter-active");
      if (typeof afterRender === "function") {
        afterRender();
      }
    }, 500);
  }, 280);
}

function initSnipcartDetection() {
  // On vérifie si Snipcart est déjà là (cas du cache)
  if (window.Snipcart && window.Snipcart.readyState === "complete") {
     AppState.snipcartReady = true;
  }

  document.addEventListener("snipcart.ready", () => {
    AppState.snipcartReady = true;
    console.log("🛒 Snipcart prêt");
  });
}

function init() {
  if (!Array.isArray(catalogue) || catalogue.length === 0) {
    render("<p class='muted'>Aucun objet disponible.</p>");
    return;
  }

  initSnipcartDetection();
  initKeyboard();
  initRouter();
  
  navigate("intro");
}

init();