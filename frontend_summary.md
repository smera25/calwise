# CalWise Frontend — Complete UI Summary

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework (SPA) |
| React DOM | 18.2.0 | DOM rendering |
| React Scripts | 5.0.1 | Build tooling (Create React App) |
| Recharts | 2.8.0 | Data visualization (charts & graphs) |
| Vanilla CSS | — | Custom design system (no Tailwind) |
| Google Fonts | DM Sans + DM Serif Display | Typography |

## Project Structure

```
src/
├── App.js                      # Root component, screen router & state manager
├── App.css                     # Complete design system (711 lines)
├── api.js                      # Centralized API helper (all backend calls)
├── index.js                    # React DOM entry point
├── components/
│   ├── Sidebar.js              # Fixed left navigation (Main / Insights / Account)
│   └── Topbar.js               # Sticky top bar (page title, date, logout)
├── screens/
│   ├── LandingPage.js          # Marketing hero page
│   ├── LoginSignup.js          # Auth screen (register + login)
│   ├── ProfileSetup.js         # 3-step onboarding wizard
│   ├── GeneratingPlan.js       # AI plan generation loading animation
│   ├── Dashboard.js            # Main dashboard with stats & charts
│   ├── MealPlanner.js          # 7-day meal plan viewer
│   ├── NutritionTracker.js     # Daily meal logger + macro tracking
│   ├── RecipeExplorer.js       # Filterable recipe browser
│   ├── ProgressAnalytics.js    # Weight & adherence analytics
│   ├── Community.js            # Social feed, leaderboard & challenges
│   └── Settings.js             # Profile, goals, notifications & preferences
public/
└── index.html                  # HTML shell
```

## All 11 Screens — Overview

| # | Screen | File | Backend APIs Used | Key Features |
|---|--------|------|-------------------|--------------|
| 1 | Landing Page | `LandingPage.js` | None | Hero section, feature cards, stats banner, CTA |
| 2 | Login / Signup | `LoginSignup.js` | `POST /register`, `POST /login` | Dual-mode auth form, testimonials carousel, validation |
| 3 | Profile Setup | `ProfileSetup.js` | `POST /profile` | 3-step wizard (body → goals → diet), chip selectors |
| 4 | Generating Plan | `GeneratingPlan.js` | `POST /generate-meal-plan` | 5-step animated progress, background API call |
| 5 | Dashboard | `Dashboard.js` | `GET /daily-nutrition/:id`, `GET /analytics/:id` | Stat cards, today's meals, macro balance, calorie & weight charts |
| 6 | Meal Planner | `MealPlanner.js` | `POST /generate-meal-plan` | 7-day selector, expandable meal cards with ingredients & macros |
| 7 | Nutrition Tracker | `NutritionTracker.js` | `POST /log-meal`, `GET /daily-nutrition/:id` | Quick add, custom food modal, pie chart, hydration tracker |
| 8 | Recipe Explorer | `RecipeExplorer.js` | `GET /recipes` | Search, category/diet/tag filters, save/unsave, macro mini-bars |
| 9 | Progress Analytics | `ProgressAnalytics.js` | `GET /analytics/:id` | Weight chart, adherence bar chart, milestone timeline |
| 10 | Community | `Community.js` | `GET /community/posts`, `POST /community/post` | Social feed, create post modal, leaderboard, active challenges |
| 11 | Settings | `Settings.js` | None (local state) | Profile display, goal inputs, notification toggles, danger zone |

## Navigation Flow

```
Landing Page → Login/Signup → Profile Setup (3 steps) → Generating Plan → Meal Planner
                                                                              ↓
                              ┌──────────────────────────────────────── Dashboard ←──┐
                              │                                            │         │
                              ▼                                            ▼         │
                        Meal Planner ◄──► Nutrition Tracker ◄──► Recipe Explorer     │
                              │                                            │         │
                              ▼                                            ▼         │
                     Progress Analytics                              Community       │
                              │                                            │         │
                              └────────────────► Settings ─────────────────┘─────────┘
```

**Auth Screens** (no sidebar): `landing`, `login`, `profile`, `generating`
**App Screens** (sidebar + topbar): `dashboard`, `planner`, `nutrition`, `recipes`, `progress`, `community`, `settings`

## API Integration Layer (`api.js`)

All backend calls go through a centralized `apiCall()` wrapper that handles JSON serialization, error extraction, and base URL configuration.

| # | Function | Method | Endpoint | Used By |
|---|----------|--------|----------|---------|
| 1 | `registerUser()` | POST | `/register` | LoginSignup |
| 2 | `loginUser()` | POST | `/login` | LoginSignup |
| 3 | `createProfile()` | POST | `/profile` | ProfileSetup |
| 4 | `getProfile()` | GET | `/profile/:id` | (available) |
| 5 | `generateMealPlan()` | POST | `/generate-meal-plan` | GeneratingPlan, MealPlanner |
| 6 | `generateMealPlanByUser()` | POST | `/generate-meal-plan` | (available) |
| 7 | `logMeal()` | POST | `/log-meal` | NutritionTracker |
| 8 | `getDailyNutrition()` | GET | `/daily-nutrition/:id` | Dashboard, NutritionTracker |
| 9 | `getRecipes()` | GET | `/recipes` | RecipeExplorer |
| 10 | `getRecipe()` | GET | `/recipes/:id` | (available) |
| 11 | `getAnalytics()` | GET | `/analytics/:id` | Dashboard, ProgressAnalytics |
| 12 | `createPost()` | POST | `/community/post` | Community |
| 13 | `getCommunityPosts()` | GET | `/community/posts` | Community |

**Base URL**: `http://localhost:5000`

## Design System (App.css — 711 lines)

### Theme: "Fresh Sage & Obsidian"

| Token | Value | Usage |
|-------|-------|-------|
| `--obsidian` | `#0d1117` | Primary background |
| `--sage` | `#6fcf97` | Primary brand color |
| `--lime` | `#b5f53f` | CTA / accent buttons |
| `--coral` | `#ff6b6b` | Warnings / alerts |
| `--amber` | `#f5a623` | Secondary accent |
| `--sky` | `#56ccf2` | Info / data viz |

### Component Styles Included

- **Layout**: Sidebar (240px fixed), Topbar (64px sticky), responsive grid (2/3/4-col)
- **Buttons**: `.btn-lime`, `.btn-sage`, `.btn-ghost`, `.btn-danger` with hover transforms
- **Cards**: `.card`, `.card-sm`, `.card-hover` with border glow on hover
- **Forms**: `.input`, `.select`, `.input-label` with sage focus ring
- **Progress**: `.progress-track`/`.progress-fill` with gradient variants
- **Modals**: Backdrop blur, scale-in animation
- **Badges**: Color-coded chips (sage, lime, coral, amber, sky)
- **Toast**: Fixed bottom-right notification with auto-dismiss
- **Animations**: `fadeInUp` (staggered), `pulse`, `spin`, `shimmer`
- **Responsive**: Sidebar hidden < 900px, grids collapse < 600px

### Typography

| Font | Family | Usage |
|------|--------|-------|
| DM Serif Display | Serif | Headings, brand, section titles |
| DM Sans | Sans-serif | Body text, buttons, labels |

## Data Visualization (Recharts)

| Screen | Chart Type | Data Source |
|--------|-----------|-------------|
| Dashboard | AreaChart | Calorie trend (from `/analytics`) |
| Dashboard | LineChart | Weight progress (from `/analytics`) |
| NutritionTracker | PieChart (donut) | Macro breakdown (protein/carbs/fats) |
| ProgressAnalytics | AreaChart | Weight history over time |
| ProgressAnalytics | BarChart | Weekly meal adherence % |

All charts use custom tooltips matching the obsidian theme.

## State Management

- **No external state library** — uses React `useState` + `useEffect` hooks
- **App-level state** (lifted to `App.js`):
  - `screen` — current active screen name
  - `userData` — shared user context (userId, name, profile, mealPlan)
  - `toast` — global toast notification
- **Navigation**: Custom `navigate(screenName, data)` function (no React Router)
- **Data flow**: Props drilled from App → Screens (`navigate`, `userData`, `showToast`)

## How to Run

```bash
npm install
npm start
```

Frontend starts at **http://localhost:3000** (requires backend on port 5000)

## Key Features

- **State-of-the-Art UI**: Dark mode with glassmorphism, gradient accents, and staggered fade-in animations
- **Full Backend Integration**: All 13 API functions connected via centralized `api.js` helper
- **3-Step Onboarding Wizard**: Collects body metrics, goals, activity level, diet & allergies
- **AI Plan Generation UX**: Animated 5-step progress screen while backend generates the meal plan
- **Real-Time Macro Tracking**: Donut chart + progress bars updating as meals are logged
- **Smart Fallbacks**: Every screen gracefully handles backend unavailability with placeholder data
- **Quick Add + Custom Logging**: 6 preset foods + full custom food modal with macro input
- **Recipe Filtering**: Multi-dimensional filters (category, diet, tags) with client-side search
- **Social Features**: Community feed with post creation (tip/milestone/meal types), leaderboard & challenges
- **Responsive Design**: Sidebar collapses on mobile, grids stack vertically on small screens
- **Toast Notifications**: Global feedback system for user actions (save, log, error)
