import { navigate } from "./router.js";

/**
 * =========================================================
 * INTRO — SELENNIA 2035 (ENTRÉE OFFICIELLE)
 * =========================================================
 */

export function renderIntro() {
  const root = document.getElementById("analysis");
  if (!root) return;

  document.body.classList.remove("is-entering");
  root.className = "is-state";

  root.innerHTML = `
    <section class="intro">
      <div class="intro-inner">

        <img
          src="../assets/images/image-objet/logo_svg.png"
          alt="Selennia"
          class="intro-logo"
        />

        <div class="intro-tagline">
          Galerie & expertise d’objets singuliers
        </div>

        <div class="intro-actions">
          <button class="intro-enter" data-action="enter">
            Entrer dans la galerie
          </button>

          <button class="intro-estimate" data-action="estimate">
            Soumettre un objet à l’analyse
          </button>
        </div>

      </div>
    </section>
  `;

  bindIntroActions();
}

/**
 * =========================================================
 * ACTIONS INTRO
 * =========================================================
 */
function bindIntroActions() {
  const intro = document.querySelector(".intro");
  if (!intro) return;

  intro.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;

    intro.classList.add("is-leaving");

    if (action === "enter") {
      document.body.classList.add("is-entering");

      setTimeout(() => {
        // L’entrée logique après intro = catégories
        navigate("categories");
      }, 600);
    }

    if (action === "estimate") {
      setTimeout(() => {
        navigate("estimation");
      }, 600);
    }
  });
}
