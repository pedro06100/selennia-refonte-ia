import { renderCatalogue } from "./catalogue.js";
import { renderCategoryCarousel } from "./categories.carousel.js";
import { renderIntro } from "./intro.js";
import { renderEstimationForm } from "./estimation.form.js";
import { renderEstimationAnalysis } from "./estimation.analysis.js";
import { AppState } from "./app.js";

/**
 * =========================================================
 * ROUTES — SELENNIA 2035 (FIXED)
 * =========================================================
 */

const routes = {
  /* =========================
      INTRO / HOME
  ========================= */
  intro: () => {
    AppState.view = "intro";
    AppState.activeItem = null;
    AppState.activeItemId = null;
    AppState.activeCategory = null;

    renderIntro();
  },

  home: () => {
    routes.intro();
  },

  /* =========================
      CATÉGORIES
  ========================= */
  categories: () => {
    AppState.view = "categories";
    AppState.activeItem = null;
    AppState.activeItemId = null;

    renderCategoryCarousel();
  },

  /* =========================
      CATALOGUE / ŒUVRES
  ========================= */
  catalogue: () => {
    // 💡 LOGIQUE CORRIGÉE : 
    // On ne bloque plus l'accès. Si aucune catégorie n'est choisie, 
    // on laisse 'renderCatalogue' décider d'afficher "Tout" ou un message vide.
    
    AppState.view = "catalogue";
    AppState.activeItem = null;
    AppState.activeItemId = null;

    // Optionnel : Définir une catégorie par défaut si vide
    // if (!AppState.activeCategory) AppState.activeCategory = "all";

    renderCatalogue();
  },

  /* =========================
      ESTIMATION — FORMULAIRE
  ========================= */
  estimation: () => {
    AppState.view = "estimation";
    AppState.activeItem = null;
    AppState.activeItemId = null;
    AppState.activeCategory = null;

    renderEstimationForm();
  },

  /* =========================
      ESTIMATION — ANALYSE
  ========================= */
  "estimation-analysis": ({ result }) => {
    AppState.view = "estimation-analysis";
    renderEstimationAnalysis(result);
  },
};

/* =========================
    NAVIGATION SPA
========================= */
export function navigate(view, params = {}) {
  const handler = routes[view];

  if (!handler) {
    console.warn(`[Router] Vue inconnue : ${view} → redirection intro`);
    routes.intro();
    return;
  }

  // Debug pour voir quelle vue est appelée dans la console
  console.log(`[Router] Navigation vers : ${view}`);
  handler(params);
}

/* =========================
    INIT
========================= */
export function initRouter() {
  // Prêt pour History API / deep linking
  console.log("[Router] Initialisé");
}