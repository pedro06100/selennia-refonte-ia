// app/catalogue.engine.js
import { CatalogueState, rememberShown } from "./catalogue.state.js";
import { HANGINGS } from "./catalogue.hangings.js";
import { AppState } from "./app.js";

/* =========================================================
   HELPERS
========================================================= */

// Shuffle robuste (Fisher–Yates)
function shuffle(arr = []) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ID canonique (source de vérité)
export function getId(item) {
  return item?.id ?? item?._id ?? item?.slug ?? item?.title;
}

// Supprime les doublons par ID
function uniqById(items = []) {
  const seen = new Set();
  return items.filter((it) => {
    const id = getId(it);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/* =========================================================
   ACCROCHAGES DISPONIBLES
========================================================= */

export function getHangOptions() {
  return Object.entries(HANGINGS).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    hint: cfg.hint,
  }));
}

/* =========================================================
   FILTRE CATÉGORIE (SOURCE DE VÉRITÉ)
========================================================= */

function filterByActiveCategory(items = []) {
  const activeCategory = AppState.activeCategory;

  // Pas de catégorie = pas de galerie
  if (!activeCategory) return [];

  return items.filter(
    (item) => String(item.category) === String(activeCategory)
  );
}

/* =========================================================
   CŒUR — CONSTRUCTION DE L’EXPOSITION
========================================================= */

export function buildExhibition(allItems = [], hangKey) {
  // Sécurité : aucune donnée
  if (!Array.isArray(allItems) || allItems.length === 0) {
    return [];
  }

  // 🚨 FILTRE CATÉGORIE AVANT TOUT
  const categoryPool = filterByActiveCategory(allItems);

  if (categoryPool.length === 0) {
    console.warn(
      "[Catalogue] Aucun objet pour la catégorie :",
      AppState.activeCategory
    );
    return [];
  }

  // Accrochage actif ou fallback
  const hang =
    HANGINGS?.[hangKey] && typeof HANGINGS[hangKey].pick === "function"
      ? HANGINGS[hangKey]
      : HANGINGS.selection;

  // Base nettoyée (catégorie uniquement)
  const base = uniqById(categoryPool);

  // Pool issu de l’accrochage
  let pool = uniqById(hang.pick(base));

  // Complément si accrochage trop restrictif
  if (pool.length < CatalogueState.EXPO_SIZE) {
    const missing = base.filter(
      (it) => !pool.some((p) => getId(p) === getId(it))
    );
    pool = [...pool, ...missing];
  }

  // Anti-repeat (mémoire curatoriale)
  const recent = new Set(CatalogueState.recentlyShown || []);
  const fresh = pool.filter((it) => !recent.has(getId(it)));
  const fallback = pool.filter((it) => recent.has(getId(it)));

  // Mélange contrôlé
  const mixed = [...shuffle(fresh), ...shuffle(fallback)];

  // Exposition finale
  const expo = mixed.slice(0, CatalogueState.EXPO_SIZE);

  // Mémorisation (anti-repeat)
  rememberShown(expo.map(getId));

  return expo;
}

/* =========================================================
   MUTATION D’ÉTAT — ACCROCHAGE ACTIF
========================================================= */

export function setActiveHang(key) {
  if (HANGINGS[key]) {
    CatalogueState.activeHang = key;
  } else {
    CatalogueState.activeHang = "selection";
  }
}
