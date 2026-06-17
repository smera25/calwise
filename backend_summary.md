# CalWise Backend — Complete API Summary

## Project Structure

```
backend/
├── app.py                  # Main entry point (run this!)
├── requirements.txt        # Flask + Flask-CORS
├── calwise.db             # SQLite database (auto-created)
├── models/
│   ├── __init__.py
│   └── database.py        # DB schema & connection helper
├── routes/
│   ├── __init__.py
│   ├── auth.py            # Register & Login
│   ├── profile.py         # Profile CRUD
│   ├── meal_plan.py       # Meal plan generator
│   ├── nutrition.py       # Meal logger & daily summary
│   ├── recipes.py         # Recipe browser (static data)
│   ├── analytics.py       # Progress analytics
│   └── community.py       # Social feed
└── utils/
    ├── __init__.py
    └── helpers.py         # Password hash, calorie calc, meal plans, recipe data
```

## All 12 API Endpoints — Tested ✅

| # | Method | Endpoint | Description | Status |
|---|--------|----------|-------------|--------|
| 1 | `POST` | `/register` | Create new account | ✅ |
| 2 | `POST` | `/login` | Authenticate user | ✅ |
| 3 | `POST` | `/profile` | Create/update profile | ✅ |
| 4 | `GET` | `/profile/<user_id>` | Retrieve profile | ✅ |
| 5 | `POST` | `/generate-meal-plan` | Generate meal plan by goal | ✅ |
| 6 | `POST` | `/log-meal` | Log a meal entry | ✅ |
| 7 | `GET` | `/daily-nutrition/<user_id>` | Daily nutrition summary | ✅ |
| 8 | `GET` | `/recipes` | Browse recipes (with filters) | ✅ |
| 9 | `GET` | `/recipes/<id>` | Single recipe details | ✅ |
| 10 | `GET` | `/analytics/<user_id>` | Progress analytics | ✅ |
| 11 | `POST` | `/community/post` | Create community post | ✅ |
| 12 | `GET` | `/community/posts` | Get all posts | ✅ |

## How to Run

```bash
cd backend
pip install flask flask-cors
python app.py
```

Server starts at **http://localhost:5000**

## Key Features

- **Calorie Calculator**: Uses Mifflin-St Jeor equation with activity & goal adjustments
- **3 Meal Plan Types**: Weight loss (1600 kcal), Maintain (1800 kcal), Weight gain (2400 kcal)
- **8 Indian-cuisine Recipes**: With ingredients, instructions, macros & tags
- **Smart Analytics**: Streak tracking, weight simulation, goal status detection
- **Auto-seeded Community**: 4 default posts matching frontend data
- **CORS enabled**: Ready for frontend integration on any port
