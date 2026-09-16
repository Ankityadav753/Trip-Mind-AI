import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function ActivityModal({ isOpen, onClose, onSave, activityToEdit = null, dayNumber }) {
  const [time, setTime] = useState('10:00 AM');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Culture & Sightseeing');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(20);
  const [openingHours, setOpeningHours] = useState('09:00 AM – 06:00 PM');
  const [transitInfo, setTransitInfo] = useState('10 min walk');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (activityToEdit) {
      setTime(activityToEdit.time || '10:00 AM');
      setTitle(activityToEdit.title || '');
      setCategory(activityToEdit.category || 'Culture & Sightseeing');
      setLocation(activityToEdit.location || '');
      setDescription(activityToEdit.description || '');
      setEstimatedCost(activityToEdit.estimatedCost || 0);
      setOpeningHours(activityToEdit.openingHours || '');
      setTransitInfo(activityToEdit.transitInfo || '');
      setNotes(activityToEdit.notes || '');
    } else {
      setTime('10:00 AM');
      setTitle('');
      setCategory('Culture & Sightseeing');
      setLocation('');
      setDescription('');
      setEstimatedCost(20);
      setOpeningHours('09:00 AM – 06:00 PM');
      setTransitInfo('10 min walk');
      setNotes('');
    }
  }, [activityToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: activityToEdit ? activityToEdit.id : `act-user-${Date.now()}`,
      time,
      title: title.trim(),
      category,
      location: location.trim() || 'Central Location',
      description: description.trim() || 'Custom planned activity.',
      estimatedCost: Number(estimatedCost) || 0,
      openingHours: openingHours.trim(),
      transitInfo: transitInfo.trim(),
      notes: notes.trim(),
      coordinates: activityToEdit?.coordinates || { lat: 48.8566, lng: 2.3522 },
      isAiEstimated: false
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activityToEdit ? `Edit Activity for Day ${dayNumber}` : `Add Activity to Day ${dayNumber}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Time
            </label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
            >
              <option>Culture & Sightseeing</option>
              <option>Food & Dining</option>
              <option>Nature & Outdoors</option>
              <option>Adventure & Sports</option>
              <option>Relaxation & Leisure</option>
              <option>Nightlife & Entertainment</option>
              <option>Shopping & Markets</option>
              <option>Transit & Transfer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Activity Name
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Visit Centre Pompidou Modern Art"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Location / Venue
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Place Georges-Pompidou"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Estimated Cost ($ USD)
            </label>
            <input
              type="number"
              min="0"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Short Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what makes this experience special..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Opening Hours
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="e.g. 10:00 AM – 09:00 PM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Transit / Walking
            </label>
            <input
              type="text"
              value={transitInfo}
              onChange={(e) => setTransitInfo(e.target.value)}
              placeholder="e.g. 8 min walk (600m)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Personal Notes & Tips
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Buy tickets online in advance to skip queue"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 rounded-xl shadow-glow-teal hover:opacity-95 transition-all"
          >
            {activityToEdit ? 'Save Changes' : 'Add Activity'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
