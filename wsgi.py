"""
peterbrumbach.com - Flask entry point
Development:  python wsgi.py
Production:   docker compose up -d   (gunicorn, behind Cloudflare Tunnel -> Nginx Proxy Manager)
"""

import json
import os
import random
from datetime import date
from pathlib import Path

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from routes import register_routes

BASE_DIR = Path(__file__).resolve().parent

# Requests for any other domain are rejected with "400 Bad Request" (needs Flask 3.1+)
TRUSTED_HOSTS = ["peterbrumbach.com", "www.peterbrumbach.com"]

# Number of proxies in front of the app (set in .env). Default: Cloudflare Tunnel -> Nginx Proxy Manager.
PROXY_HOPS = int(os.environ.get("PROXY_HOPS", "2"))


def create_app():
    app = Flask(
        __name__,
        static_folder="assets",
        static_url_path="/assets",
        template_folder="templates",
    )
    app.config["TRUSTED_HOSTS"] = list(TRUSTED_HOSTS)

    # Trust what the proxies in front of the app tell us about:
    #   x_for:   the visitor's real IP. Each proxy appends to X-Forwarded-For (Cloudflare adds
    #            the visitor, Nginx Proxy Manager adds the tunnel), so skip back PROXY_HOPS entries.
    #   x_proto: http vs https. Cloudflare sets X-Forwarded-Proto and Nginx Proxy Manager keeps it
    #            as a single value, so links say https://
    # Both proxies pass the visitor's domain in the normal Host header, so X-Forwarded-Host is NOT
    # trusted; a visitor could set it to anything.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=PROXY_HOPS, x_proto=1, x_host=0, x_port=0, x_prefix=0)

    verses_file = BASE_DIR / "assets" / "json" / "verses.json"
    verses = json.loads(verses_file.read_text(encoding="utf-8"))["verses"]

    @app.context_processor
    def inject_footer_data():
        return {"verse": random.choice(verses), "year": date.today().year}

    register_routes(app)
    return app


app = create_app()

if __name__ == "__main__":
    # Local development only: also accept http://localhost:5000 and http://127.0.0.1:5000.
    # Production (gunicorn wsgi:app) never runs this block, so it only trusts TRUSTED_HOSTS.
    app.config["TRUSTED_HOSTS"] += ["localhost", "127.0.0.1"]
    app.run(debug=True)
