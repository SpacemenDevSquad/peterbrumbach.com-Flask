"""
Homepage
"""
import json
from pathlib import Path
from flask import Blueprint, current_app, render_template

home_bp = Blueprint("home", __name__)

def load_json(filename):
    """Read a file from assets/json and return its contents."""
    path = Path(current_app.static_folder) / "json" / filename
    with open(path, encoding="utf-8") as file:
        return json.load(file)

@home_bp.route("/")
def index():
    projects = load_json("projects.json")["projects"]

    return render_template(
        "home.html",
        projects=projects
    )