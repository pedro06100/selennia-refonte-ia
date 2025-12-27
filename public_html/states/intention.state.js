export const intentionState = {
  render() {
    return `
      <section class="state">
        <h1>Que souhaitez-vous aujourd’hui ?</h1>

        <div class="options">
          <button onclick="window.__go('explore')">
            Explorer une sélection
          </button>
          <button onclick="window.__go('understand')">
            Comprendre la valeur
          </button>
          <button onclick="window.__go('estimate')">
            Estimer une pièce
          </button>
        </div>
      </section>
    `;
  },

  mount(machine) {
    window.__go = (next) => {
      machine.go(next);
    };
  }
};
