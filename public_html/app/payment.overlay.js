(function () {
  let overlayEl = null;
  let currentProductData = null;

  function createOverlay() {
    let overlayRoot = document.getElementById("overlay-root");
    if (!overlayRoot) {
      overlayRoot = document.createElement("div");
      overlayRoot.id = "overlay-root";
      document.body.appendChild(overlayRoot);
    }
    overlayEl = document.createElement("div");
    overlayEl.className = "selennia-overlay";
    overlayEl.innerHTML = `
      <div class="overlay-backdrop"></div>
      <div class="overlay-panel">
        <button class="overlay-close" aria-label="Fermer">×</button>
        <div class="overlay-head">
          <div class="overlay-kicker">Acquisition immédiate</div>
          <h2 id="overlayTitle"></h2>
          <p id="overlayPrice" class="panel-price"></p>
        </div>
        <div class="overlay-body">
          <p>Cette œuvre est disponible à l’acquisition immédiate.</p>
          <p class="muted">Paiement sécurisé via Snipcart. Livraison et certificat d'authenticité inclus.</p>
        </div>
        <div class="overlay-actions">
          <button id="payNowBtn" class="panel-action">Procéder au paiement</button>
          <button class="overlay-secondary">Annuler</button>
        </div>
      </div>
    `;
    overlayRoot.appendChild(overlayEl);
    bindOverlayEvents();
  }

  function bindOverlayEvents() {
    if (!overlayEl) return;
    overlayEl.querySelectorAll(".overlay-close, .overlay-secondary, .overlay-backdrop")
      .forEach(el => el.addEventListener("click", closeOverlay));
    const payBtn = overlayEl.querySelector("#payNowBtn");
    if (payBtn) payBtn.addEventListener("click", handlePayment);
  }

  function openOverlay(title, price, id = null) {
    // NETTOYAGE DE L'ID : Doit correspondre à l'identifiant dans index.html
    const cleanId = id || title
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .toLowerCase()
      .replace(/[«»,]/g, "") 
      .replace(/[^a-z0-9]+/g, "-") 
      .replace(/(^-|-$)/g, ""); 

    const numericPrice = typeof price === "string" 
      ? price.replace(/[^0-9,.]/g, "").replace(",", ".") 
      : price;

    currentProductData = {
      id: cleanId,
      name: title,
      price: parseFloat(numericPrice),
      url: window.location.origin + "/" // URL absolue pour la validation
    };

    console.log("🛒 Produit préparé :", currentProductData.id, "| Prix :", currentProductData.price);

    if (!overlayEl) createOverlay();
    overlayEl.querySelector("#overlayTitle").textContent = title;
    overlayEl.querySelector("#overlayPrice").textContent = price + " €";
    overlayEl.style.display = "flex";
    requestAnimationFrame(() => {
      overlayEl.classList.add("is-visible");
      document.body.classList.add("overlay-open");
    });
  }

  function closeOverlay() {
    if (overlayEl) {
      overlayEl.classList.remove("is-visible");
      document.body.classList.remove("overlay-open");
      setTimeout(() => { overlayEl.style.display = "none"; }, 300);
    }
  }

  async function handlePayment() {
    if (window.Snipcart && currentProductData) {
      try {
        // Ajout au panier via l'API Snipcart
        await window.Snipcart.api.cart.items.add({
          id: currentProductData.id,
          name: currentProductData.name,
          price: currentProductData.price,
          url: currentProductData.url, 
          quantity: 1
        });
        
        console.log("✅ Produit ajouté au panier Snipcart");
        closeOverlay();
        window.Snipcart.api.theme.cart.open();
      } catch (error) {
        console.error("❌ Erreur validation Snipcart :", error);
        alert("Une erreur de validation est survenue. Assurez-vous que le panier est vide et réessayez.");
      }
    } else {
        console.error("❌ Snipcart non chargé ou données produit manquantes.");
    }
  }

  window.openPaymentOverlay = openOverlay;
})();