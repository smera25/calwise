/**
 * CalWise API Helper
 * ==================
 * Centralized API calls to the Flask backend.
 * Base URL: http://localhost:5000
 */

const BASE_URL = "http://localhost:5000";

// Generic fetch wrapper
async function apiCall(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

// ── Auth APIs ────────────────────────────────────────────────────
export const registerUser = (email, password) =>
  apiCall("/register", "POST", { email, password });

export const loginUser = (email, password) =>
  apiCall("/login", "POST", { email, password });

// ── Profile APIs ─────────────────────────────────────────────────
export const createProfile = (profileData) =>
  apiCall("/profile", "POST", profileData);

export const getProfile = (userId) =>
  apiCall(`/profile/${userId}`);

// ── Meal Plan APIs ───────────────────────────────────────────────
export const generateMealPlan = (goal) =>
  apiCall("/generate-meal-plan", "POST", { goal });

export const generateMealPlanByUser = (userId) =>
  apiCall("/generate-meal-plan", "POST", { user_id: userId });

// ── Nutrition APIs ───────────────────────────────────────────────
export const logMeal = (mealData) =>
  apiCall("/log-meal", "POST", mealData);

export const getDailyNutrition = (userId, date = null) => {
  let url = `/daily-nutrition/${userId}`;
  if (date) url += `?date=${date}`;
  return apiCall(url);
};

// ── Recipe APIs ──────────────────────────────────────────────────
export const getRecipes = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "All") params.append("category", filters.category);
  if (filters.diet && filters.diet !== "All Diets") params.append("diet", filters.diet);
  if (filters.search) params.append("search", filters.search);
  if (filters.tag) params.append("tag", filters.tag);
  const query = params.toString();
  return apiCall(`/recipes${query ? "?" + query : ""}`);
};

export const getRecipe = (id) =>
  apiCall(`/recipes/${id}`);

// ── Analytics APIs ───────────────────────────────────────────────
export const getAnalytics = (userId) =>
  apiCall(`/analytics/${userId}`);

// ── Community APIs ───────────────────────────────────────────────
export const createPost = (postData) =>
  apiCall("/community/post", "POST", postData);

export const getCommunityPosts = () =>
  apiCall("/community/posts");
