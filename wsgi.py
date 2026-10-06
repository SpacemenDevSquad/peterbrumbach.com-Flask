"""
peterbrumbach.com - Flask entry point
Development:  python wsgi.py
Production:   gunicorn wsgi:app
"""

import json
import random
from datetime import date
from pathlib import Path

from flask import Flask

from routes import register_routes

BASE_DIR = Path(__file__).resolve().parent


def create_app():
    app = Flask(
        __name__,
        static_folder="assets",
        static_url_path="/assets",
        template_folder="templates",
    )

    verses_file = BASE_DIR / "assets" / "json" / "verses.json"
    verses = json.loads(verses_file.read_text(encoding="utf-8"))["verses"]

    @app.context_processor
    def inject_footer_data():
        return {"verse": random.choice(verses), "year": date.today().year}

    register_routes(app)
    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
