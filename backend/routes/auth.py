"""
CalWise - Auth Routes
======================
Handles user registration and login.

Endpoints:
  POST /register  →  Create a new user account
  POST /login     →  Authenticate and return user info
"""

from flask import Blueprint, request, jsonify
from models.database import get_db
from utils.helpers import hash_password, verify_password

auth_bp = Blueprint("auth", __name__)


# ── POST /register ────────────────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user.
    Expects JSON: { "email": "...", "password": "..." }
    """
    data = request.get_json()

    # Validate required fields
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required."}), 400

    email = data["email"].strip().lower()
    password = data["password"]

    # Check password length
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    db = get_db()
    try:
        # Check if user already exists
        existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return jsonify({"error": "An account with this email already exists."}), 409

        # Create the user
        hashed = hash_password(password)
        cursor = db.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, hashed)
        )
        db.commit()
        user_id = cursor.lastrowid

        return jsonify({
            "message": "Account created successfully!",
            "user": {
                "id": user_id,
                "email": email
            }
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# ── POST /login ───────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user.
    Expects JSON: { "email": "...", "password": "..." }
    """
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required."}), 400

    email = data["email"].strip().lower()
    password = data["password"]

    db = get_db()
    try:
        user = db.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()

        if not user:
            return jsonify({"error": "No account found with this email."}), 404

        if not verify_password(password, user["password"]):
            return jsonify({"error": "Incorrect password."}), 401

        return jsonify({
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "email": user["email"]
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
