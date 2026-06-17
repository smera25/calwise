"""
CalWise - Community Routes
============================
Simple social feed — post and browse community content.

Endpoints:
  POST /community/post   →  Create a new community post
  GET  /community/posts  →  Get all community posts
"""

from flask import Blueprint, request, jsonify
from models.database import get_db

community_bp = Blueprint("community", __name__)


# ── Seed default posts (inserted on first fetch if table is empty) ─
DEFAULT_POSTS = [
    {
        "username": "Priya S.",
        "avatar": "PS",
        "content": "Hit my 6kg goal! 42-day streak 🔥",
        "post_type": "milestone",
        "likes": 34,
        "comments": 12
    },
    {
        "username": "Rohit M.",
        "avatar": "RM",
        "content": "Today's lunch was so good — Grilled Chicken Rice Bowl from CalWise recommendations 🍛",
        "post_type": "meal",
        "likes": 18,
        "comments": 5
    },
    {
        "username": "Sneha K.",
        "avatar": "SK",
        "content": "Pro tip: Prep your meals Sunday night and you'll never miss a log 💡",
        "post_type": "tip",
        "likes": 45,
        "comments": 21
    },
    {
        "username": "Kavya R.",
        "avatar": "KR",
        "content": "Just completed Week 2 with 100% meal adherence! First time ever 🎉",
        "post_type": "milestone",
        "likes": 27,
        "comments": 9
    },
]


def seed_posts_if_empty(db):
    """Insert default community posts if the table is empty."""
    count = db.execute("SELECT COUNT(*) as cnt FROM community_posts").fetchone()["cnt"]
    if count == 0:
        for post in DEFAULT_POSTS:
            db.execute("""
                INSERT INTO community_posts (username, avatar, content, post_type, likes, comments)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (post["username"], post["avatar"], post["content"],
                  post["post_type"], post["likes"], post["comments"]))
        db.commit()


# ── POST /community/post ──────────────────────────────────────────
@community_bp.route("/community/post", methods=["POST"])
def create_post():
    """
    Create a new community post.
    Expects JSON: {
        "user_id": 1,          (optional)
        "username": "Aarav",
        "avatar": "AV",        (optional, defaults to first 2 letters of name)
        "content": "Just hit my 7-day streak!",
        "post_type": "milestone"  (optional: milestone, meal, tip)
    }
    """
    data = request.get_json()

    if not data or not data.get("content"):
        return jsonify({"error": "Post content is required."}), 400

    username = data.get("username", "Anonymous")
    avatar = data.get("avatar", username[:2].upper())
    content = data["content"]
    post_type = data.get("post_type", "tip")
    user_id = data.get("user_id")

    db = get_db()
    try:
        cursor = db.execute("""
            INSERT INTO community_posts (user_id, username, avatar, content, post_type)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, username, avatar, content, post_type))
        db.commit()

        return jsonify({
            "message": "Post created successfully!",
            "post": {
                "id": cursor.lastrowid,
                "username": username,
                "avatar": avatar,
                "content": content,
                "post_type": post_type,
                "likes": 0,
                "comments": 0
            }
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# ── GET /community/posts ──────────────────────────────────────────
@community_bp.route("/community/posts", methods=["GET"])
def get_posts():
    """
    Retrieve all community posts, newest first.
    Optional query param: ?type=milestone  (filter by post type)
    """
    post_type = request.args.get("type")

    db = get_db()
    try:
        # Seed default posts if empty
        seed_posts_if_empty(db)

        if post_type:
            posts = db.execute(
                "SELECT * FROM community_posts WHERE post_type = ? ORDER BY created_at DESC",
                (post_type,)
            ).fetchall()
        else:
            posts = db.execute(
                "SELECT * FROM community_posts ORDER BY created_at DESC"
            ).fetchall()

        post_list = []
        for post in posts:
            post_list.append({
                "id": post["id"],
                "user_id": post["user_id"],
                "username": post["username"],
                "avatar": post["avatar"],
                "content": post["content"],
                "post_type": post["post_type"],
                "likes": post["likes"],
                "comments": post["comments"],
                "created_at": post["created_at"]
            })

        return jsonify({
            "count": len(post_list),
            "posts": post_list
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
