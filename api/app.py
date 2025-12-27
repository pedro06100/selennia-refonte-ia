from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# =========================================================
# LOAD ENV
# =========================================================
load_dotenv()

# =========================================================
# PATHS
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

print("FRONTEND_DIR =", FRONTEND_DIR)

# =========================================================
# APP
# =========================================================
app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path="/frontend"
)

CORS(app, resources={r"/api/*": {"origins": "*"}})

# =========================================================
# BLUEPRINTS
# =========================================================
from routes.ia import ia_bp
from routes.snipcart import snipcart_bp
from routes.products import products_bp

app.register_blueprint(ia_bp)
app.register_blueprint(snipcart_bp)
app.register_blueprint(products_bp)

# =========================================================
# ROUTES API — CONFIG
# =========================================================
@app.route("/api/config", methods=["GET"])
def get_config():
    return jsonify({
        "snipcartPublicKey": os.getenv("SNIPCART_PUBLIC_KEY", "")
    }), 200

# =========================================================
# FRONTEND
# =========================================================
@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/frontend/<path:path>")
def frontend_static(path):
    return send_from_directory(FRONTEND_DIR, path)

# =========================================================
# RUN
# =========================================================
if __name__ == "__main__":
    app.run(port=8000, debug=True)
