import { navigate } from "./router.js";

/**
 * =========================
 * VUE — FICHE OBJET (FOCUS)
 * =========================
 */
export function objectFocus(item) {
  return `
    <section class="state item-focus">

      <button class="back-btn" data-action="back">
        ← Retour à la galerie
      </button>

      <div class="item-hero">
        <img src="${item.image}" alt="${item.title}" />
      </div>

      <h2>${item.title}</h2>

      ${item.human ? `
        <p class="item-narrative">
          ${item.human}
        </p>
      ` : ""}

      <div class="item-analysis">

        <div class="analysis-sequence">

          ${item.criteria?.map(
            c => `
              <div class="analysis-step">
                <strong>${c.label}</strong>
                <p class="muted">${c.comment}</p>
              </div>
            `
          ).join("") || ""}

          ${item.range ? `
            <div class="analysis-step analysis-range">
              Valeur estimée : ${item.range}
            </div>
          ` : ""}

          ${item.expert ? `
            <div class="analysis-step analysis-human">
              ${item.expert}
            </div>
          ` : ""}

        </div>

      </div>

    </section>
  `;
}

/**
 * =========================
 * BINDINGS — FICHE OBJET
 * =========================
 */
export function bindObjectFocus() {
  const back = document.querySelector("[data-action='back']");
  if (back) {
    back.addEventListener("click", () => {
      navigate("catalogue");
    });
  }
}
window.bindObjectFocus = bindObjectFocus;
