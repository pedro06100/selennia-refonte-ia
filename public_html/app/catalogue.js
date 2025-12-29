import { render, AppState } from "./app.js";
import { catalogue } from "../data/catalogue.mock.js";
import { navigate } from "./router.js";

let activeIndex = 0;

/* =========================================================
   RENDER PRINCIPAL — STYLE GALERIE FOCUS
========================================================= */
export function renderCatalogue() {
  activeIndex = 0;
  const activeCategory = AppState.activeCategory;

  const items = !activeCategory 
    ? catalogue 
    : catalogue.filter(
        (item) => String(item.category) === String(activeCategory)
      );

  AppState.exhibition = items;

  if (items.length === 0) {
    render(`
      <button class="catalogue-back" id="catalogue-back">← Retour</button>
      <div class="catalogue-empty">
        <p>Aucun objet disponible dans cette catégorie.</p>
      </div>
    `, "state", bindBackButton);
    return;
  }

  render(`
    <button class="catalogue-back" id="catalogue-back">← Retour</button>
    
    <section class="catalogue-gallery" id="catalogueGallery">
      <!-- Zone image principale -->
      <div class="gallery-main">
        <div class="gallery-image-wrapper" id="galleryImageWrapper">
          <img id="galleryMainImage" src="" alt="" />
        </div>
        
        <!-- Miniatures -->
        <div class="gallery-thumbnails" id="galleryThumbnails">
          ${items.map((item, i) => `
            <button 
              class="gallery-thumb ${i === 0 ? 'is-active' : ''}" 
              data-index="${i}"
              aria-label="Voir ${escapeHTML(item.title)}"
            >
              <img src="https://selennia.fr/${item.image.replace(/^\.?\//, "")}" alt="" loading="lazy" />
            </button>
          `).join("")}
        </div>
      </div>
      
      <!-- Zone informations produit -->
      <div class="gallery-info" id="galleryInfo">
        <div class="gallery-info-inner">
          <span class="gallery-kicker">Pièce ${activeIndex + 1} / ${items.length}</span>
          <h1 class="gallery-title" id="galleryTitle"></h1>
          <p class="gallery-description" id="galleryDescription"></p>
          
          <div class="gallery-meta" id="galleryMeta"></div>
          
          <div class="gallery-price-block">
            <span class="gallery-price" id="galleryPrice"></span>
          </div>
          
          <div class="gallery-actions">
            <button class="gallery-acquire" id="galleryAcquire">
              Acquérir
            </button>
          </div>
        </div>
      </div>
      
      <!-- Navigation flèches -->
      <button class="gallery-nav gallery-nav-prev" id="galleryPrev" aria-label="Précédent">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="gallery-nav gallery-nav-next" id="galleryNext" aria-label="Suivant">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </section>
  `, "state", () => {
    bindBackButton();
    bindGalleryEvents();
    updateGalleryDisplay(0, false);
  });
}

/* =========================================================
   MISE À JOUR DE L'AFFICHAGE
========================================================= */
function updateGalleryDisplay(index, animate = true) {
  const items = AppState.exhibition;
  if (!items || !items.length) return;
  
  const item = items[index];
  if (!item) return;
  
  activeIndex = index;
  
  const imageUrl = `https://selennia.fr/${item.image.replace(/^\.?\//, "")}`;
  const isSold = Boolean(item.sold);
  
  // Image principale
  const mainImage = document.getElementById("galleryMainImage");
  const imageWrapper = document.getElementById("galleryImageWrapper");
  
  if (animate) {
    imageWrapper.classList.add("is-changing");
    setTimeout(() => {
      mainImage.src = imageUrl;
      mainImage.alt = item.title;
      imageWrapper.classList.remove("is-changing");
    }, 200);
  } else {
    mainImage.src = imageUrl;
    mainImage.alt = item.title;
  }
  
  // Infos produit
  const infoPanel = document.getElementById("galleryInfo");
  if (animate) {
    infoPanel.classList.add("is-changing");
    setTimeout(() => {
      updateInfoContent(item, isSold, items.length);
      infoPanel.classList.remove("is-changing");
    }, 150);
  } else {
    updateInfoContent(item, isSold, items.length);
  }
  
  // Miniatures actives
  document.querySelectorAll(".gallery-thumb").forEach((thumb, i) => {
    thumb.classList.toggle("is-active", i === index);
  });
  
  // Scroll miniature active en vue
  const activeThumb = document.querySelector(".gallery-thumb.is-active");
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

function updateInfoContent(item, isSold, totalItems) {
  document.querySelector(".gallery-kicker").textContent = `Pièce ${activeIndex + 1} / ${totalItems}`;
  document.getElementById("galleryTitle").textContent = item.title;
  document.getElementById("galleryDescription").textContent = item.description || "";
  
  // Métadonnées (dimensions, époque, etc.)
  const metaEl = document.getElementById("galleryMeta");
  const metaParts = [];
  if (item.dimensions) metaParts.push(item.dimensions);
  if (item.period) metaParts.push(item.period);
  if (item.origin) metaParts.push(item.origin);
  metaEl.innerHTML = metaParts.length 
    ? metaParts.map(m => `<span class="meta-tag">${escapeHTML(m)}</span>`).join("") 
    : "";
  
  // Prix
  document.getElementById("galleryPrice").textContent = item.price;
  
  // Bouton acquérir
  const acquireBtn = document.getElementById("galleryAcquire");
  if (isSold) {
    acquireBtn.textContent = "Vendue";
    acquireBtn.disabled = true;
    acquireBtn.classList.add("is-disabled");
  } else {
    acquireBtn.textContent = "Acquérir";
    acquireBtn.disabled = false;
    acquireBtn.classList.remove("is-disabled");
  }
}

/* =========================================================
   ÉVÉNEMENTS
========================================================= */
function bindGalleryEvents() {
  const items = AppState.exhibition;
  
  // Navigation flèches
  document.getElementById("galleryPrev")?.addEventListener("click", () => {
    const newIndex = (activeIndex - 1 + items.length) % items.length;
    updateGalleryDisplay(newIndex);
  });
  
  document.getElementById("galleryNext")?.addEventListener("click", () => {
    const newIndex = (activeIndex + 1) % items.length;
    updateGalleryDisplay(newIndex);
  });
  
  // Miniatures
  document.querySelectorAll(".gallery-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      const index = parseInt(thumb.dataset.index, 10);
      if (index !== activeIndex) {
        updateGalleryDisplay(index);
      }
    });
  });
  
  // Bouton acquérir
  document.getElementById("galleryAcquire")?.addEventListener("click", () => {
    const item = items[activeIndex];
    if (item && !item.sold && window.openPaymentOverlay) {
      window.openPaymentOverlay(item.title, item.price);
    }
  });
  
  // Navigation clavier
  document.addEventListener("keydown", handleKeyNav);
}

function handleKeyNav(e) {
  if (AppState.view !== "catalogue") return;
  
  const items = AppState.exhibition;
  if (!items?.length) return;
  
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    const newIndex = (activeIndex - 1 + items.length) % items.length;
    updateGalleryDisplay(newIndex);
  }
  
  if (e.key === "ArrowRight") {
    e.preventDefault();
    const newIndex = (activeIndex + 1) % items.length;
    updateGalleryDisplay(newIndex);
  }
}

function bindBackButton() {
  document.getElementById("catalogue-back")?.addEventListener("click", () => {
    document.removeEventListener("keydown", handleKeyNav);
    navigate("categories");
  });
}

/* =========================================================
   UTILITAIRES
========================================================= */
function escapeHTML(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}