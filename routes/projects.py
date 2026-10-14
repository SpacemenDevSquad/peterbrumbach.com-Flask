from flask import Blueprint, render_template

projects_bp = Blueprint("projects", __name__, url_prefix="/projects")


@projects_bp.route("/DealOrNoDeal")
def deal_or_no_deal():
    return render_template("deal_or_no_deal.html")
