import React from 'react';
import { Compass, Coffee, Landmark, Utensils, Trees, Moon, ShoppingBag, Check } from 'lucide-react';
import { TRAVEL_STYLES } from '../../data/travelStyles';

const ICON_MAP = {
  Compass,
  Coffee,
  Landmark,
  Utensils,
  Trees,
  Moon,
  ShoppingBag
};

export default function StyleSelector({ selectedStyles = [], onChange }) {
  const toggleStyle = (id) => {
    if (selectedStyles.includes(id)) {
      if (selectedStyles.length > 1) {
        onChange(selectedStyles.filter(s => s !== id));
      }
    } else {
      onChange([...selectedStyles, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {TRAVEL_STYLES.map((style) => {
        const isSelected = selectedStyles.includes(style.id);
        const Icon = ICON_MAP[style.icon] || Compass;

        return (
          <button
            type="button"
            key={style.id}
            onClick={() => toggleStyle(style.id)}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              isSelected
                ? 'border-brand-teal bg-brand-teal/10 dark:bg-brand-teal/15 shadow-sm'
                : 'border-slate-200 dark:border-navy-700/80 bg-white dark:bg-navy-950 hover:border-slate-300 dark:hover:border-navy-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${
                isSelected ? 'bg-brand-teal text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-brand-teal text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className={`text-xs font-bold ${
                isSelected ? 'text-brand-teal' : 'text-slate-900 dark:text-white'
              }`}>
                {style.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {style.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
