"""
CalWise - Meal Plan Routes
============================
Generates personalized meal plans based on user goals.

Endpoints:
  POST /generate-meal-plan  →  Generate a full-day meal plan
"""

from flask import Blueprint, request, jsonify
from models.database import get_db
from utils.helpers import generate_meal_plan, calculate_calorie_target

meal_plan_bp = Blueprint("meal_plan", __name__)


# ── POST /generate-meal-plan ──────────────────────────────────────
@meal_plan_bp.route("/generate-meal-plan", methods=["POST"])
def create_meal_plan():
    """
    Generate a meal plan based on user goal.
    
    Expects JSON (option A — provide goal directly):
        { "goal": "Lose Weight" }
    
    Or (option B — provide user_id to read goal from profile):
        { "user_id": 1 }
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required."}), 400

    goal = data.get("goal")

    # If no goal provided, try to fetch from user profile
    if not goal and data.get("user_id"):
        db = get_db()
        try:
            profile = db.execute(
                "SELECT goal, age, height, weight, activity_level FROM profiles WHERE user_id = ?",
                (data["user_id"],)
            ).fetchone()
            if profile:
                goal = profile["goal"]
                # Also calculate personalized calorie target
                profile_data = {
                    "age": profile["age"],
                    "height": profile["height"],
                    "weight": profile["weight"],
                    "activity_level": profile["activity_level"],
                    "goal": profile["goal"]
                }
                calorie_target = calculate_calorie_target(profile_data)
        finally:
            db.close()

    if not goal:
        return jsonify({"error": "Please provide 'goal' or 'user_id'."}), 400

    # Generate the meal plan
    plan = generate_meal_plan(goal)

    return jsonify({
        "message": "Meal plan generated successfully!",
        "meal_plan": plan
    }), 200
