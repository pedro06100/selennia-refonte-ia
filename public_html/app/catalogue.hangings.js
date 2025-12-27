// app/catalogue.hangings.js

function hasAny(haystack = "", needles = []) {
  const s = String(haystack).toLowerCase();
  return needles.some(n => s.includes(String(n).toLowerCase()));
}

function getText(item) {
  return `${item.title || ""} ${item.description || ""} ${item.human || ""}`.trim();
}

// ✅ Accrochages curatoriaux (pas des catégories e-commerce)
export const HANGINGS = {
  selection: {
    label: "Sélection Selennia",
    hint: "Accrochage principal — pièces singulières.",
    pick: (items) => items, // base
  },

  matieres_nobles: {
    label: "Matières nobles",
    hint: "Bois, bronze, laiton, marbre, verre…",
    pick: (items) =>
      items.filter(it =>
        hasAny(getText(it), ["bronze", "laiton", "marbre", "bois", "noyer", "chêne", "verre", "cristal", "céramique", "porcelaine"])
      ),
  },

  formes_radicales: {
    label: "Formes radicales",
    hint: "Silhouettes fortes, lignes tendues.",
    pick: (items) =>
      items.filter(it =>
        hasAny(getText(it), ["brutaliste", "sculptural", "radical", "géométr", "totem", "monolith", "archi", "biseau", "angle", "asymétr"])
      ),
  },

  pieces_silencieuses: {
    label: "Pièces silencieuses",
    hint: "Présence calme, équilibre, minimal.",
    pick: (items) =>
      items.filter(it =>
        hasAny(getText(it), ["minimal", "sobre", "épure", "silenc", "monoch", "calme", "équilibre", "ligne"])
      ),
  },

  entre_art_et_usage: {
    label: "Entre art & usage",
    hint: "Objets fonctionnels à aura d’œuvre.",
    pick: (items) =>
      items.filter(it =>
        hasAny(getText(it), ["lampe", "table", "chaise", "fauteuil", "vase", "miroir", "console", "applique", "buffet", "commode"])
      ),
  },

  traces_du_temps: {
    label: "Traces du temps",
    hint: "Patine, histoire, époque, marques de vie.",
    pick: (items) =>
      items.filter(it =>
        hasAny(getText(it), ["patine", "ancien", "époque", "xix", "xviii", "atelier", "provenance", "restaur", "usure", "trace"])
      ),
  },
};
