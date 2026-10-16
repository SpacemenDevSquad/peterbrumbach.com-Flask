from pathlib import Path

from flask import Blueprint, render_template, current_app, send_from_directory, redirect

docs_bp = Blueprint("docs", __name__, url_prefix="/docs")

# Helper Function
def public_dir():
    return Path(current_app.root_path) / "public"


def send_text(directory, filename):
    response = send_from_directory(directory, filename, mimetype="text/plain")
    response.headers["Content-Type"] = "text/plain; charset=utf-8"  # RFC 9116 requires utf-8
    return response


# Routes
@docs_bp.route("/TOS")
def terms_of_service():
    return render_template("TOS.html")

@docs_bp.route("/sitemap")
def sitemap():
    return render_template("sitemap.html")


@docs_bp.route("/robots.txt")
def robots():
    return send_text(public_dir(), "robots.txt")


@docs_bp.route("/.well-known/security.txt")
def security():
    return send_text(public_dir() / ".well-known", "security.txt")


@docs_bp.route("/security.txt")
def security_legacy():
    return redirect("/.well-known/security.txt", code=301)