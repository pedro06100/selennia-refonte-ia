from flask import Blueprint, jsonify
from data.catalogue import get_item

products_bp = Blueprint("products", __name__)

@products_bp.route("/api/products/<item_id>", methods=["GET"])
def get_product(item_id):
    """
    Endpoint JSON pour le crawler Snipcart (SPA safe)
    """

    # ⚠️ ON GARDE L'ID TEL QUEL (selennia-1)
    item = get_item(item_id)

    if not item:
        return jsonify({"error": "Produit introuvable"}), 404

    # 💰 Prix STRICTEMENT NUMÉRIQUE
    price = float(item["price"])

    return jsonify({
        "id": item_id,                      # EXACTEMENT le même que data-item-id
        "price": price,                     # NUMÉRIQUE
        "url": f"/api/products/{item_id}",  # URL crawlable par Snipcart
    }), 200
