import { render, AppState } from "./app.js";
import { navigate } from "./router.js";
import { CatalogueState } from "./catalogue.state.js";

/**
 * =========================
 * FICHE ŒUVRE — VERSION COMMERCIALE
 * =========================
 */
export function renderFiche(item) {
  if (AppState.isLoading) return;
  AppState.isLoading = true;

  AppState.activeItem = item;
  AppState.activeItemId = item?.id ?? null;

  const isSold = Boolean(item?.sold);
  const productId = item.snipcartId; // 
  const price = Number(item.numericPrice || 0);
  const imageUrl = `https://selennia.fr/${item.image.replace(/^\.?\//, "")}`;

  render(
    `
    <section class="item-focus item-split">

      <div class="item-left">
        <button class="back-btn" id="backBtn">← Collection</button>
        <div class="item-hero">
          <img src="${imageUrl}" alt="${escapeHTML(item.title)}" />
        </div>
      </div>

      <div class="item-right">

        <header class="item-head">
          <h2 class="item-title">${escapeHTML(item.title)}</h2>
          ${
            item.description
              ? `<p class="item-narrative">${escapeHTML(item.description)}</p>`
              : ""
          }
        </header>

        <div class="item-price">
          <span class="price-label">Prix Selennia</span>
          <span class="price-value">${item.price || "Sur demande"}</span>
        </div>

        <div class="item-action-bar">
          <div class="action-left">
            <div class="action-label">Acquisition privée</div>
            <div class="action-sub">Œuvre accompagnée par Selennia</div>
          </div>

          <div class="action-right">
            ${
              isSold
                ? `<button class="acquire-btn is-disabled" disabled>
                     Œuvre vendue
                   </button>`
                : `<button
                    class="acquire-btn snipcart-add-item"
                    data-item-id="${productId}"
                    data-item-name="${escapeHTML(item.title)}"
                    data-item-price="${price}"
                    data-item-url="/"
                    data-item-description="${escapeHTML(item.description || "")}"
                    data-item-image="${imageUrl}"
                    data-item-quantity="1"
                    data-item-has-taxes="false"
                    data-item-has-shippable="false"
                  >
                    Acquérir l’œuvre
                  </button>`
            }
          </div>
        </div>

        <section class="item-analysis">
          <div class="analysis-intro">Lecture curatoriale</div>

          <div class="analysis-sequence">
            ${renderInfo("Époque", item.period)}
            ${renderInfo("Matériaux", item.materials)}
            ${renderInfo("État", item.condition)}
          </div>
        </section>

      </div>
    </section>
    `,
    "state",
    () => {
      document.getElementById("backBtn")?.addEventListener("click", () => {
        CatalogueState.restoreIndex = true;
        navigate("catalogue");
      });

      AppState.isLoading = false;
    }
  );
}

/* =========================================================
   UTILS
========================================================= */
function renderInfo(label, value) {
  if (!value) return "";
  return `
    <div class="analysis-step">
      <strong>${label}</strong>
      <p class="muted">${escapeHTML(value)}</p>
    </div>
  `;
}

function escapeHTML(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
