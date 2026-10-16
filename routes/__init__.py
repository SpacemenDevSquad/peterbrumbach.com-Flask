"""
Routes
"""

def register_routes(app):
    from .home import home_bp
    app.register_blueprint(home_bp)
    from .projects import projects_bp
    app.register_blueprint(projects_bp)
    from .docs import docs_bp
    app.register_blueprint(docs_bp)
    from .site_rules import site_rules_bp
    app.register_blueprint(site_rules_bp)
