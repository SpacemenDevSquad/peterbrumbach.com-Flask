from flask import Blueprint, render_template
from .home import load_json
projects_bp = Blueprint("projects", __name__, url_prefix="/projects")


@projects_bp.route("/DealOrNoDeal")
def deal_or_no_deal():
    projects = load_json("projects.json")["projects"]
    return render_template("deal_or_no_deal.html", projects=projects)
