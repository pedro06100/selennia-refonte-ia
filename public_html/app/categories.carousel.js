import { AppState } from "./app.js";
import { navigate } from "./router.js";

/* =========================================================
   CATÉGORIES — DONNÉES
========================================================= */

const categories = [
  {
    id: "arts-decoratifs",
    index: "01",
    title: "Arts décoratifs",
    subtitle: "Objets de caractère et pièces d’intérieur",
    description:
      "Une sélection d’objets singuliers, pensés pour structurer l’espace et affirmer une présence. Chaque pièce dialogue avec l’architecture intérieure et révèle un usage autant qu’un caractère.",
    image: "../assets/images/categories/artdeco.png",
  },
  {
    id: "arts-de-la-table",
    index: "02",
    title: "Arts de la table",
    subtitle: "Céramiques, faïences et usages anciens",
    description:
      "Des formes utilitaires devenues objets de contemplation. La table comme lieu de transmission, où la matière, le geste et le rituel prennent sens.",
    image: "../assets/images/categories/art-table.png",
  },
  {
    id: "verre-cristal",
    index: "03",
    title: "Verre & Cristal",
    subtitle: "Transparences, reflets et savoir-faire",
    description:
      "Le verre et le cristal captent la lumière et la transforment. Ces pièces jouent avec la transparence, l’épaisseur et le temps, entre maîtrise technique et poésie visuelle.",
    image: "../assets/images/categories/verre.png",
  },
  {
    id: "bureautique",
    index: "04",
    title: "Objets de bureau",
    subtitle: "Écriture, rangement et élégance fonctionnelle",
    description:
      "Des objets conçus pour accompagner le geste et la réflexion. Instruments d’écriture, rangements et accessoires où l’utilité rencontre une forme de permanence.",
    image: "../assets/images/categories/bureau.png",
  },
];

let activeIndex = null;

/* =========================================================
   RENDER
========================================================= */

export function renderCategoryCarousel() {
  const root = document.getElementById("analysis");
  if (!root) return;

  // Reset état catégorie à l’entrée
  AppState.activeCategory = null;
  activeIndex = null;

  root.className = "is-home";
  root.innerHTML = `
    <!-- BOUTON RETOUR INTRO -->
    <button class="categories-back" id="categories-back">
      ← Retour
    </button>

    <section class="category-panels">
      ${categories
        .map(
          (cat, i) => `
        <article 
          class="category-panel" 
          data-index="${i}" 
          data-id="${cat.id}"
          style="background-image:url('${cat.image}')"
        >
          <div class="panel-label">
            <span>${cat.title}</span>
          </div>

          <div class="panel-overlay"></div>

          <div class="panel-content">
            <span class="panel-index">${cat.index}</span>
            <h2 class="panel-title">${cat.title}</h2>
            <p class="panel-subtitle">${cat.subtitle}</p>

            <p class="panel-description">
              ${cat.description}
            </p>

            <button class="panel-enter">
              Explorer →
            </button>
          </div>
        </article>
      `
        )
        .join("")}
    </section>
  `;

  bindPanels();
  bindBackButton();
}

/* =========================================================
   INTERACTIONS
========================================================= */

function bindPanels() {
  const panels = document.querySelectorAll(".category-panel");

  panels.forEach((panel, i) => {
    panel.addEventListener("click", (e) => {
      const btn = e.target.closest(".panel-enter");

      // Clic sur Explorer + panneau actif → navigation
      if (btn && activeIndex === i) {
        AppState.activeCategory = panel.dataset.id;
        navigate("catalogue");
        return;
      }

      // Sinon : expansion du panneau
      setActive(i);
    });
  });
}

function setActive(i) {
  const panels = document.querySelectorAll(".category-panel");

  panels.forEach((p) => p.classList.remove("is-active"));
  panels[i].classList.add("is-active");

  activeIndex = i;
}

/* =========================================================
   BOUTON RETOUR INTRO
========================================================= */

function bindBackButton() {
  const btn = document.getElementById("categories-back");
  if (!btn) return;

  btn.addEventListener("click", () => {
    navigate("intro");
  });
}
