import os
import json
from dotenv import load_dotenv
from openai import OpenAI, OpenAIError

# =========================================================
# INIT
# =========================================================

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY manquante")

client = OpenAI(api_key=OPENAI_API_KEY)

# =========================================================
# SERVICE IA — ESTIMATION SELENNIA (VERROUILLÉ)
# =========================================================

def explain_value_with_ai(item: dict) -> dict:
    """
    Estimation Selennia 2035
    - 1 appel IA maximum
    - JSON strict
    - Tokens minimisés
    - Aucun champ superflu
    """

    image_b64 = item.get("image_base64")
    has_image = bool(image_b64)

    # =====================================================
    # PROMPT STRICT SELENNIA
    # =====================================================

    prompt = f"""
Tu es expert en art, antiquités et objets décoratifs.

Tu écris comme un expert de galerie contemporaine :
sobre, prudent, précis, jamais sensationnaliste.

{"Analyse visuelle réelle de l'objet à partir de l'image."
 if has_image else
 "Analyse textuelle uniquement, sans image."}

RÈGLES ABSOLUES :
- Réponds UNIQUEMENT en JSON
- Aucun commentaire hors JSON
- Aucun champ vide
- Ton professionnel, calme, crédible
- Valeurs prudentes

FORMAT JSON EXACT À RESPECTER :

{{
  "scene": {{
    "opening": "Première lecture visuelle synthétique.",
    "analysis": "Analyse curatoriale de l’objet.",
    "projection": "Projection prudente de valeur."
  }},
  "visual_analysis": {{
    "materials": "…",
    "period_estimation": "…",
    "condition": "…",
    "confidence": 0.0
  }},
  "value_range": {{
    "min": 0,
    "max": 0,
    "currency": "EUR"
  }},
  "disclaimer": "Mention professionnelle responsable."
}}

CONTEXTE :
- Catégorie : {item.get("category") or "non précisée"}
- Description : {item.get("description") or "aucune"}
"""

    try:
        # =================================================
        # APPEL OPENAI
        # =================================================

        if has_image:
            response = client.responses.create(
                model="gpt-4.1",
                input=[{
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": prompt},
                        {
                            "type": "input_image",
                            "image_url": f"data:image/jpeg;base64,{image_b64}"
                        }
                    ]
                }],
                temperature=0.25,
                max_output_tokens=650,
            )
        else:
            response = client.responses.create(
                model="gpt-4.1-mini",
                input=prompt,
                temperature=0.3,
                max_output_tokens=500,
            )

        content = (response.output_text or "").strip()
        data = json.loads(content)

        # =================================================
        # GARDE-FOU STRUCTURE
        # =================================================

        return {
            "scene": {
                "opening": data.get("scene", {}).get("opening", ""),
                "analysis": data.get("scene", {}).get("analysis", ""),
                "projection": data.get("scene", {}).get("projection", "")
            },
            "visual_analysis": {
                "materials": data.get("visual_analysis", {}).get("materials", "Indéterminés"),
                "period_estimation": data.get("visual_analysis", {}).get("period_estimation", "Non déterminée"),
                "condition": data.get("visual_analysis", {}).get("condition", "État à confirmer"),
                "confidence": float(data.get("visual_analysis", {}).get("confidence", 0.3))
            },
            "value_range": {
                "min": int(data.get("value_range", {}).get("min", 0)),
                "max": int(data.get("value_range", {}).get("max", 0)),
                "currency": "EUR"
            },
            "disclaimer": data.get(
                "disclaimer",
                "Estimation indicative générée automatiquement, sans examen physique de l’objet."
            )
        }

    # =====================================================
    # FALLBACK PREMIUM — JAMAIS DE CRASH
    # =====================================================

    except (json.JSONDecodeError, ValueError, OpenAIError, Exception) as e:
        print("⚠️ SELENNIA IA FALLBACK:", e)

        return {
            "scene": {
                "opening": "L’objet a bien été reçu.",
                "analysis": "Les informations disponibles ne permettent pas une analyse complète.",
                "projection": "Aucune projection de valeur fiable ne peut être établie."
            },
            "visual_analysis": {
                "materials": "Indéterminés",
                "period_estimation": "Non déterminée",
                "condition": "État à confirmer",
                "confidence": 0.2
            },
            "value_range": {
                "min": 0,
                "max": 0,
                "currency": "EUR"
            },
            "disclaimer": "Analyse automatique indisponible ou incomplète."
        }
