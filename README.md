# CalWise V2 — Premium Redesign

A fully responsive, production-grade React frontend for CalWise.

## 🎨 Design System: "Fresh Sage & Obsidian"

| Token | Value | Usage |
|-------|-------|-------|
| `--obsidian` | `#0d1117` | App background |
| `--obsidian-2` | `#161b22` | Cards, sidebar |
| `--sage` | `#6fcf97` | Primary brand, success |
| `--lime` | `#b5f53f` | CTA buttons, highlights |
| `--coral` | `#ff6b6b` | Warnings, danger |
| `--amber` | `#f5a623` | Fats, secondary info |
| `--sky` | `#56ccf2` | Carbs, info states |

**Fonts:** `DM Serif Display` (headings) + `DM Sans` (body)

---

## 📱 Screens (11 total)

| Screen | Route | Description |
|--------|-------|-------------|
| Landing Page | `landing` | Hero, features, stats, CTA |
| Login / Signup | `login` | Split-panel auth with testimonials |
| Profile Setup | `profile` | 3-step onboarding wizard |
| Generating Plan | `generating` | Animated AI loading with steps |
| **Dashboard** | `dashboard` | Stat cards, macros, charts |
| **Meal Planner** | `planner` | Day nav, expandable meal cards |
| **Nutrition Tracker** | `nutrition` | Food log, macro ring, hydration |
| **Recipe Explorer** | `recipes` | Filterable recipe grid |
| **Progress Analytics** | `progress` | Weight chart, adherence, milestones |
| **Community** | `community` | Feed, leaderboard, challenges |
| **Settings** | `settings` | Goals, notifications, preferences |

---

## 🚀 Getting Started

```bash
unzip calwise-v2.zip
cd calwise-v2
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

**Flow:** Landing → Login → Profile Setup → Generating → Dashboard

Then navigate using the sidebar.

---

## 🧱 Tech Stack

- **React 18** — UI framework
- **Recharts** — Charts (AreaChart, LineChart, BarChart, PieChart)
- **CSS Variables** — Full design token system
- **Google Fonts** — DM Serif Display + DM Sans

## 📁 Project Structure

```
src/
├── App.js                 # Root router
├── App.css                # Global design system
├── index.js               # Entry point
├── components/
│   ├── Sidebar.js         # Persistent nav sidebar
│   └── Topbar.js          # Top header bar
└── screens/
    ├── LandingPage.js
    ├── LoginSignup.js
    ├── ProfileSetup.js
    ├── GeneratingPlan.js
    ├── Dashboard.js
    ├── MealPlanner.js
    ├── NutritionTracker.js
    ├── RecipeExplorer.js
    ├── ProgressAnalytics.js
    ├── Community.js
    └── Settings.js
```

## ✨ Key Features

- **Persistent sidebar** with active state highlighting
- **Smooth animations** — staggered fade-up on every page
- **Interactive charts** — Recharts with custom dark tooltips
- **Macro ring** — PieChart in Nutrition Tracker
- **Recipe filtering** — by category, diet, tags, search
- **Community feed** — like, join challenges, leaderboard
- **Settings panel** — toggles, inputs, danger zone
- **Toast notifications** — feedback on every action
- **Fully responsive** — collapses sidebar on mobile

---

*Built with ❤️ — CalWise V2*
