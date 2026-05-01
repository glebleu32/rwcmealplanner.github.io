import { useState } from 'react';
import { buildShoppingList } from '../../utils/shoppingList';
import StoreSection from './StoreSection';
import RecipeCard from '../planner/RecipeCard';
import Button from '../common/Button';
import { DAYS } from '../../data/constants';

export default function ShoppingList({ weekPlan, servings, favoriteIds = [], onToggleFavorite }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const planned = Object.values(weekPlan).filter(d => d.recipe);

  if (planned.length === 0) {
    return (
      <div className="shopping-list max-w-screen-xl mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-gray-500 font-medium">Add meals to your week to generate a shopping list.</p>
        </div>
      </div>
    );
  }

  const grouped = buildShoppingList(weekPlan, servings);
  const sections = Object.entries(grouped);
  const totalItems = sections.reduce((sum, [, items]) => sum + items.length, 0);

  return (
    <div className="shopping-list max-w-screen-xl mx-auto px-4 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Grocery List</h2>
          <p className="text-sm text-gray-500">
            {totalItems} items across {sections.length} sections · {planned.length} meals planned
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => window.print()} className="no-print self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print List
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(([sectionName, items]) => (
          <StoreSection key={sectionName} sectionName={sectionName} items={items} />
        ))}
      </div>

      {/* This Week's Meals */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">This Week's Meals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.filter(day => weekPlan[day]?.recipe).map(day => (
            <div key={day} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-brand-500 px-4 py-2">
                <p className="text-xs font-bold uppercase tracking-widest text-white">{day}</p>
              </div>
              <div className="p-3">
                <RecipeCard
                  recipe={weekPlan[day].recipe}
                  servings={servings}
                  readOnly
                  expanded={expandedDay === day}
                  onToggleExpand={() => setExpandedDay(d => d === day ? null : day)}
                  onRegenerate={() => {}}
                  isFavorited={favoriteIds.includes(weekPlan[day].recipe.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
