import { catalogue } from "../../data/catalogue.mock.js";
import { explainValue } from "../../services/ia.service.js";

export const valueState = {
  async render({ id }) {
    const item = catalogue.find(o => o.id === id);
    if (!item) return `<p>Analyse indisponible</p>`;

    const analysis = await explainValue(item);

    return `
      <section class="state">
        <button class="back" onclick="window.__back()">← Retour à la pièce</button>

        <h1>Comprendre la valeur</h1>

        <p class="human">
          ${analysis.reformulation}
        </p>

        <div class="analysis">
          ${analysis.criteria.map(c => `
            <div class="criterion">
              <strong>${c.label}</strong>
              <p>${c.explanation}</p>
            </div>
          `).join("")}
        </div>

        <p class="price-range">
          Valeur cohérente estimée : <strong>${analysis.range}</strong>
        </p>

        <p class="disclaimer">
          ${analysis.disclaimer}
        </p>

        <button class="link" onclick="window.__contact()">
          Approfondir avec un expert Selennia
        </button>
      </section>
    `;
  },

  mount(machine) {
    window.__back = () => {
      history.back?.();
      machine.go("focus", machine.lastData);
    };

    window.__contact = () => {
      machine.go("relation");
    };
  }
};
window.revealAnalysisSequence = revealAnalysisSequence;
