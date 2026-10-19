from flask import Blueprint, redirect

redirects_bp = Blueprint("redirects", __name__)

@redirects_bp.route("/security.txt")
def security_legacy():
    return redirect("/.well-known/security.txt", code=301)

@redirects_bp.route("/tree.JPG")
def treebg_legacy():
    return redirect("/assets/images/backgrounds/sequoia.jpg", code=301)