"""
CalWise - Database Models & Initialization
==========================================
Creates and manages the SQLite database with all required tables:
- users         : Authentication (email, password hash)
- profiles      : Health data (age, height, weight, goal, activity, diet, allergies)
- meal_logs     : Nutrition tracking entries
- community     : Community posts / feed
"""

import sqlite3
import os

# Database file lives alongside app.py in backend/
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "calwise.db")


def get_db():
    """Return a new database connection with row-factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # allows dict-like access to rows
    return conn


def init_db():
    """Create all tables if they don't already exist."""
    conn = get_db()
    cursor = conn.cursor()

    # ── Users table (auth) ─────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            email       TEXT UNIQUE NOT NULL,
            password    TEXT NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ── Profiles table ─────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         INTEGER NOT NULL,
            name            TEXT,
            age             INTEGER,
            height          REAL,
            weight          REAL,
            goal            TEXT,
            activity_level  TEXT,
            diet            TEXT,
            allergies       TEXT,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # ── Meal logs table (nutrition tracking) ───────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS meal_logs (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            food_name   TEXT NOT NULL,
            calories    REAL NOT NULL,
            protein     REAL DEFAULT 0,
            carbs       REAL DEFAULT 0,
            fats        REAL DEFAULT 0,
            meal_type   TEXT,
            date        TEXT DEFAULT (DATE('now')),
            time        TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # ── Community posts table ──────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS community_posts (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER,
            username    TEXT NOT NULL,
            avatar      TEXT,
            content     TEXT NOT NULL,
            post_type   TEXT DEFAULT 'tip',
            likes       INTEGER DEFAULT 0,
            comments    INTEGER DEFAULT 0,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print("[OK] Database initialized successfully!")
