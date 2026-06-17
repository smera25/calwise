"""
CalWise - Recipe Routes
========================
Provides recipe browsing with static dummy data.

Endpoints:
  GET /recipes       →  Get all recipes (with optional filters)
  GET /recipes/<id>  →  Get a single recipe by ID
"""

from flask import Blueprint, request, jsonify
from utils.helpers import RECIPES

recipes_bp = Blueprint("recipes", __name__)


# ── GET /recipes ──────────────────────────────────────────────────
@recipes_bp.route("/recipes", methods=["GET"])
def get_recipes():
    """
    Retrieve all recipes with optional query filters.
    
    Optional query params:
      ?category=Breakfast      (Breakfast, Lunch, Dinner, Snack)
      ?diet=Veg                (Veg, Non-Veg, Vegan)
      ?search=oats             (search by name)
      ?tag=High Protein        (filter by tag)
    """
    category = request.args.get("category")
    diet = request.args.get("diet")
    search = request.args.get("search", "").lower()
    tag = request.args.get("tag")

    filtered = RECIPES

    # Apply category filter
    if category and category != "All":
        filtered = [r for r in filtered if r["tag"] == category]

    # Apply diet filter
    if diet and diet != "All Diets":
        filtered = [r for r in filtered if r["diet"] == diet]

    # Apply search filter
    if search:
        filtered = [r for r in filtered if search in r["name"].lower()]

    # Apply tag filter
    if tag:
        filtered = [r for r in filtered if tag in r["tags"]]

    return jsonify({
        "count": len(filtered),
        "recipes": filtered
    }), 200


# ── GET /recipes/<id> ─────────────────────────────────────────────
@recipes_bp.route("/recipes/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    """Retrieve a single recipe by its ID."""
    recipe = next((r for r in RECIPES if r["id"] == recipe_id), None)

    if not recipe:
        return jsonify({"error": "Recipe not found."}), 404

    return jsonify({"recipe": recipe}), 200
