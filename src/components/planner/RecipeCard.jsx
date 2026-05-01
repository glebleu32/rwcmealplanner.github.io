import Badge from '../common/Badge';

export default function RecipeCard({
  recipe,
  onRegenerate,
  expanded,
  onToggleExpand,
  servings,
  readOnly = false,
  isFavorited = false,
  onToggleFavorite,
}) {
  if (!recipe) return null;

  const visibleTags = recipe.tags.slice(0, 3);

  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Recipe header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-brand-50">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">{recipe.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onToggleFavorite && (
              <button
                onClick={e => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
                title={isFavorited ? 'Remove from saved' : 'Save recipe'}
                aria-label={isFavorited ? 'Remove from saved' : 'Save recipe'}
                className="p-0.5 transition-colors"
              >
                {isFavorited ? (
                  <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-300 hover:text-red-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                )}
              </button>
            )}
            {!readOnly && (
              <button
                onClick={onRegenerate}
                title="Get a different recipe"
                className="flex-shrink-0 text-warm-500 hover:text-warm-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          <Badge label={`⏱ ${recipe.prepTime} min`} variant="time" />
          {visibleTags.map(tag => (
            <Badge key={tag} label={tag} variant="diet" />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2">
        <p className="text-xs text-gray-500 leading-relaxed">{recipe.description}</p>
      </div>

      {/* Expand/collapse */}
      <div className="px-4 pb-3">
        <button
          onClick={onToggleExpand}
          className="text-xs text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1"
        >
          {expanded ? '▲ Hide details' : '▼ View recipe'}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Ingredients (serves {servings})
              </p>
              <ul className="space-y-0.5">
                {recipe.ingredients.map((ing, i) => {
                  const scale = servings / recipe.servingBase;
                  const display = formatIngredient(ing.qty * scale, ing.unit);
                  return (
                    <li key={i} className="text-xs text-gray-700 flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>
                        {display.qty > 0 && <span className="font-medium">{display.qty} {display.unit} </span>}
                        {ing.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Instructions
              </p>
              <ol className="space-y-1">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-xs text-gray-700 flex gap-2">
                    <span className="font-semibold text-brand-600 flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatIngredient(qty, unit) {
  const rounded = Math.round(qty * 100) / 100;
  const display = rounded === Math.floor(rounded) ? Math.floor(rounded) : rounded;
  return { qty: display, unit: unit === 'whole' ? '' : unit };
}
