import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Sparkles, MapPin, Calendar } from 'lucide-react';
import ActivityCard from './ActivityCard';
import ActivityModal from './ActivityModal';
import RegenerateDayModal from './RegenerateDayModal';
import { regenerateDay } from '../../services/travelPlannerService';

export default function DayTimeline({
  days = [],
  onUpdateDay,
  onHighlightMap,
  currency = 'USD'
}) {
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [modalState, setModalState] = useState({ isOpen: false, dayNumber: null, activityToEdit: null });
  const [regenModalState, setRegenModalState] = useState({ isOpen: false, dayNumber: null, isRegenerating: false });

  const toggleDay = (dayNum) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleMoveActivity = (dayIndex, actIndex, direction) => {
    const day = days[dayIndex];
    if (!day) return;
    const acts = [...day.activities];
    const targetIdx = direction === 'up' ? actIndex - 1 : actIndex + 1;
    if (targetIdx < 0 || targetIdx >= acts.length) return;

    // Swap
    const temp = acts[actIndex];
    acts[actIndex] = acts[targetIdx];
    acts[targetIdx] = temp;

    onUpdateDay(day.dayNumber, { ...day, activities: acts });
  };

  const handleDeleteActivity = (dayIndex, activityId) => {
    const day = days[dayIndex];
    if (!day) return;
    const filtered = day.activities.filter(a => a.id !== activityId);
    onUpdateDay(day.dayNumber, { ...day, activities: filtered });
  };

  const handleSaveActivity = (savedAct) => {
    const dayNum = modalState.dayNumber;
    const day = days.find(d => d.dayNumber === dayNum);
    if (!day) return;

    let updatedActs;
    if (modalState.activityToEdit) {
      updatedActs = day.activities.map(a => a.id === savedAct.id ? savedAct : a);
    } else {
      updatedActs = [...day.activities, savedAct];
    }
    onUpdateDay(dayNum, { ...day, activities: updatedActs });
  };

  const handleRegenerateOption = async (optionType) => {
    setRegenModalState(prev => ({ ...prev, isRegenerating: true }));
    const dayNum = regenModalState.dayNumber;
    const day = days.find(d => d.dayNumber === dayNum);

    if (day) {
      const updatedDay = await regenerateDay(day, { destination: day.neighborhood || 'City' }, optionType);
      onUpdateDay(dayNum, updatedDay);
    }
    setRegenModalState({ isOpen: false, dayNumber: null, isRegenerating: false });
  };

  return (
    <div className="space-y-6">
      {days.map((day, dayIndex) => {
        const isExpanded = !!expandedDays[day.dayNumber];

        return (
          <div
            key={day.dayNumber}
            className="rounded-3xl border border-slate-200/80 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 overflow-hidden transition-all shadow-xs"
          >
            {/* Day Header Accordion Toggle */}
            <div
              onClick={() => toggleDay(day.dayNumber)}
              className="p-5 sm:p-6 bg-white dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800/80 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-slate-50/70 dark:hover:bg-navy-850 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-sky via-brand-teal to-teal-500 text-white flex flex-col items-center justify-center font-mono font-extrabold shadow-sm shrink-0">
                  <span className="text-[10px] uppercase font-sans font-bold leading-none tracking-widest text-slate-100">DAY</span>
                  <span className="text-lg leading-none mt-0.5">{String(day.dayNumber).padStart(2, '0')}</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {day.title}
                    </h3>
                    {day.neighborhood && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-medium">
                        📍 {day.neighborhood}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {day.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons & Caret */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                {/* Regenerate Button */}
                <button
                  type="button"
                  onClick={() => setRegenModalState({ isOpen: true, dayNumber: day.dayNumber, isRegenerating: false })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/20 transition-colors"
                  title="Regenerate this specific day"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regenerate Day</span>
                </button>

                {/* Add Activity Button */}
                <button
                  type="button"
                  onClick={() => setModalState({ isOpen: true, dayNumber: day.dayNumber, activityToEdit: null })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleDay(day.dayNumber)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
                  aria-label={isExpanded ? 'Collapse day' : 'Expand day'}
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Activities Timeline */}
            {isExpanded && (
              <div className="p-4 sm:p-6 space-y-4">
                {day.activities && day.activities.length > 0 ? (
                  day.activities.map((act, actIdx) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      index={actIdx}
                      totalActivities={day.activities.length}
                      onMoveUp={() => handleMoveActivity(dayIndex, actIdx, 'up')}
                      onMoveDown={() => handleMoveActivity(dayIndex, actIdx, 'down')}
                      onEdit={() => setModalState({ isOpen: true, dayNumber: day.dayNumber, activityToEdit: act })}
                      onDelete={(id) => handleDeleteActivity(dayIndex, id)}
                      onHighlightMap={onHighlightMap}
                      currency={currency}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-navy-700 bg-white/50 dark:bg-navy-900/50">
                    <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No activities on this day yet</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Add custom sightseeing spots, restaurants, or click Regenerate to auto-populate with AI.
                    </p>
                    <button
                      onClick={() => setModalState({ isOpen: true, dayNumber: day.dayNumber, activityToEdit: null })}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-teal text-white shadow-sm hover:opacity-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Activity</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add / Edit Activity Modal */}
      <ActivityModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, dayNumber: null, activityToEdit: null })}
        dayNumber={modalState.dayNumber}
        activityToEdit={modalState.activityToEdit}
        onSave={handleSaveActivity}
      />

      {/* Regenerate Day Modal */}
      <RegenerateDayModal
        isOpen={regenModalState.isOpen}
        onClose={() => setRegenModalState({ isOpen: false, dayNumber: null, isRegenerating: false })}
        dayNumber={regenModalState.dayNumber}
        day={days.find(d => d.dayNumber === regenModalState.dayNumber)}
        currency={currency}
        onApplyChanges={(dayNum, proposedDay) => {
          onUpdateDay(dayNum, proposedDay);
        }}
      />
    </div>
  );
}
