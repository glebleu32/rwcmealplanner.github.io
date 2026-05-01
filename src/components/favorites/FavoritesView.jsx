import { useState } from 'react';
import { recipes } from '../../data/recipes';
import { DAYS } from '../../data/constants';
import RecipeCard from '../planner/RecipeCard';

const DAY_ABBREVS = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

export default function FavoritesView({ favoriteIds, servings, onToggleFavorite, onAssignToDay, weekPlan }) {
  const [expandedId, setExpandedId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const favoriteRecipes = favoriteIds
    .map(id => recipes.find(r => r.id === id))
    .filter(Boolean);

  if (favoriteRecipes.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
          <p className="text-4xl mb-3">🤍</p>
          <p className="text-gray-700 font-semibold mb-1">No saved recipes yet</p>
          <p className="text-sm text-gray-400">Tap the heart on any recipe card to save it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Saved Recipes</h2>
        <p className="text-sm text-gray-400">{favoriteRecipes.length} saved</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteRecipes.map(recipe => (
          <FavoriteCard
            key={recipe.id}
            recipe={recipe}
            servings={servings}
            expanded={expandedId === recipe.id}
            onToggleExpand={() => setExpandedId(id => id === recipe.id ? null : recipe.id)}
            onToggleFavorite={onToggleFavorite}
            assigningOpen={assigningId === recipe.id}
            onToggleAssigning={() => setAssigningId(id => id === recipe.id ? null : recipe.id)}
            onAssignToDay={day => { onAssignToDay(day, recipe); setAssigningId(null); }}
            weekPlan={weekPlan}
          />
        ))}
      </div>
    </div>
  );
}

function FavoriteCard({
  recipe, servings, expanded, onToggleExpand,
  onToggleFavorite, assigningOpen, onToggleAssigning,
  onAssignToDay, weekPlan,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <RecipeCard
        recipe={recipe}
        servings={servings}
        readOnly
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        onRegenerate={() => {}}
        isFavorited={true}
        onToggleFavorite={onToggleFavorite}
      />

      {/* Add to Week */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={onToggleAssigning}
          className={`
            w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
            border transition-colors
            ${assigningOpen
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-white text-brand-700 border-brand-300 hover:bg-brand-50'
            }
          `}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {assigningOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            }
          </svg>
          {assigningOpen ? 'Cancel' : 'Add to Week'}
        </button>

        {assigningOpen && (
          <DayPicker weekPlan={weekPlan} onSelectDay={onAssignToDay} />
        )}
      </div>
    </div>
  );
}

function DayPicker({ weekPlan, onSelectDay }) {
  return (
    <div className="mt-2 grid grid-cols-7 gap-1">
      {DAYS.map(day => {
        const hasRecipe = !!weekPlan[day]?.recipe;
        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            title={hasRecipe ? `Replace ${day}'s meal` : `Add to ${day}`}
            className={`
              flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-semibold
              transition-colors border
              ${hasRecipe
                ? 'bg-warm-50 border-warm-400 text-warm-600 hover:bg-warm-100'
                : 'bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100'
              }
            `}
          >
            <span>{DAY_ABBREVS[day]}</span>
            {hasRecipe && <span className="text-warm-400 text-[9px] leading-none mt-0.5">●</span>}
          </button>
        );
      })}
    </div>
  );
}
