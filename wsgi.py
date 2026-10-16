"""
peterbrumbach.com - Flask entry point
Development:  python wsgi.py
Production:   gunicorn wsgi:app   (behind a Cloudflare Tunnel)
"""

import json
import random
from datetime import date
from pathlib import Path

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from routes import register_routes

BASE_DIR = Path(__file__).resolve().parent

TRUSTED_HOSTS = ["peterbrumbach.com", "www.peterbrumbach.com", "peterbrumbach.dev", "www.peterbrumbach.dev"]


def create_app():
    app = Flask(
        __name__,
        static_folder="assets",
        static_url_path="/assets",
        template_folder="templates",
    )
    app.config["TRUSTED_HOSTS"] = list(TRUSTED_HOSTS)

    # Cloudflare Tunnel is the one proxy in front of this app. Trust what it tells us about:
    #   x_for:   the visitor's real IP (Cloudflare appends it to X-Forwarded-For)
    #   x_proto: http vs https (Cloudflare overwrites X-Forwarded-Proto), so links say https://
    # The Host header is passed through as the visitor's domain, so X-Forwarded-Host is NOT
    # trusted; Cloudflare doesn't control it, and a visitor could set it to anything.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=0, x_port=0, x_prefix=0)

    verses_file = BASE_DIR / "assets" / "json" / "verses.json"
    verses = json.loads(verses_file.read_text(encoding="utf-8"))["verses"]

    @app.context_processor
    def inject_footer_data():
        return {"verse": random.choice(verses), "year": date.today().year}

    register_routes(app)
    return app


app = create_app()

if __name__ == "__main__":
    app.config["TRUSTED_HOSTS"] += ["localhost", "127.0.0.1"]
    app.run(debug=True)
