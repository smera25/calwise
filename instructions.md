# CalWise Backend Documentation

## Overview
CalWise is a health and nutrition management system designed to help users track their diet, generate meal plans, and analyze their nutritional habits.

This backend provides APIs to support all frontend functionalities including user management, meal planning, nutrition tracking, analytics, and community interaction.

---

## Tech Stack
- Backend: Python Flask
- Database: SQLite
- API Type: RESTful APIs
- Data Format: JSON

---

## Features Implemented

### 1. User Authentication
- Users can register and login
- Basic validation included

Endpoints:
- POST /register
- POST /login

---

### 2. User Profile Management
Stores personal health details used for personalization.

Data Stored:
- Age
- Height
- Weight
- Goal (weight_loss / weight_gain / maintain)
- Activity Level

Endpoints:
- POST /profile
- GET /profile/<user_id>

---

### 3. Meal Plan Generation
Generates a personalized meal plan based on user goals.

Logic:
- Weight Loss → Low calorie plan
- Weight Gain → High calorie plan
- Maintain → Balanced plan

Endpoints:
- POST /generate-meal-plan

---

### 4. Nutrition Tracking
Allows users to log daily meals and track calories.

Data:
- Food Name
- Calories
- Protein, Carbs, Fat
- Date

Endpoints:
- POST /log-meal
- GET /daily-nutrition/<user_id>

---

### 5. Recipe Explorer
Provides a list of recipes.

Note:
- Uses static dummy data for demonstration

Endpoints:
- GET /recipes
- GET /recipes/<id>

---

### 6. Progress Analytics
Analyzes user nutrition data and provides insights.

Features:
- Total calories
- Average calories
- Goal tracking

Endpoints:
- GET /analytics/<user_id>

---

### 7. Community Module
Basic social interaction feature.

Features:
- Post messages
- View posts

Endpoints:
- POST /community/post
- GET /community/posts

---

## Design Approach

The backend is designed using a modular structure:
- Routes separated by feature
- Lightweight database for quick setup
- Rule-based logic used for personalization

---

## Note on AI Integration

This system uses rule-based logic to simulate intelligent decision-making for:
- Meal plan generation
- Nutritional insights

This approach ensures fast performance and simplicity while maintaining effectiveness.

---

## How to Run

1. Install dependencies:
   pip install flask flask-cors

2. Run server:
   python app.py

3. Test APIs using Postman or frontend integration

---

## Future Enhancements
- Integration with real nutrition APIs
- AI-based meal recommendation system
- Advanced analytics with graphs
- User authentication with JWT