import { useState } from 'react';
import CuisineSelect from './CuisineSelect';
import RecipeCard from './RecipeCard';

export default function DayCard({ day, cuisine, recipe, servings, onCuisineChange, onRegenerate, isFavorited, onToggleFavorite }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-brand-500 px-4 py-2">
        <p className="text-xs font-bold uppercase tracking-widest text-white">{day}</p>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <CuisineSelect
          value={cuisine}
          onChange={newCuisine => {
            setExpanded(false);
            onCuisineChange(newCuisine);
          }}
        />

        {recipe ? (
          <RecipeCard
            recipe={recipe}
            servings={servings}
            onRegenerate={() => { setExpanded(false); onRegenerate(); }}
            expanded={expanded}
            onToggleExpand={() => setExpanded(e => !e)}
            isFavorited={isFavorited}
            onToggleFavorite={onToggleFavorite}
          />
        ) : cuisine ? (
          <div className="mt-3 flex-1 flex items-center justify-center py-6">
            <p className="text-sm text-gray-400 italic">No matching recipe found</p>
          </div>
        ) : (
          <div className="mt-3 flex-1 flex items-center justify-center py-6">
            <p className="text-sm text-gray-300 italic">Select a cuisine above</p>
          </div>
        )}
      </div>
    </div>
  );
}
