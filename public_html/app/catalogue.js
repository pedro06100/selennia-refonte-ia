import { render, AppState } from "./app.js";
import { catalogue } from "../data/catalogue.mock.js";
import { navigate } from "./router.js";

let activeIndex = 0;

/* =========================================================
   RENDER PRINCIPAL
========================================================= */
export function renderCatalogue() {
  activeIndex = 0;
  const activeCategory = AppState.activeCategory;

  const items = !activeCategory 
    ? catalogue 
    : catalogue.filter(
        (item) => String(item.category) === String(activeCategory)
      );

  AppState.exhibition = items;

  render(
    `
    <button class="catalogue-back" id="catalogue-back">← Retour</button>
    <section class="product-panels" id="productPanels">
      ${items.map(renderProductPanel).join("")}
    </section>
    `,
    "state",
    () => {
      bindPanels();
      bindBackButton();
      setActive(0, false);
    }
  );
}

/* =========================================================
   PANNEAU PRODUIT
========================================================= */
function renderProductPanel(item, index) {
  const productId = item.snipcartId; 
  const isSold = Boolean(item.sold);
  const price = Number(item.numericPrice || 0);
  const imageUrl = `https://selennia.fr/${item.image.replace(/^\.?\//, "")}`;

  // Utilisation de escapeHTML (définie plus bas)
  const titleEscaped = escapeHTML(item.title).replace(/'/g, "\\'");
  const priceEscaped = escapeHTML(item.price).replace(/'/g, "\\'");

  return `
    <article class="product-panel" data-index="${index}">
      <div class="panel-artwork">
        <img src="${imageUrl}" alt="${titleEscaped}" loading="lazy" />
      </div>

      <div class="panel-content">
        <h2 class="panel-title">${titleEscaped}</h2>
        <div class="panel-price">${item.price}</div>

        ${
          isSold
            ? `<button class="panel-action is-disabled" disabled>Vendue</button>`
            : `<button
                class="panel-action snipcart-add-item"
                data-item-id="${productId}"
                data-item-name="${titleEscaped}"
                data-item-price="${price}"
                data-item-url="/"
                data-item-image="${imageUrl}"
                onclick="event.stopPropagation(); if(window.openPaymentOverlay) window.openPaymentOverlay('${titleEscaped}', '${priceEscaped}')"
              >
                Acquérir
              </button>`
        }
      </div>
    </article>
  `;
}

/* =========================================================
   INTERACTIONS & LOGIQUE
========================================================= */
function bindPanels() {
  const container = document.getElementById("productPanels");
  if (!container) return;

  container.querySelectorAll(".product-panel").forEach((panel, index) => {
    panel.addEventListener("click", (e) => {
      if (e.target.closest(".snipcart-add-item")) return;
      setActive(index);
    });
  });
}

function setActive(index, smooth = true) {
  const panels = document.querySelectorAll(".product-panel");
  const container = document.getElementById("productPanels");

  if (!panels.length || !container) return;

  panels.forEach((p) => p.classList.remove("is-active"));
  if (panels[index]) panels[index].classList.add("is-active");

  const panel = panels[index];
  if (!panel) return;

  const offset = panel.offsetLeft - container.clientWidth / 2 + panel.clientWidth / 2;
  container.scrollTo({ left: offset, behavior: smooth ? "smooth" : "auto" });
  activeIndex = index;
}

function bindBackButton() {
  document.getElementById("catalogue-back")?.addEventListener("click", () => navigate("categories"));
}

/**
 * 🛠 FONCTION MANQUANTE — À NE PAS SUPPRIMER
 * Empêche les injections de code et les erreurs de caractères spéciaux
 */
function escapeHTML(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}