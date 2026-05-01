import { DAYS } from '../../data/constants';
import DayCard from './DayCard';

export default function WeekPlanner({ weekPlan, servings, onCuisineChange, onRegenerate, favoriteIds, onToggleFavorite }) {
  return (
    <div className="week-planner max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Week</h2>
        <p className="text-sm text-gray-400">
          {Object.values(weekPlan).filter(d => d.recipe).length} of 7 days planned
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {DAYS.map(day => (
          <DayCard
            key={day}
            day={day}
            cuisine={weekPlan[day].cuisine}
            recipe={weekPlan[day].recipe}
            servings={servings}
            onCuisineChange={cuisine => onCuisineChange(day, cuisine)}
            onRegenerate={() => onRegenerate(day)}
            isFavorited={weekPlan[day].recipe ? favoriteIds.includes(weekPlan[day].recipe.id) : false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
