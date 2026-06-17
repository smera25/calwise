import React, { useState } from 'react';
import './App.css';

import LandingPage    from './screens/LandingPage';
import LoginSignup    from './screens/LoginSignup';
import ProfileSetup   from './screens/ProfileSetup';
import GeneratingPlan from './screens/GeneratingPlan';
import Dashboard      from './screens/Dashboard';
import MealPlanner    from './screens/MealPlanner';
import NutritionTracker from './screens/NutritionTracker';
import RecipeExplorer from './screens/RecipeExplorer';
import ProgressAnalytics from './screens/ProgressAnalytics';
import Community      from './screens/Community';
import Settings       from './screens/Settings';
import Sidebar        from './components/Sidebar';
import Topbar         from './components/Topbar';

const AUTH_SCREENS = ['landing', 'login', 'profile', 'generating'];

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [userData, setUserData] = useState({ name: 'Aarav', plan: 'Pro' });
  const [toast, setToast]   = useState(null);

  const navigate = (to, data = {}) => {
    setUserData(prev => ({ ...prev, ...data }));
    setScreen(to);
    window.scrollTo(0, 0);
  };

  const showToast = (msg, icon = '✅') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const isAuth = AUTH_SCREENS.includes(screen);

  const pageTitle = {
    dashboard: 'Dashboard',
    planner:   'Meal Planner',
    nutrition: 'Nutrition Tracker',
    recipes:   'Recipe Explorer',
    progress:  'Progress Analytics',
    community: 'Community',
    settings:  'Settings',
  }[screen] || '';

  const renderScreen = () => {
    const props = { navigate, userData, showToast };
    switch (screen) {
      case 'landing':   return <LandingPage {...props} />;
      case 'login':     return <LoginSignup {...props} />;
      case 'profile':   return <ProfileSetup {...props} />;
      case 'generating': return <GeneratingPlan {...props} />;
      case 'dashboard': return <Dashboard {...props} />;
      case 'planner':   return <MealPlanner {...props} />;
      case 'nutrition': return <NutritionTracker {...props} />;
      case 'recipes':   return <RecipeExplorer {...props} />;
      case 'progress':  return <ProgressAnalytics {...props} />;
      case 'community': return <Community {...props} />;
      case 'settings':  return <Settings {...props} />;
      default:          return <Dashboard {...props} />;
    }
  };

  if (isAuth) {
    return (
      <div className="app">
        {renderScreen()}
        {toast && (
          <div className="toast">
            <span className="toast-icon">{toast.icon}</span>
            <span className="toast-msg">{toast.msg}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar screen={screen} navigate={navigate} userData={userData} />
      <div className="main-content">
        <Topbar title={pageTitle} navigate={navigate} userData={userData} />
        {renderScreen()}
      </div>
      {toast && (
        <div className="toast">
          <span className="toast-icon">{toast.icon}</span>
          <span className="toast-msg">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
