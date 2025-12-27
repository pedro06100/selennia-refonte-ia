import { catalogue } from "../../data/catalogue.mock.js";
import { objectFocus } from "../../components/object-focus.js";

export const focusState = {
  render({ id }) {
    const item = catalogue.find(o => o.id === id);

    return item
      ? objectFocus(item)
      : `<p>Objet introuvable</p>`;
  },

  mount(machine) {
    window.__back = () => {
      machine.go("catalogue");
    };

    window.__understand = (id) => {
      machine.go("value", { id });
    };
  }
};
