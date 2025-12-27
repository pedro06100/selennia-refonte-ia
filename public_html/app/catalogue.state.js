// states/catalogue.state.js

export const CatalogueState = {
  // Nombre d'œuvres exposées simultanément
  EXPO_SIZE: 12,

  // Accrochage actif (selection, chronologique, etc.)
  activeHang: "selection",

  // ✅ Catégorie active (null = toutes les catégories)
  activeCategory: null,

  // Mémoire curatoriale (anti-repeat)
  recentlyShown: [],

  // Limite mémoire (évite l’épuisement)
  MAX_RECENT: 28,
};

/**
 * Mémorise les œuvres déjà exposées
 * pour éviter les répétitions immédiates
 */
export function rememberShown(ids = []) {
  CatalogueState.recentlyShown = [
    ...ids,
    ...CatalogueState.recentlyShown,
  ]
    // unicité
    .filter((id, i, arr) => arr.indexOf(id) === i)
    // limite mémoire
    .slice(0, CatalogueState.MAX_RECENT);
}
