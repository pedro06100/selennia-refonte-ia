import os
import hmac
import hashlib
from flask import Blueprint, request, jsonify, current_app
from dotenv import load_dotenv

# =========================================================
# INIT
# =========================================================
load_dotenv()

SNIPCART_SECRET_KEY = os.getenv("SNIPCART_SECRET_KEY")

snipcart_bp = Blueprint("snipcart", __name__)

# =========================================================
# IMPORT CATALOGUE MÉTIER (SOURCE DE VÉRITÉ)
# =========================================================
from data.catalogue import (
    get_item,
    is_item_sold,
    is_price_valid,
    mark_item_as_sold
)

# =========================================================
# UTILS — SIGNATURE CHECK
# =========================================================
def verify_snipcart_signature(req) -> bool:
    """
    Vérifie que la requête provient bien de Snipcart
    En mode DEBUG, on autorise le bypass
    """
    if current_app.debug:
        return True

    if not SNIPCART_SECRET_KEY:
        return False

    signature = req.headers.get("X-Snipcart-Signature")
    if not signature:
        return False

    raw_body = req.get_data()

    computed = hmac.new(
        SNIPCART_SECRET_KEY.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(computed, signature)


# =========================================================
# ROUTE — ORDER VALIDATION (AVANT PAIEMENT)
# =========================================================
@snipcart_bp.route("/api/snipcart/validate", methods=["POST"])
def validate_order():
    # 🔐 Sécurité Snipcart
    if not verify_snipcart_signature(request):
        return jsonify({
            "success": False,
            "errors": ["Signature Snipcart invalide"]
        }), 403

    payload = request.get_json(silent=True) or {}
    event = payload.get("eventName")
    content = payload.get("content", {})

    # On ne traite QUE la validation
    if event != "order.validation":
        return jsonify({"success": True}), 200

    items = content.get("items", [])
    errors = []

    for item in items:
        item_id = item.get("id")
        price = item.get("price")

        if not item_id:
            errors.append("Item sans identifiant")
            continue

        catalogue_item = get_item(item_id)
        if not catalogue_item:
            errors.append(f"Œuvre inconnue ({item_id})")
            continue

        if is_item_sold(item_id):
            errors.append(
                f"L’œuvre « {catalogue_item['title']} » est déjà vendue"
            )
            continue

        if not is_price_valid(item_id, price):
            errors.append(
                f"Prix invalide pour « {catalogue_item['title']} »"
            )
            continue

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 200

    # ✅ Tout est valide (mais PAS encore payé)
    return jsonify({"success": True}), 200


# =========================================================
# ROUTE — ORDER COMPLETED (PAIEMENT CONFIRMÉ)
# =========================================================
@snipcart_bp.route("/api/snipcart/completed", methods=["POST"])
def order_completed():
    # 🔐 Sécurité Snipcart
    if not verify_snipcart_signature(request):
        return jsonify({"success": False}), 403

    payload = request.get_json(silent=True) or {}
    event = payload.get("eventName")
    content = payload.get("content", {})

    if event != "order.completed":
        return jsonify({"success": True}), 200

    items = content.get("items", [])

    for item in items:
        item_id = item.get("id")
        if item_id:
            mark_item_as_sold(item_id)

    return jsonify({"success": True}), 200
