import json
import os
from datetime import datetime
from flask import current_app
from services.mail_service import send_estimation_email

# =========================================================
# CONFIGURATION SIMPLE (FILE-BASED STORAGE)
# =========================================================

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data", "estimations")

os.makedirs(DATA_DIR, exist_ok=True)


# =========================================================
# HELPERS
# =========================================================

def _email_to_filename(email: str) -> str:
    """
    Transforme un email en nom de fichier safe
    """
    return email.replace("@", "_at_").replace(".", "_").lower() + ".json"


def _get_estimation_path(email: str) -> str:
    return os.path.join(DATA_DIR, _email_to_filename(email))


# =========================================================
# PUBLIC API
# =========================================================

def estimation_exists_for_email(email: str) -> bool:
    """
    Vérifie si une estimation existe déjà pour cet email
    """
    if not email:
        return True

    path = _get_estimation_path(email)
    return os.path.exists(path)


def save_estimation(user: dict, item: dict, result: dict) -> None:
    """
    Sauvegarde définitive de l’estimation + envoi email
    """
    email = user.get("email")
    if not email:
        raise ValueError("Email utilisateur manquant")

    payload = {
        "meta": {
            "created_at": datetime.utcnow().isoformat(),
            "source": "selennia-2035",
        },
        "user": {
            "first_name": user.get("firstName"),
            "last_name": user.get("lastName"),
            "email": email,
            "phone": user.get("phone"),
        },
        "item": {
            "category": item.get("category"),
            "description": item.get("description"),
            "filename": item.get("filename"),
        },
        "result": result,
    }

    # =========================================================
    # 1. SAUVEGARDE LOCALE (VERROUILLAGE)
    # =========================================================

    path = _get_estimation_path(email)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    # =========================================================
    # 2. ENVOI EMAIL (CRITIQUE BUSINESS)
    # =========================================================

    try:
        send_estimation_email(payload)
    except Exception as e:
        # L’estimation est déjà verrouillée même si l’email échoue
        print("⚠️ EMAIL ESTIMATION ERROR:", e)
