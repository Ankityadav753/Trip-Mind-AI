import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Clock, MapPin, ArrowRight, Sparkles, Car } from 'lucide-react';
import { INDIAN_DESTINATIONS } from '../../data/indianDestinations';

const WEEKEND_HUBS = {
  delhi: {
    city: 'Delhi NCR',
    getaways: [
      { id: 'agra', duration: '1–2 Days', travelTime: '3.5 hrs (Yamuna Expressway)', highlight: 'Taj Mahal & Petha Street' },
      { id: 'jaipur', duration: '2–3 Days', travelTime: '4 hrs (Vande Bharat / Expressway)', highlight: 'Fortresses & Royal Rajasthani Thali' },
      { id: 'rishikesh', duration: '2–3 Days', travelTime: '4.5 hrs (Train / Road)', highlight: 'White Water Rafting & Ganga Aarti' },
      { id: 'shimla', duration: '3 Days', travelTime: '6.5 hrs (via Kalka)', highlight: 'Pine Ridge & Mall Road Walks' }
    ]
  },
  mumbai: {
    city: 'Mumbai / Pune',
    getaways: [
      { id: 'lonavala', duration: '1–2 Days', travelTime: '2 hrs (Mumbai-Pune Expressway)', highlight: 'Misty Waterfalls & Pawna Lake' },
      { id: 'goa', duration: '3–4 Days', travelTime: '1 hr flight / Vande Bharat', highlight: 'Sun-drenched Beaches & Coastal Seafood' },
      { id: 'pune', duration: '2 Days', travelTime: '2.5 hrs (Expressway)', highlight: 'Maratha Forts & Artisan Breweries' },
      { id: 'mount-abu', duration: '3 Days', travelTime: 'Overnight Train / Drive', highlight: 'Serene Aravalli Lake & Dilwara Temples' }
    ]
  },
  bengaluru: {
    city: 'Bengaluru',
    getaways: [
      { id: 'mysore', duration: '1–2 Days', travelTime: '1.5 hrs (Bengaluru-Mysuru Expressway)', highlight: 'Illuminated Palace & Silk Markets' },
      { id: 'coorg', duration: '2–3 Days', travelTime: '5 hrs drive', highlight: 'Misty Coffee Estates & Abbey Falls' },
      { id: 'ooty', duration: '3 Days', travelTime: '6 hrs drive / Train', highlight: 'UNESCO Nilgiri Toy Train & Pine Hills' },
      { id: 'hampi', duration: '3–4 Days', travelTime: '6 hrs Vande Bharat train', highlight: 'Vijayanagara Stone Chariots & Coracles' }
    ]
  }
};

export default function WeekendTripPlanner() {
  const navigate = useNavigate();
  const [activeHub, setActiveHub] = useState('delhi');
  const [selectedDuration, setSelectedDuration] = useState('2 Days');

  const durations = ['1 Day', '2 Days', '3 Days', 'Long Weekend'];

  const currentHubData = WEEKEND_HUBS[activeHub] || WEEKEND_HUBS.delhi;

  const handlePlan = (destId) => {
    const dest = INDIAN_DESTINATIONS.find(d => d.id === destId);
    const destName = dest ? `${dest.city}, India` : 'Jaipur, India';
    navigate(`/planner?destination=${encodeURIComponent(destName)}&type=india`);
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-navy-950/60 border-t border-slate-200/60 dark:border-navy-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-2">
              <Car className="w-3.5 h-3.5" />
              <span>Quick Getaways</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Plan a Weekend Trip 🇮🇳
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Select your departure hub and escape the city with handpicked road and rail getaways
            </p>
          </div>

          {/* Hub Selector Pills */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-navy-900 p-1.5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xs self-start sm:self-auto">
            {Object.keys(WEEKEND_HUBS).map((hubKey) => (
              <button
                key={hubKey}
                onClick={() => setActiveHub(hubKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeHub === hubKey
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                From {WEEKEND_HUBS[hubKey].city}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentHubData.getaways.map((item) => {
            const dest = INDIAN_DESTINATIONS.find(d => d.id === item.id);
            if (!dest) return null;

            return (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                      {item.duration}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-semibold text-brand-sky uppercase tracking-wider">
                        {dest.state}
                      </span>
                      <h3 className="text-lg font-bold truncate">
                        {dest.city}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-brand-teal font-semibold">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.travelTime}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.highlight}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500">
                      <span>Est. from</span>
                      <strong className="text-slate-900 dark:text-white font-bold">
                        ₹{dest.startingDailyBudget.toLocaleString('en-IN')}/day
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => handlePlan(dest.id)}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-slate-900 dark:bg-navy-800 hover:bg-brand-teal dark:hover:bg-brand-teal transition-all flex items-center justify-center gap-1.5 group/btn"
                  >
                    <span>Plan Weekend Trip</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
