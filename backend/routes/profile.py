"""
CalWise - Profile Routes
=========================
Manages user health profile data.

Endpoints:
  POST /profile            →  Create or update user profile
  GET  /profile/<user_id>  →  Retrieve user profile
"""

from flask import Blueprint, request, jsonify
from models.database import get_db

profile_bp = Blueprint("profile", __name__)


# ── POST /profile ─────────────────────────────────────────────────
@profile_bp.route("/profile", methods=["POST"])
def create_profile():
    """
    Create or update a user profile.
    Expects JSON: {
        "user_id": 1,
        "name": "Aarav Mehta",
        "age": 25,
        "height": 172,
        "weight": 75,
        "goal": "Lose Weight",
        "activity_level": "Moderately Active",
        "diet": "Vegetarian",
        "allergies": ["Gluten", "Dairy"]
    }
    """
    data = request.get_json()

    if not data or not data.get("user_id"):
        return jsonify({"error": "user_id is required."}), 400

    user_id = data["user_id"]
    name = data.get("name", "")
    age = data.get("age", 0)
    height = data.get("height", 0)
    weight = data.get("weight", 0)
    goal = data.get("goal", "Maintain Weight")
    activity_level = data.get("activity_level", "Moderately Active")
    diet = data.get("diet", "No Preference")
    # Store allergies as comma-separated string
    allergies = ",".join(data.get("allergies", []))

    db = get_db()
    try:
        # Check if profile already exists for this user
        existing = db.execute(
            "SELECT id FROM profiles WHERE user_id = ?", (user_id,)
        ).fetchone()

        if existing:
            # Update existing profile
            db.execute("""
                UPDATE profiles SET 
                    name = ?, age = ?, height = ?, weight = ?,
                    goal = ?, activity_level = ?, diet = ?, allergies = ?
                WHERE user_id = ?
            """, (name, age, height, weight, goal, activity_level, diet, allergies, user_id))
            db.commit()
            message = "Profile updated successfully!"
        else:
            # Create new profile
            db.execute("""
                INSERT INTO profiles (user_id, name, age, height, weight, goal, activity_level, diet, allergies)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, name, age, height, weight, goal, activity_level, diet, allergies))
            db.commit()
            message = "Profile created successfully!"

        return jsonify({
            "message": message,
            "profile": {
                "user_id": user_id,
                "name": name,
                "age": age,
                "height": height,
                "weight": weight,
                "goal": goal,
                "activity_level": activity_level,
                "diet": diet,
                "allergies": data.get("allergies", [])
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# ── GET /profile/<user_id> ────────────────────────────────────────
@profile_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    """Retrieve a user's profile by user_id."""
    db = get_db()
    try:
        profile = db.execute(
            "SELECT * FROM profiles WHERE user_id = ?", (user_id,)
        ).fetchone()

        if not profile:
            return jsonify({"error": "Profile not found."}), 404

        # Parse allergies back into a list
        allergies_list = profile["allergies"].split(",") if profile["allergies"] else []

        return jsonify({
            "profile": {
                "user_id": profile["user_id"],
                "name": profile["name"],
                "age": profile["age"],
                "height": profile["height"],
                "weight": profile["weight"],
                "goal": profile["goal"],
                "activity_level": profile["activity_level"],
                "diet": profile["diet"],
                "allergies": allergies_list
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
