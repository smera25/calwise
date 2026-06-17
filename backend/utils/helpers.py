"""
CalWise - Utility / Helper Functions
=====================================
Contains reusable helper logic:
- Password hashing (simple SHA-256 for demo)
- Calorie target calculator based on profile
- Meal plan generator based on user goal
"""

import hashlib
import json


# ── Password Helpers ───────────────────────────────────────────────
def hash_password(password):
    """Hash a password using SHA-256 (demo-grade, use bcrypt in production)."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password, hashed):
    """Verify a password against its hash."""
    return hash_password(password) == hashed


# ── Calorie Calculator ────────────────────────────────────────────
def calculate_calorie_target(profile):
    """
    Estimate daily calorie target using the Mifflin-St Jeor equation.
    Adjusts based on activity level and goal.
    """
    age = profile.get("age", 25)
    height = profile.get("height", 170)  # cm
    weight = profile.get("weight", 70)   # kg

    # Base Metabolic Rate (using male formula as default for demo)
    bmr = 10 * weight + 6.25 * height - 5 * age + 5

    # Activity multiplier
    activity_multipliers = {
        "Sedentary": 1.2,
        "Lightly Active": 1.375,
        "Moderately Active": 1.55,
        "Very Active": 1.725,
    }
    activity = profile.get("activity_level", "Moderately Active")
    tdee = bmr * activity_multipliers.get(activity, 1.55)

    # Goal-based adjustment
    goal = profile.get("goal", "Maintain Weight")
    if goal in ["Lose Weight", "weight_loss"]:
        return round(tdee - 500)  # 500 kcal deficit
    elif goal in ["Gain Muscle", "weight_gain"]:
        return round(tdee + 300)  # 300 kcal surplus
    else:
        return round(tdee)  # Maintain / Improve Health


# ── Meal Plan Generator ───────────────────────────────────────────

# Pre-defined meal templates matching the frontend's data shapes
MEAL_PLANS = {
    "weight_loss": {
        "daily_target": 1600,
        "deficit": "500 kcal/day",
        "timeline": "10 weeks",
        "meals": [
            {
                "type": "Breakfast", "icon": "🥣", "time": "7:30 AM",
                "name": "Veggie Egg White Omelette",
                "kcal": 280, "protein": 22, "carbs": 15, "fats": 8,
                "ingredients": ["3 egg whites", "Spinach", "Tomatoes", "Bell peppers", "1 slice whole wheat toast"]
            },
            {
                "type": "Lunch", "icon": "🥗", "time": "1:00 PM",
                "name": "Grilled Chicken Salad Bowl",
                "kcal": 420, "protein": 38, "carbs": 30, "fats": 12,
                "ingredients": ["120g grilled chicken", "Mixed greens", "Quinoa", "Cherry tomatoes", "Lemon vinaigrette"]
            },
            {
                "type": "Snack", "icon": "🍎", "time": "4:00 PM",
                "name": "Apple + Peanut Butter",
                "kcal": 200, "protein": 6, "carbs": 28, "fats": 8,
                "ingredients": ["1 medium apple", "1 tbsp natural peanut butter"]
            },
            {
                "type": "Dinner", "icon": "🍲", "time": "7:30 PM",
                "name": "Dal Tadka with Brown Rice",
                "kcal": 450, "protein": 20, "carbs": 62, "fats": 10,
                "ingredients": ["1 cup moong dal", "Brown rice (small)", "Ghee (1 tsp)", "Cumin, garlic", "Lemon wedge"]
            }
        ]
    },
    "weight_gain": {
        "daily_target": 2400,
        "deficit": "+400 kcal/day surplus",
        "timeline": "12 weeks",
        "meals": [
            {
                "type": "Breakfast", "icon": "🥞", "time": "7:30 AM",
                "name": "Banana Oat Protein Pancakes",
                "kcal": 520, "protein": 28, "carbs": 68, "fats": 14,
                "ingredients": ["1 cup oats", "2 whole eggs", "1 banana", "Protein powder (1 scoop)", "Maple syrup"]
            },
            {
                "type": "Lunch", "icon": "🍛", "time": "1:00 PM",
                "name": "Chicken Biryani Bowl",
                "kcal": 680, "protein": 42, "carbs": 78, "fats": 18,
                "ingredients": ["150g chicken thigh", "Basmati rice (1.5 cups)", "Mixed veggies", "Raita", "Saffron"]
            },
            {
                "type": "Snack", "icon": "🥛", "time": "4:00 PM",
                "name": "Protein Shake + Almonds",
                "kcal": 380, "protein": 30, "carbs": 35, "fats": 14,
                "ingredients": ["Protein powder", "Whole milk (300ml)", "Almonds (30g)", "Honey"]
            },
            {
                "type": "Dinner", "icon": "🍽️", "time": "7:30 PM",
                "name": "Paneer Butter Masala + Naan",
                "kcal": 620, "protein": 30, "carbs": 55, "fats": 28,
                "ingredients": ["150g paneer", "Butter gravy", "2 garlic naan", "Onion salad", "Green chutney"]
            }
        ]
    },
    "maintain": {
        "daily_target": 1800,
        "deficit": "0 kcal (balanced)",
        "timeline": "Ongoing",
        "meals": [
            {
                "type": "Breakfast", "icon": "🥣", "time": "7:30 AM",
                "name": "Oats & Egg Power Bowl",
                "kcal": 390, "protein": 18, "carbs": 45, "fats": 12,
                "ingredients": ["½ cup oats", "1 boiled egg", "1 tbsp peanut butter", "Banana slices", "Almond milk"]
            },
            {
                "type": "Lunch", "icon": "🍛", "time": "1:00 PM",
                "name": "Grilled Chicken Rice Bowl",
                "kcal": 540, "protein": 35, "carbs": 60, "fats": 14,
                "ingredients": ["100g grilled chicken", "1 cup brown rice", "Mixed vegetables", "Olive oil", "Lemon"]
            },
            {
                "type": "Snack", "icon": "🥛", "time": "4:00 PM",
                "name": "Greek Yogurt + Almonds",
                "kcal": 180, "protein": 14, "carbs": 12, "fats": 8,
                "ingredients": ["150g Greek yogurt", "20g almonds", "Honey drizzle"]
            },
            {
                "type": "Dinner", "icon": "🍽️", "time": "7:30 PM",
                "name": "Paneer Veg Stir Fry",
                "kcal": 480, "protein": 28, "carbs": 35, "fats": 18,
                "ingredients": ["100g paneer", "Bell peppers", "Broccoli", "Light soy sauce", "1 multigrain roti"]
            }
        ]
    }
}


def generate_meal_plan(goal):
    """
    Return a meal plan dictionary based on the user's goal.
    Maps frontend goal labels to internal plan keys.
    """
    goal_mapping = {
        "Lose Weight": "weight_loss",
        "weight_loss": "weight_loss",
        "Gain Muscle": "weight_gain",
        "weight_gain": "weight_gain",
        "Maintain Weight": "maintain",
        "maintain": "maintain",
        "Improve Health": "maintain",
    }

    plan_key = goal_mapping.get(goal, "maintain")
    plan = MEAL_PLANS.get(plan_key, MEAL_PLANS["maintain"])

    return {
        "goal": goal,
        "plan_type": plan_key,
        "daily_target": plan["daily_target"],
        "deficit": plan["deficit"],
        "timeline": plan["timeline"],
        "meals": plan["meals"],
        "total_calories": sum(m["kcal"] for m in plan["meals"]),
        "total_protein": sum(m["protein"] for m in plan["meals"]),
        "total_carbs": sum(m["carbs"] for m in plan["meals"]),
        "total_fats": sum(m["fats"] for m in plan["meals"]),
    }


# ── Recipe Dummy Data ─────────────────────────────────────────────

RECIPES = [
    {
        "id": 1, "name": "Oats & Egg Power Bowl", "tag": "Breakfast",
        "time": 10, "cal": 390, "protein": 18, "carbs": 45, "fats": 12,
        "icon": "🥣", "diet": "Veg", "tags": ["High Protein", "Low Cost"],
        "rating": 4.8,
        "ingredients": ["½ cup oats", "1 boiled egg", "1 tbsp peanut butter", "Banana slices", "Almond milk"],
        "instructions": [
            "Cook oats in almond milk for 3-4 minutes.",
            "Top with sliced boiled egg and banana.",
            "Drizzle peanut butter on top.",
            "Serve warm."
        ]
    },
    {
        "id": 2, "name": "Grilled Chicken Rice Bowl", "tag": "Lunch",
        "time": 25, "cal": 540, "protein": 35, "carbs": 60, "fats": 14,
        "icon": "🍛", "diet": "Non-Veg", "tags": ["High Protein", "Filling"],
        "rating": 4.9,
        "ingredients": ["100g grilled chicken", "1 cup brown rice", "Mixed vegetables", "Olive oil", "Lemon"],
        "instructions": [
            "Grill chicken breast with salt, pepper, and lemon.",
            "Cook brown rice separately.",
            "Sauté mixed vegetables in olive oil.",
            "Assemble bowl and serve."
        ]
    },
    {
        "id": 3, "name": "Paneer Veg Stir Fry", "tag": "Dinner",
        "time": 20, "cal": 480, "protein": 28, "carbs": 35, "fats": 18,
        "icon": "🫕", "diet": "Veg", "tags": ["Indian", "Quick"],
        "rating": 4.7,
        "ingredients": ["100g paneer", "Bell peppers", "Broccoli", "Light soy sauce", "1 multigrain roti"],
        "instructions": [
            "Cut paneer into cubes.",
            "Stir fry with chopped bell peppers and broccoli.",
            "Add light soy sauce for flavor.",
            "Serve with multigrain roti."
        ]
    },
    {
        "id": 4, "name": "Dal Tadka + Brown Rice", "tag": "Lunch",
        "time": 30, "cal": 510, "protein": 22, "carbs": 72, "fats": 8,
        "icon": "🍲", "diet": "Veg", "tags": ["Indian", "Budget-Friendly"],
        "rating": 4.6,
        "ingredients": ["1 cup toor dal", "Brown rice", "Ghee (1 tsp)", "Cumin, garlic, green chili", "Coriander leaves"],
        "instructions": [
            "Pressure cook toor dal until soft.",
            "Prepare tadka with ghee, cumin, garlic, and green chili.",
            "Pour tadka over dal and mix.",
            "Serve with brown rice and garnish with coriander."
        ]
    },
    {
        "id": 5, "name": "Banana Oat Smoothie", "tag": "Snack",
        "time": 5, "cal": 220, "protein": 8, "carbs": 38, "fats": 4,
        "icon": "🥤", "diet": "Veg", "tags": ["Quick", "Low Cost"],
        "rating": 4.5,
        "ingredients": ["1 ripe banana", "½ cup oats", "200ml milk", "Honey (1 tsp)", "Ice cubes"],
        "instructions": [
            "Add all ingredients to a blender.",
            "Blend until smooth and creamy.",
            "Pour into a glass and serve chilled."
        ]
    },
    {
        "id": 6, "name": "Egg Bhurji & Roti", "tag": "Breakfast",
        "time": 15, "cal": 360, "protein": 20, "carbs": 30, "fats": 16,
        "icon": "🍳", "diet": "Non-Veg", "tags": ["Indian", "High Protein"],
        "rating": 4.7,
        "ingredients": ["2 eggs", "Onion, tomato, green chili", "Butter (1 tsp)", "Coriander", "2 wheat rotis"],
        "instructions": [
            "Heat butter in a pan.",
            "Sauté chopped onion, tomato, and green chili.",
            "Add beaten eggs and scramble.",
            "Garnish with coriander and serve with roti."
        ]
    },
    {
        "id": 7, "name": "Sprout Salad Bowl", "tag": "Snack",
        "time": 10, "cal": 190, "protein": 12, "carbs": 24, "fats": 4,
        "icon": "🥗", "diet": "Vegan", "tags": ["Low Cal", "Budget-Friendly"],
        "rating": 4.4,
        "ingredients": ["1 cup mixed sprouts", "Cucumber", "Tomato", "Lemon juice", "Chaat masala"],
        "instructions": [
            "Boil or steam sprouts for 5 minutes.",
            "Chop cucumber and tomato.",
            "Mix everything together.",
            "Season with lemon juice and chaat masala."
        ]
    },
    {
        "id": 8, "name": "Moong Dal Chilla", "tag": "Breakfast",
        "time": 20, "cal": 290, "protein": 16, "carbs": 35, "fats": 6,
        "icon": "🥞", "diet": "Veg", "tags": ["Indian", "High Protein"],
        "rating": 4.8,
        "ingredients": ["1 cup moong dal (soaked)", "Ginger, green chili", "Onion, coriander", "Salt", "Oil for cooking"],
        "instructions": [
            "Grind soaked moong dal into a smooth batter.",
            "Add ginger, green chili, onion, and coriander.",
            "Pour batter on a hot pan and spread thin.",
            "Cook on both sides until golden and serve hot."
        ]
    },
]
