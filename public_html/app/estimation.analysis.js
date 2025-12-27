import { AppState, render } from "./app.js";
import { navigate } from "./router.js";

export async function renderEstimationAnalysis() {
  const payload = AppState.estimationPayload;

  if (!payload || !payload.user || !payload.file) {
    render(
      `
      <div class="state">
        <h2>Accès non autorisé</h2>
        <p class="muted">
          Cette page d’analyse n’est accessible qu’après une demande valide.
        </p>
      </div>
      `,
      "state"
    );
    return;
  }

  /* =========================================================
     LOADER
  ========================================================= */

  render(
    `
    <div class="state estimation-loader">
      <div class="loader-ring"></div>
      <p class="loader-title">Analyse Selennia</p>
      <p class="muted">Lecture experte et interprétation curatoriale…</p>
    </div>
    `,
    "state"
  );

  try {
    const formData = new FormData();
    formData.append("image", payload.file);
    formData.append("category", payload.category || "");
    formData.append("description", payload.description || "");
    formData.append("user", JSON.stringify(payload.user));

    const response = await fetch("/api/estimation/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    const scene = data.scene || {};
    const visual = data.visual_analysis || {};
    const range = data.value_range || {};
    const confidence = Math.round((visual.confidence || 0) * 100);

    render(
      `
      <section class="estimation-result">

        <!-- HEADER -->
        <header class="estimation-header">
          <h1 class="estimation-title">Analyse Selennia</h1>
          <p class="estimation-subtitle">
            Cette estimation est unique et a été transmise à notre équipe.
          </p>
        </header>

        <!-- LECTURE VISUELLE -->
        <section class="estimation-section">
          <h3 class="section-title">Lecture visuelle</h3>
          <p class="section-text">${escapeHTML(scene.opening)}</p>

          <ul class="visual-list">
            <li><strong>Matériaux</strong> : ${escapeHTML(visual.materials)}</li>
            <li><strong>Période</strong> : ${escapeHTML(visual.period_estimation)}</li>
            <li><strong>État</strong> : ${escapeHTML(visual.condition)}</li>
            <li><strong>Confiance</strong> : ${confidence}%</li>
          </ul>
        </section>

        <!-- INTERPRÉTATION -->
        <section class="estimation-section">
          <h3 class="section-title">Interprétation Selennia</h3>
          <p class="section-text">${escapeHTML(scene.analysis)}</p>
        </section>

        <!-- PROJECTION -->
        <section class="estimation-section">
          <h3 class="section-title">Projection de valeur</h3>
          <p class="section-text">${escapeHTML(scene.projection)}</p>
        </section>

        <!-- VALEUR -->
        <section class="estimation-value">
          <span class="value-label">Fourchette indicative</span>
          <span class="value-amount">
            ${range.min} – ${range.max} ${range.currency || "EUR"}
          </span>
          <span class="value-confidence">
            Confiance estimée : ${confidence}%
          </span>
        </section>

        <!-- DISCLAIMER -->
        <section class="estimation-disclaimer">
          ${escapeHTML(data.disclaimer)}
        </section>

        <!-- ACTION -->
        <div class="estimation-actions">
          <button class="estimation-exit" id="exitEstimation">
            Retour à la galerie
          </button>
        </div>

      </section>
      `,
      "home",
      () => {
        document.getElementById("exitEstimation").onclick = () => {
          AppState.estimationPayload = null;
          navigate("home");
        };
      }
    );
  } catch (e) {
    render(
      `
      <div class="state">
        <h2>Analyse indisponible</h2>
        <p class="muted">Une erreur est survenue.</p>
      </div>
      `,
      "state"
    );
  }
}

function escapeHTML(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
