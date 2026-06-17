"""
CalWise - Analytics Routes
============================
Provides progress analytics and insights based on logged meals.

Endpoints:
  GET /analytics/<user_id>  →  Get analytics summary for a user
"""

from flask import Blueprint, jsonify
from models.database import get_db
from utils.helpers import calculate_calorie_target

analytics_bp = Blueprint("analytics", __name__)


# ── GET /analytics/<user_id> ──────────────────────────────────────
@analytics_bp.route("/analytics/<int:user_id>", methods=["GET"])
def get_analytics(user_id):
    """
    Return analytics summary for a user.
    Includes: total calories, average daily calories, goal status,
    weight progress, macro breakdown, and weekly adherence data.
    """
    db = get_db()
    try:
        # ── Fetch user's profile ───────────────────────────────────
        profile = db.execute(
            "SELECT * FROM profiles WHERE user_id = ?", (user_id,)
        ).fetchone()

        if not profile:
            return jsonify({"error": "Profile not found. Please set up your profile first."}), 404

        # Calculate calorie target from profile
        calorie_target = calculate_calorie_target({
            "age": profile["age"],
            "height": profile["height"],
            "weight": profile["weight"],
            "activity_level": profile["activity_level"],
            "goal": profile["goal"]
        })

        # ── Fetch all meal logs ────────────────────────────────────
        meals = db.execute(
            "SELECT * FROM meal_logs WHERE user_id = ? ORDER BY date ASC",
            (user_id,)
        ).fetchall()

        total_calories = sum(m["calories"] for m in meals)
        total_protein = sum(m["protein"] for m in meals)
        total_carbs = sum(m["carbs"] for m in meals)
        total_fats = sum(m["fats"] for m in meals)
        meal_count = len(meals)

        # Calculate unique days with logged meals
        unique_days = len(set(m["date"] for m in meals))
        avg_daily_calories = round(total_calories / unique_days) if unique_days > 0 else 0

        # ── Goal status logic ──────────────────────────────────────
        goal = profile["goal"]
        if avg_daily_calories == 0:
            goal_status = "No data yet"
            goal_icon = "📊"
        elif goal in ["Lose Weight", "weight_loss"]:
            if avg_daily_calories <= calorie_target:
                goal_status = "On Track — Great job! 🎯"
                goal_icon = "✅"
            else:
                goal_status = "Over target — Try reducing portions"
                goal_icon = "⚠️"
        elif goal in ["Gain Muscle", "weight_gain"]:
            if avg_daily_calories >= calorie_target:
                goal_status = "On Track — Hitting your surplus! 💪"
                goal_icon = "✅"
            else:
                goal_status = "Under target — Eat more to fuel gains"
                goal_icon = "⚠️"
        else:
            if abs(avg_daily_calories - calorie_target) <= 200:
                goal_status = "On Track — Well balanced! ⚖️"
                goal_icon = "✅"
            else:
                goal_status = "Slightly off — Adjust intake"
                goal_icon = "⚠️"

        # ── Weekly calorie history (for charts) ────────────────────
        daily_data = {}
        for meal in meals:
            day = meal["date"]
            if day not in daily_data:
                daily_data[day] = {"date": day, "calories": 0, "protein": 0, "carbs": 0, "fats": 0}
            daily_data[day]["calories"] += meal["calories"]
            daily_data[day]["protein"] += meal["protein"]
            daily_data[day]["carbs"] += meal["carbs"]
            daily_data[day]["fats"] += meal["fats"]

        calorie_history = list(daily_data.values())[-7:]  # last 7 days

        # ── Streak calculation ─────────────────────────────────────
        from datetime import date, timedelta
        today = date.today()
        streak = 0
        check_date = today
        logged_dates = set(m["date"] for m in meals)
        while str(check_date) in logged_dates:
            streak += 1
            check_date -= timedelta(days=1)

        # ── Build weight history (simulated from profile) ──────────
        # In a real app this would come from periodic weight logs
        current_weight = profile["weight"]
        weight_history = []
        for i in range(8):
            if goal in ["Lose Weight", "weight_loss"]:
                w = current_weight + (7 - i) * 0.5  # simulate weight decrease
            elif goal in ["Gain Muscle", "weight_gain"]:
                w = current_weight - (7 - i) * 0.3  # simulate weight increase
            else:
                w = current_weight + (3 - i) * 0.1  # minor fluctuation
            weight_history.append({
                "week": f"Week {i + 1}",
                "weight": round(w, 1)
            })

        # Total weight change
        if len(weight_history) >= 2:
            weight_change = round(weight_history[0]["weight"] - weight_history[-1]["weight"], 1)
        else:
            weight_change = 0

        return jsonify({
            "user_id": user_id,
            "goal": goal,
            "calorie_target": calorie_target,
            "summary": {
                "total_calories": round(total_calories),
                "avg_daily_calories": avg_daily_calories,
                "total_protein": round(total_protein),
                "total_carbs": round(total_carbs),
                "total_fats": round(total_fats),
                "total_meals_logged": meal_count,
                "days_tracked": unique_days,
                "current_streak": streak,
            },
            "goal_status": {
                "status": goal_status,
                "icon": goal_icon
            },
            "weight_progress": {
                "current_weight": current_weight,
                "weight_change": weight_change,
                "history": weight_history
            },
            "calorie_history": calorie_history,
            "macro_breakdown": {
                "protein": round(total_protein),
                "carbs": round(total_carbs),
                "fats": round(total_fats)
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
