export const bootState = {
  render() {
    return `
      <section class="state">
        <p>Selennia</p>
        <h1>Prenez un instant.</h1>
      </section>
    `;
  },

  mount(machine) {
    setTimeout(() => {
      machine.go("intention");
    }, 1200);
  }
};
