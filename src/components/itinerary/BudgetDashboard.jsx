import React from 'react';
import { DollarSign, Bed, Utensils, Ticket, Train, ShoppingBag, PieChart, Info } from 'lucide-react';
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

export default function BudgetDashboard({ budgetBreakdown, durationDays = 5, currency = 'USD' }) {
  if (!budgetBreakdown) return null;

  const total = budgetBreakdown.totalEstimated || 2400;
  const dailyAvg = Math.round(total / (durationDays || 1));
  const categories = budgetBreakdown.categories || [];

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
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Intelligent Budget Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-estimated cost allocation calibrated to local seasonal market prices
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

      {/* Visual Progress Stacked Bar */}
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((cat, idx) => {
            const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <div
                key={idx}
                className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                style={{ width: `${cat.percentage}%` }}
                title={`${cat.name}: ${cat.percentage}%`}
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
                    ~{formatCurrency(Math.round(cat.amount / (durationDays || 1)), currency)}/d
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/50 dark:border-navy-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-brand-teal shrink-0" />
        <span>
          Recommended contingency reserve: <strong>{formatCurrency(Math.round(total * 0.12), currency)}</strong> for spontaneous discoveries, tips, and souvenirs.
        </span>
      </div>
    </div>
  );
}
