import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Luggage, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export default function PackingAssistant({ packingList = [], onToggleItem, onAddItem, onRemoveItem }) {
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Essentials');
  const { addToast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim(), selectedCategory);
    setNewItemText('');
    addToast({
      type: 'success',
      title: 'Item Added',
      message: `"${newItemText.trim()}" added to packing checklist.`
    });
  };

  const packedCount = packingList.filter(i => i.packed).length;
  const totalCount = packingList.length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Smart Luggage
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20 font-bold">
              AI Tailored
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎒 AI Packing Assistant</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Intelligently generated checklist calibrated to your destination climate, duration, and activities
          </p>
        </div>

        {/* Packed Progress Badge */}
        <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/70 dark:border-navy-800 flex items-center gap-3 self-start sm:self-center">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Packed</div>
            <div className="text-sm font-extrabold text-brand-teal">{packedCount} / {totalCount} Items</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-brand-teal/30 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {packingList.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
              item.packed
                ? 'bg-slate-50/50 dark:bg-navy-950/40 border-slate-200/40 dark:border-navy-800 text-slate-400 dark:text-slate-500'
                : 'bg-white dark:bg-navy-900 border-slate-200/90 dark:border-navy-700/80 hover:border-brand-teal/50 text-slate-800 dark:text-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.packed ? (
                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-brand-teal" />
              )}
              <span className={`text-xs font-medium truncate ${item.packed ? 'line-through' : ''}`}>
                {item.item}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-950 text-slate-400">
                  {item.category}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove packing item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAdd} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom item (e.g. Drone, Universal Adapter, Hiking Poles)..."
          className="flex-1 w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none"
        >
          <option>Essentials</option>
          <option>Clothing</option>
          <option>Electronics</option>
          <option>Health</option>
          <option>Beach & Sun</option>
          <option>Warm Wear</option>
          <option>Accessories</option>
        </select>
        <button
          type="submit"
          disabled={!newItemText.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-teal text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </form>
    </div>
  );
}
