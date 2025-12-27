from flask import Blueprint, request, jsonify
from services.openai_service import explain_value_with_ai
from services.estimation_service import (
    estimation_exists_for_email,
    save_estimation
)
import base64
import json

ia_bp = Blueprint("ia", __name__)

@ia_bp.route("/api/estimation/analyze", methods=["POST"])
def analyze_estimation():
    try:
        # =========================================================
        # 1. RÉCUPÉRATION & VALIDATION UTILISATEUR
        # =========================================================

        user_raw = request.form.get("user")
        if not user_raw:
            return jsonify({"error": "Utilisateur requis"}), 403

        try:
            user = json.loads(user_raw)
        except Exception:
            return jsonify({"error": "Utilisateur invalide"}), 400

        email = (user.get("email") or "").strip().lower()
        first_name = (user.get("firstName") or "").strip()
        last_name = (user.get("lastName") or "").strip()
        phone = (user.get("phone") or "").strip()

        if not email or not first_name or not last_name or not phone:
            return jsonify({"error": "Données utilisateur incomplètes"}), 400

        # =========================================================
        # 2. BLOCAGE — 1 ESTIMATION PAR EMAIL
        # =========================================================

        if estimation_exists_for_email(email):
            return jsonify({
                "error": "Estimation déjà réalisée pour cet email"
            }), 403

        # =========================================================
        # 3. IMAGE OBLIGATOIRE
        # =========================================================

        image = request.files.get("image")
        if not image:
            return jsonify({
                "error": "Image requise"
            }), 400

        image_bytes = image.read()
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        # =========================================================
        # 4. DONNÉES OBJET
        # =========================================================

        item = {
            "category": (request.form.get("category") or "").strip(),
            "description": (request.form.get("description") or "").strip(),
            "image_base64": image_b64,
            "filename": image.filename
        }

        # =========================================================
        # 5. APPEL OPENAI (UNIQUE)
        # =========================================================

        ai_result = explain_value_with_ai(item)

        # =========================================================
        # 6. SAUVEGARDE + VERROUILLAGE
        # =========================================================

        save_estimation(
            user=user,
            item=item,
            result=ai_result
        )

        # =========================================================
        # 7. RETOUR CLIENT
        # =========================================================

        return jsonify(ai_result), 200

    except Exception as e:
        print("🔥 ESTIMATION IA ERROR:", e)
        return jsonify({
            "scene": {},
            "visual_analysis": {},
            "value_range": {"min": "—", "max": "—", "currency": "EUR"},
            "disclaimer": "Erreur serveur temporaire. Merci de réessayer ultérieurement."
        }), 500
