from pathlib import Path

from flask import Blueprint, current_app, send_from_directory, redirect

site_rules_bp = Blueprint("site_rules", __name__)

# Helper Function
def public_dir():
    return Path(current_app.root_path) / "public"


def send_text(directory, filename):
    response = send_from_directory(directory, filename, mimetype="text/plain")
    response.headers["Content-Type"] = "text/plain; charset=utf-8"  # RFC 9116 requires utf-8
    return response

@site_rules_bp.route("/robots.txt")
def robots():
    return send_text(public_dir(), "robots.txt")


@site_rules_bp.route("/.well-known/security.txt")
def security():
    return send_text(public_dir() / ".well-known", "security.txt")


@site_rules_bp.route("/security.txt")
def security_legacy():
    return redirect("/.well-known/security.txt", code=301)