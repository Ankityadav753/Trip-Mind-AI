import React from 'react';
import { DollarSign, Bed, Utensils, Ticket, Train, ShoppingBag, PieChart, Info, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_ICONS = {
  Bed,
  Utensils,
  Ticket,
  Train,
  ShoppingBag
};

const CATEGORY_COLORS = [
  'from-sky-400 to-blue-600',
  'from-teal-400 to-emerald-600',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-600',
  'from-purple-400 to-indigo-600'
];

export default function BudgetDashboard({ budgetBreakdown, durationDays = 5, currency = 'INR' }) {
  if (!budgetBreakdown) return null;

  const total = Number(budgetBreakdown.total ?? budgetBreakdown.totalEstimated) || 0;
  const dailyAvg = budgetBreakdown.dailyAverage || Math.round(total / Math.max(1, durationDays || 1));
  const categories = budgetBreakdown.categories || [];

  // Direct component amounts with clean fallbacks from categories or root fields
  const accommodation = budgetBreakdown.accommodation ?? (categories.find(c => c.name.toLowerCase().includes('accommodation'))?.amount || 0);
  const food = budgetBreakdown.food ?? (categories.find(c => c.name.toLowerCase().includes('food'))?.amount || 0);
  const transportation = budgetBreakdown.localTransport ?? (categories.find(c => c.name.toLowerCase().includes('transport'))?.amount || 0);
  const activities = budgetBreakdown.activities ?? (categories.find(c => c.name.toLowerCase().includes('activit'))?.amount || 0);
  const miscellaneous = budgetBreakdown.miscellaneous ?? (categories.find(c => c.name.toLowerCase().includes('misc'))?.amount || 0);

  const breakdownRows = [
    { label: 'Accommodation', amount: accommodation, icon: Bed, note: 'Per room rate' },
    { label: 'Food', amount: food, icon: Utensils, note: 'Daily per traveler' },
    { label: 'Transportation', amount: transportation, icon: Train, note: 'Group local transit' },
    { label: 'Activities', amount: activities, icon: Ticket, note: 'Attractions & sights' },
    { label: 'Miscellaneous', amount: miscellaneous, icon: ShoppingBag, note: '8% contingency reserve' }
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Estimated Trip Budget
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <ShieldCheck className="w-3 h-3" />
                  Deterministic Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Estimated using TripMind reference pricing
              </p>
            </div>
          </div>
        </div>

        {/* Totals Pills */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/70 dark:border-navy-800 text-right">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Estimated Total
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(total, currency)}
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/70 dark:border-navy-800 text-right">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Daily Average
            </div>
            <div className="text-base font-extrabold text-brand-teal">
              {formatCurrency(dailyAvg, currency)}<span className="text-xs font-normal text-slate-400">/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Reference Breakdown Table */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/30 overflow-hidden">
        <div className="px-4 py-3 bg-slate-100/60 dark:bg-navy-900/60 border-b border-slate-200/60 dark:border-navy-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <span>Expense Category</span>
          <span>Estimated Amount</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-navy-800/60 text-sm">
          {breakdownRows.map((row, idx) => {
            const Icon = row.icon;
            return (
              <div key={idx} className="px-4 py-2.5 flex items-center justify-between hover:bg-white/60 dark:hover:bg-navy-900/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{row.label}</span>
                    <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-400">({row.note})</span>
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(row.amount, currency)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-4 py-3 bg-slate-100/80 dark:bg-navy-900/90 border-t border-slate-200 dark:border-navy-700 flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
          <div className="flex items-center gap-2">
            <span>Estimated Total</span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">({currency})</span>
          </div>
          <div className="text-base text-brand-teal font-extrabold">
            {formatCurrency(total, currency)}
          </div>
        </div>
      </div>

      {/* Visual Progress Stacked Bar */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((cat, idx) => {
            const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <div
                key={idx}
                className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                style={{ width: `${cat.percentage}%` }}
                title={`${cat.name}: ${cat.percentage}% (${formatCurrency(cat.amount, currency)})`}
              />
            );
          })}
        </div>

        {/* Legend / Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {categories.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat.icon] || DollarSign;
            const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${colorClass} text-white flex items-center justify-center shadow-xs shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {cat.percentage}% of total
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(cat.amount, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ~{formatCurrency(Math.round(cat.amount / Math.max(1, durationDays || 1)), currency)}/d
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reference Disclaimer & Contingency Note */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/50 dark:border-navy-800/60 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-teal shrink-0" />
          <span>
            Estimated using TripMind reference pricing • Includes ~8% contingency reserve (<strong>{formatCurrency(miscellaneous, currency)}</strong>) for spontaneous discoveries.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
          Non-contractual estimate
        </span>
      </div>
    </div>
  );
}
