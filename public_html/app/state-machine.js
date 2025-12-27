import { AppState } from "./app.js";
import { navigate } from "./router.js";

export function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (AppState.isLoading) return;

    /* =========================
       GALERIE — ACCROCHAGE ACTIF
    ========================= */
    if (AppState.view === "catalogue") {
      const expo = AppState.exhibition;
      if (!expo || !expo.length) return;

      if (e.key === "ArrowRight") {
        AppState.index = (AppState.index + 1) % expo.length;
        highlight(AppState.index);
      }

      if (e.key === "ArrowLeft") {
        AppState.index =
          (AppState.index - 1 + expo.length) % expo.length;
        highlight(AppState.index);
      }

      if (e.key === "Enter") {
        navigate("fiche", { id: expo[AppState.index].id });
      }
    }

    /* =========================
       SORTIE FICHE
    ========================= */
    if (AppState.view === "item" && e.key === "Escape") {
      navigate("catalogue");
    }
  });
}

function highlight(index) {
  const cards = document.querySelectorAll(".gallery-card");
  cards.forEach((c) => c.classList.remove("is-active"));

  const active = cards[index];
  if (active) {
    active.classList.add("is-active");
    active.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}
