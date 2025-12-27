# api/data/catalogue.py

CATALOGUE = {
    "selennia-1":  {"title": "Drapeau Vaudou « La Sirène », signé AZOR", "price": 1000.00, "sold": False},
    "selennia-2":  {"title": "Drapeau vaudou perlé – Figure stylisée", "price": 500.00, "sold": False},
    "selennia-3":  {"title": "Drapeau vaudou perlé – Figure rituelle encadrée", "price": 500.00, "sold": False},
    "selennia-4":  {"title": "« Champs de blé avec cyprès », d’après Vincent van Gogh", "price": 800.00, "sold": False},
    "selennia-5":  {"title": "« Amandier en fleurs », d’après Vincent van Gogh", "price": 600.00, "sold": False},
    "selennia-6":  {"title": "Lucien Henry – Paysage à la rivière", "price": 2400.00, "sold": False},
    "selennia-7":  {"title": "Michel Jarry – Port de Villefranche", "price": 650.00, "sold": False},
    "selennia-8":  {"title": "Émile Morel – Le Port du Havre", "price": 950.00, "sold": False},
    "selennia-9":  {"title": "Cheval chinois en bois et os", "price": 650.00, "sold": False},
    "selennia-10": {"title": "Buste africain en bois sculpté", "price": 720.00, "sold": False},
    "selennia-11": {"title": "Michel Jarry – Sculpture féminine stylisée", "price": 1100.00, "sold": False},
    "selennia-12": {"title": "Fauteuil « Voltaire » restauré", "price": 500.00, "sold": False},
    "selennia-13": {"title": "Miroir Soleil à miroir bombé", "price": 380.00, "sold": False},
    "selennia-14": {"title": "Paire de plaques murales dorées – Scènes pastorales", "price": 190.00, "sold": False},
    "selennia-15": {"title": "Paire de coqs décoratifs en métal – Michel Jarry", "price": 1200.00, "sold": False},

    "selennia-28": {"title": "Encrier Tharaud Limoges Art Déco", "price": 320.00, "sold": False},
    "selennia-29": {"title": "Encrier en laiton avec boîtier à timbres", "price": 480.00, "sold": False},

    "selennia-30": {"title": "Série de 6 pots à épices en faïence", "price": 160.00, "sold": False},
    "selennia-31": {"title": "Assiettes Limoges à liseret doré", "price": 240.00, "sold": False},
    "selennia-32": {"title": "Paire de bougeoirs Gien en faïence", "price": 450.00, "sold": False},
    "selennia-36": {"title": "Paire de pots d’apothicaire en faïence", "price": 110.00, "sold": False},

    "selennia-33": {"title": "Coupe en cristal taillé et porcelaine décorée", "price": 390.00, "sold": False},
    "selennia-34": {"title": "Paire de vases Art Déco – Scailmont", "price": 350.00, "sold": False},
    "selennia-37": {"title": "Vase en cristal rouge de Murano", "price": 240.00, "sold": False},
    "selennia-38": {"title": "Vase White Cristal – Verre soufflé translucide", "price": 150.00, "sold": False},
}


def get_item(item_id: str):
    return CATALOGUE.get(item_id)


def is_item_sold(item_id: str) -> bool:
    item = get_item(item_id)
    return bool(item and item.get("sold", False))


def is_price_valid(item_id: str, price) -> bool:
    item = get_item(item_id)
    if not item:
        return False
    try:
        return round(float(price), 2) == round(float(item["price"]), 2)
    except (ValueError, TypeError):
        return False


def mark_item_as_sold(item_id: str):
    if item_id in CATALOGUE:
        CATALOGUE[item_id]["sold"] = True
