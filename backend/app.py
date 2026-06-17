"""
╔══════════════════════════════════════════════════════════════╗
║                   CalWise Backend Server                     ║
║                                                              ║
║  A Flask-based REST API for the CalWise health & nutrition   ║
║  application. Provides endpoints for authentication,         ║
║  profile management, meal planning, nutrition tracking,      ║
║  recipe browsing, progress analytics, and community posts.   ║
║                                                              ║
║  Run:  python app.py                                         ║
║  URL:  http://localhost:5000                                 ║
╚══════════════════════════════════════════════════════════════╝
"""

from flask import Flask, jsonify
from flask_cors import CORS

# ── Import database initializer ───────────────────────────────────
from models.database import init_db

# ── Import route blueprints ───────────────────────────────────────
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.meal_plan import meal_plan_bp
from routes.nutrition import nutrition_bp
from routes.recipes import recipes_bp
from routes.analytics import analytics_bp
from routes.community import community_bp


def create_app():
    """Application factory — creates and configures the Flask app."""

    app = Flask(__name__)

    # ── Enable CORS for all routes (allows frontend to connect) ───
    CORS(app, resources={r"/*": {"origins": "*"}})

    # ── Register all blueprints ───────────────────────────────────
    app.register_blueprint(auth_bp)         # /register, /login
    app.register_blueprint(profile_bp)      # /profile
    app.register_blueprint(meal_plan_bp)    # /generate-meal-plan
    app.register_blueprint(nutrition_bp)    # /log-meal, /daily-nutrition
    app.register_blueprint(recipes_bp)      # /recipes
    app.register_blueprint(analytics_bp)    # /analytics
    app.register_blueprint(community_bp)    # /community

    # ── Health check / welcome route ──────────────────────────────
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "app": "CalWise Backend API",
            "version": "1.0.0",
            "status": "running",
            "endpoints": {
                "auth": {
                    "POST /register": "Create a new account",
                    "POST /login": "Log in to existing account"
                },
                "profile": {
                    "POST /profile": "Create / update profile",
                    "GET /profile/<user_id>": "Get user profile"
                },
                "meal_plan": {
                    "POST /generate-meal-plan": "Generate personalized meal plan"
                },
                "nutrition": {
                    "POST /log-meal": "Log a meal entry",
                    "GET /daily-nutrition/<user_id>": "Get daily nutrition summary"
                },
                "recipes": {
                    "GET /recipes": "Browse all recipes",
                    "GET /recipes/<id>": "Get recipe details"
                },
                "analytics": {
                    "GET /analytics/<user_id>": "Get progress analytics"
                },
                "community": {
                    "POST /community/post": "Create a community post",
                    "GET /community/posts": "Get all community posts"
                }
            }
        }), 200

    return app


# ── Main entry point ──────────────────────────────────────────────
if __name__ == "__main__":
    print("\n[CalWise] Starting CalWise Backend Server...")
    print("=" * 50)

    # Initialize the database (create tables)
    init_db()

    # Create and run the app
    app = create_app()

    print("\n[API] Server is live at: http://localhost:5000")
    print("[API] API docs at:       http://localhost:5000/")
    print("=" * 50 + "\n")

    app.run(
        host="0.0.0.0",    # accessible from other devices on the network
        port=5000,
        debug=True          # auto-reloads on code changes
    )
