import { useState, useEffect } from 'react';
import { DAYS } from './data/constants';
import { pickRecipeForDay } from './utils/recipeSelector';
import { saveState, loadState, clearState, saveFavorites, loadFavorites } from './utils/storage';
import Header from './components/layout/Header';
import FilterBar from './components/controls/FilterBar';
import ServingInput from './components/controls/ServingInput';
import WeekPlanner from './components/planner/WeekPlanner';
import ShoppingList from './components/shopping/ShoppingList';
import FavoritesView from './components/favorites/FavoritesView';

const initialWeekPlan = () =>
  Object.fromEntries(DAYS.map(day => [day, { cuisine: '', recipe: null }]));

function initState() {
  const saved = loadState();
  if (saved) return saved;
  return { weekPlan: initialWeekPlan(), servings: 4, activeFilters: [] };
}

const { weekPlan: savedPlan, servings: savedServings, activeFilters: savedFilters } = initState();

function TabButton({ label, icon, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors
        ${active ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge > 0 && (
        <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none
          ${active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function App() {
  const [servings, setServings] = useState(savedServings);
  const [activeFilters, setActiveFilters] = useState(savedFilters);
  const [weekPlan, setWeekPlan] = useState(savedPlan);
  const [activeView, setActiveView] = useState('week');
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavorites());

  useEffect(() => {
    saveState(weekPlan, servings, activeFilters);
  }, [weekPlan, servings, activeFilters]);

  const handleCuisineChange = (day, cuisine) => {
    const recipe = cuisine ? pickRecipeForDay(cuisine, activeFilters) : null;
    setWeekPlan(prev => ({ ...prev, [day]: { cuisine, recipe } }));
  };

  const handleToggleFilter = (filter) => {
    const nextFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    setActiveFilters(nextFilters);
    setWeekPlan(prev => {
      const next = { ...prev };
      DAYS.forEach(day => {
        if (prev[day].cuisine) {
          next[day] = {
            cuisine: prev[day].cuisine,
            recipe: pickRecipeForDay(prev[day].cuisine, nextFilters),
          };
        }
      });
      return next;
    });
  };

  const handleRegenerate = (day) => {
    const { cuisine, recipe } = weekPlan[day];
    const newRecipe = pickRecipeForDay(cuisine, activeFilters, recipe?.id);
    setWeekPlan(prev => ({ ...prev, [day]: { cuisine, recipe: newRecipe } }));
  };

  const handleNewWeek = () => {
    if (!window.confirm('Start a new week? This will clear your current plan.')) return;
    clearState();
    setWeekPlan(initialWeekPlan());
    setServings(4);
    setActiveFilters([]);
    setActiveView('week');
  };

  const handleToggleFavorite = (recipeId) => {
    setFavoriteIds(prev => {
      const next = prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      saveFavorites(next);
      return next;
    });
  };

  const handleAssignToDay = (day, recipe) => {
    setWeekPlan(prev => ({ ...prev, [day]: { cuisine: recipe.cuisine, recipe } }));
    setActiveView('week');
  };

  const plannedCount = Object.values(weekPlan).filter(d => d.recipe).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FilterBar activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />

      {/* Controls bar */}
      <div className="controls-bar bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <ServingInput servings={servings} onChange={setServings} />
          <div className="flex items-center gap-3">
            {activeView === 'week' && plannedCount > 0 && (
              <button
                onClick={handleNewWeek}
                className="text-sm text-red-500 hover:text-red-600 font-medium no-print"
              >
                Start New Week
              </button>
            )}
            {/* 3-way segmented tab */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden no-print divide-x divide-gray-200">
              <TabButton
                label="Week"
                active={activeView === 'week'}
                onClick={() => setActiveView('week')}
                badge={0}
                icon={
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <TabButton
                label="Grocery"
                active={activeView === 'shopping'}
                onClick={() => setActiveView('shopping')}
                badge={plannedCount}
                icon={
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <TabButton
                label="Saved"
                active={activeView === 'favorites'}
                onClick={() => setActiveView('favorites')}
                badge={favoriteIds.length}
                icon={
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      {activeView === 'week' && (
        <WeekPlanner
          weekPlan={weekPlan}
          servings={servings}
          onCuisineChange={handleCuisineChange}
          onRegenerate={handleRegenerate}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
      {activeView === 'shopping' && (
        <div className="pt-6">
          <ShoppingList
            weekPlan={weekPlan}
            servings={servings}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      )}
      {activeView === 'favorites' && (
        <FavoritesView
          favoriteIds={favoriteIds}
          servings={servings}
          onToggleFavorite={handleToggleFavorite}
          onAssignToDay={handleAssignToDay}
          weekPlan={weekPlan}
        />
      )}
    </div>
  );
}
