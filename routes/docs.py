from pathlib import Path

from flask import Blueprint, render_template

docs_bp = Blueprint("docs", __name__, url_prefix="/docs")

@docs_bp.route("/TOS")
def terms_of_service():
    return render_template("TOS.html")

@docs_bp.route("/sitemap")
def sitemap():
    return render_template("sitemap.html")