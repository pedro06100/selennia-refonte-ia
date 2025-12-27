import smtplib
import os
from email.message import EmailMessage
from datetime import datetime

DESTINATION_EMAIL = "selennia.boutique@gmail.com"

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_estimation_email(payload: dict) -> None:
    if not SMTP_USER or not SMTP_PASSWORD:
        raise RuntimeError("SMTP non configuré")

    user = payload["user"]
    item = payload["item"]
    result = payload["result"]

    scene = result.get("scene", {})
    visual = result.get("visual_analysis", {})
    value = result.get("value_range", {})

    msg = EmailMessage()
    msg["Subject"] = f"[Selennia] Nouvelle estimation — {user['first_name']} {user['last_name']}"
    msg["From"] = f"Selennia <{SMTP_USER}>"
    msg["To"] = DESTINATION_EMAIL

    # TEXTE SIMPLE (fallback)
    msg.set_content(
        f"""
NOUVELLE ESTIMATION SELENNIA

Client :
{user['first_name']} {user['last_name']}
Email : {user['email']}
Téléphone : {user['phone']}

Objet :
Catégorie : {item.get('category')}
Description : {item.get('description')}

Estimation :
{value.get('min')} – {value.get('max')} EUR

Confiance : {int((visual.get('confidence', 0)) * 100)}%

Date : {datetime.utcnow().strftime("%d/%m/%Y %H:%M")}
"""
    )

    # HTML PREMIUM
    msg.add_alternative(
        f"""
<html>
<body style="font-family: Arial, sans-serif; background:#f6f5f2; padding:30px;">
  <div style="max-width:700px;margin:auto;background:#ffffff;border-radius:14px;padding:28px;">

    <h2>Nouvelle estimation Selennia</h2>

    <h3>Client</h3>
    <p>
      <strong>{user['first_name']} {user['last_name']}</strong><br/>
      {user['email']}<br/>
      {user['phone']}
    </p>

    <h3>Lecture visuelle</h3>
    <p>{scene.get('opening')}</p>

    <ul>
      <li><strong>Matériaux :</strong> {visual.get('materials')}</li>
      <li><strong>Période :</strong> {visual.get('period_estimation')}</li>
      <li><strong>État :</strong> {visual.get('condition')}</li>
      <li><strong>Confiance :</strong> {int((visual.get('confidence',0))*100)}%</li>
    </ul>

    <h3>Interprétation Selennia</h3>
    <p>{scene.get('analysis')}</p>

    <h3>Projection de valeur</h3>
    <p>{scene.get('projection')}</p>

    <div style="margin:24px 0;padding:18px;border-radius:12px;background:#f4f1e9;">
      <strong>Fourchette estimative :</strong><br/>
      {value.get('min')} – {value.get('max')} EUR
    </div>

    <p style="font-size:12px;color:#777;">
      {result.get('disclaimer')}
    </p>

  </div>
</body>
</html>
""",
        subtype="html",
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
