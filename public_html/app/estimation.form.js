import { AppState, render } from "./app.js";
import { navigate } from "./router.js";

/**
 * =========================================================
 * ESTIMATION — FORMULAIRE AVEC INSCRIPTION OBLIGATOIRE
 * Selennia 2035
 * =========================================================
 */

export function renderEstimationForm() {
  AppState.view = "estimation";

  render(
    `
    <section class="estimation">

      <header class="estimation-header">
        <button class="estimation-back" id="backHome">← Retour</button>

        <h1 class="estimation-title">Interprétation de valeur</h1>
        <p class="estimation-subtitle">
          Première lecture experte assistée par IA.<br/>
          Une seule estimation par collectionneur.
        </p>
      </header>

      <!-- ÉTAPE 1 : INSCRIPTION -->
      <div class="estimation-card">

        <h2 class="estimation-step-title">Identification requise</h2>

        <form id="registrationForm" class="estimation-form">

          <label class="field">
            <span>Prénom</span>
            <input type="text" id="firstName" required />
          </label>

          <label class="field">
            <span>Nom</span>
            <input type="text" id="lastName" required />
          </label>

          <label class="field">
            <span>Email</span>
            <input type="email" id="email" required />
          </label>

          <label class="field">
            <span>Numéro de téléphone</span>
            <input type="tel" id="phone" required />
          </label>

          <p class="estimation-legal">
            Vos informations sont utilisées uniquement dans le cadre de cette expertise.
          </p>

          <button type="submit" class="estimation-submit">
            Valider et accéder à l’estimation
          </button>

        </form>
      </div>

    </section>
    `,
    "home",
    bindRegistrationForm
  );
}

/* =========================================================
   INSCRIPTION UTILISATEUR
========================================================= */

function bindRegistrationForm() {
  document.getElementById("backHome").onclick = () => navigate("intro");

  document.getElementById("registrationForm").onsubmit = async (e) => {
    e.preventDefault();

    const user = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim().toLowerCase(),
      phone: document.getElementById("phone").value.trim(),
    };

    if (!user.firstName || !user.lastName || !user.email || !user.phone) {
      alert("Merci de compléter tous les champs.");
      return;
    }

    AppState.estimationUser = user;

    render(`<p class="muted">Vérification en cours…</p>`, "state");

    try {
      const res = await fetch("/api/estimation/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (!res.ok) {
        render(
          `
          <div class="state">
            <h2>Estimation déjà réalisée</h2>
            <p class="muted">
              Une estimation a déjà été effectuée pour cette adresse email.<br/>
              Pour une nouvelle expertise, merci de contacter Selennia.
            </p>
          </div>
          `,
          "state"
        );
        return;
      }

      renderEstimationObjectForm();

    } catch (err) {
      console.error(err);
      render(`<p class="muted">Erreur de vérification.</p>`, "state");
    }
  };
}

/* =========================================================
   FORMULAIRE OBJET
========================================================= */

function renderEstimationObjectForm() {
  render(
    `
    <section class="estimation">

      <header class="estimation-header">
        <h1 class="estimation-title">Objet à expertiser</h1>
        <p class="estimation-subtitle">
          Décrivez l’objet le plus précisément possible.
        </p>
      </header>

      <div class="estimation-card">
        <form class="estimation-form" id="estimationForm">

          <label class="field">
            <span>Photographie de l’objet</span>
            <input type="file" id="imageInput" accept="image/*" required />
          </label>

          <label class="field">
            <span>Catégorie (optionnel)</span>
            <select id="categoryInput">
              <option value="">—</option>
              <option value="arts-decoratifs">Arts décoratifs</option>
              <option value="arts-de-la-table">Arts de la table</option>
              <option value="verre-cristal">Verre & cristal</option>
              <option value="bureautique">Objets de bureau</option>
            </select>
          </label>

          <label class="field">
            <span>Description libre</span>
            <textarea
              id="descriptionInput"
              rows="4"
              placeholder="Matière, époque supposée, dimensions, provenance…"
            ></textarea>
          </label>

          <button type="submit" class="estimation-submit">
            Lancer l’analyse
          </button>

        </form>
      </div>

    </section>
    `,
    "home",
    bindEstimationForm
  );
}

/* =========================================================
   SOUMISSION OBJET
========================================================= */

function bindEstimationForm() {
  document.getElementById("estimationForm").onsubmit = (e) => {
    e.preventDefault();

    const file = document.getElementById("imageInput").files?.[0];

    if (!file) {
      alert("Merci d’ajouter une photographie.");
      return;
    }

    AppState.estimationPayload = {
      file,
      category: document.getElementById("categoryInput").value,
      description: document.getElementById("descriptionInput").value,
      user: AppState.estimationUser,
    };

    navigate("estimation-analysis");
  };
}
