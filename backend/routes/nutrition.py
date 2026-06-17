"""
CalWise - Nutrition Tracking Routes
=====================================
Allows users to log meals and retrieve daily nutrition summaries.

Endpoints:
  POST /log-meal                   →  Log a meal entry
  GET  /daily-nutrition/<user_id>  →  Get daily nutrition summary
"""

from flask import Blueprint, request, jsonify
from models.database import get_db
from datetime import date

nutrition_bp = Blueprint("nutrition", __name__)


# ── POST /log-meal ────────────────────────────────────────────────
@nutrition_bp.route("/log-meal", methods=["POST"])
def log_meal():
    """
    Log a meal entry for a user.
    Expects JSON: {
        "user_id": 1,
        "food_name": "Oats & Egg Power Bowl",
        "calories": 390,
        "protein": 18,
        "carbs": 45,
        "fats": 12,
        "meal_type": "Breakfast",
        "time": "7:30 AM"
    }
    """
    data = request.get_json()

    if not data or not data.get("user_id") or not data.get("food_name"):
        return jsonify({"error": "user_id and food_name are required."}), 400

    user_id = data["user_id"]
    food_name = data["food_name"]
    calories = data.get("calories", 0)
    protein = data.get("protein", 0)
    carbs = data.get("carbs", 0)
    fats = data.get("fats", 0)
    meal_type = data.get("meal_type", "Other")
    time_str = data.get("time", "")
    meal_date = data.get("date", str(date.today()))

    db = get_db()
    try:
        cursor = db.execute("""
            INSERT INTO meal_logs (user_id, food_name, calories, protein, carbs, fats, meal_type, date, time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, food_name, calories, protein, carbs, fats, meal_type, meal_date, time_str))
        db.commit()

        return jsonify({
            "message": f"{food_name} logged successfully!",
            "meal": {
                "id": cursor.lastrowid,
                "user_id": user_id,
                "food_name": food_name,
                "calories": calories,
                "protein": protein,
                "carbs": carbs,
                "fats": fats,
                "meal_type": meal_type,
                "date": meal_date,
                "time": time_str
            }
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# ── GET /daily-nutrition/<user_id> ────────────────────────────────
@nutrition_bp.route("/daily-nutrition/<int:user_id>", methods=["GET"])
def daily_nutrition(user_id):
    """
    Get the nutrition summary for a user on a given date.
    Optional query param: ?date=2026-04-19  (defaults to today)
    """
    query_date = request.args.get("date", str(date.today()))

    db = get_db()
    try:
        # Fetch all meals for the user on the given date
        meals = db.execute(
            "SELECT * FROM meal_logs WHERE user_id = ? AND date = ? ORDER BY created_at ASC",
            (user_id, query_date)
        ).fetchall()

        # Build meal list
        meal_list = []
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fats = 0

        for meal in meals:
            meal_dict = {
                "id": meal["id"],
                "food_name": meal["food_name"],
                "calories": meal["calories"],
                "protein": meal["protein"],
                "carbs": meal["carbs"],
                "fats": meal["fats"],
                "meal_type": meal["meal_type"],
                "time": meal["time"]
            }
            meal_list.append(meal_dict)
            total_calories += meal["calories"]
            total_protein += meal["protein"]
            total_carbs += meal["carbs"]
            total_fats += meal["fats"]

        # Calorie target (default 1800, ideally from profile)
        calorie_target = 1800
        profile = db.execute(
            "SELECT goal, age, height, weight, activity_level FROM profiles WHERE user_id = ?",
            (user_id,)
        ).fetchone()

        if profile:
            from utils.helpers import calculate_calorie_target
            calorie_target = calculate_calorie_target({
                "age": profile["age"],
                "height": profile["height"],
                "weight": profile["weight"],
                "activity_level": profile["activity_level"],
                "goal": profile["goal"]
            })

        remaining = calorie_target - total_calories

        return jsonify({
            "date": query_date,
            "user_id": user_id,
            "calorie_target": calorie_target,
            "total_calories": round(total_calories),
            "total_protein": round(total_protein),
            "total_carbs": round(total_carbs),
            "total_fats": round(total_fats),
            "remaining_calories": round(remaining),
            "meals": meal_list,
            "meal_count": len(meal_list)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
