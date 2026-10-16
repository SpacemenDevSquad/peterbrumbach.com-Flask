from flask import Blueprint, render_template
from .home import load_json
projects_bp = Blueprint("projects", __name__, url_prefix="/projects")


@projects_bp.route("/DealOrNoDeal")
def deal_or_no_deal():
    projects = load_json("projects.json")["projects"]
    return render_template("deal_or_no_deal.html", projects=projects)

@projects_bp.route("/DropTheeBall")
def drop_thee_ball():
    projects = load_json("projects.json")["projects"]
    return render_template("drop_thee_ball.html", projects=projects)

@projects_bp.route("/PointlessWars")
def pointless_wars():
    projects = load_json("projects.json")["projects"]
    return render_template("pointless_wars.html", projects=projects)

@projects_bp.route("/ChristmasCrash")
def christmas_crash():
    return render_template("christmas_crash.html")

@projects_bp.route("/Raytracer")
def raytracer():
    return render_template("raytracer.html")

@projects_bp.route("/Raymarching")
def raymarching():
    return render_template("raymarching.html")