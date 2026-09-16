import React from 'react';
import { Utensils, Sparkles, Flame, Heart } from 'lucide-react';

const REGIONAL_CUISINES = {
  delhi: {
    region: 'Delhi NCR',
    dishes: [
      { name: 'Chole Bhature', desc: 'Fluffy fried sourdough bread served with spicy, tangy dark chickpea curry and pickled ginger.', bestPlace: 'Sita Ram Diwan Chand, Paharganj' },
      { name: 'Old Delhi Butter Chicken', desc: 'Charcoal-tandoor grilled chicken simmered in a silky tomato, cream, and fenugreek gravy.', bestPlace: 'Moti Mahal / Aslam Butter Chicken' },
      { name: 'Mughlai Seekh Kebabs', desc: 'Melt-in-mouth spiced minced meat skewers grilled over burning coals.', bestPlace: 'Karim’s, Jama Masjid' },
      { name: 'Dahi Bhalla & Papdi Chaat', desc: 'Lentil fritters soaked in sweetened yoghurt topped with tamarind & mint chutney.', bestPlace: 'Natraj Dahi Bhalla, Chandni Chowk' }
    ]
  },
  mumbai: {
    region: 'Maharashtra',
    dishes: [
      { name: 'Vada Pav', desc: 'Golden fried spiced potato fritter sandwiched in soft pav smeared with dry garlic-peanut chutney.', bestPlace: 'Aram Milk Bar / Ashok Vada Pav' },
      { name: 'Pav Bhaji', desc: 'Mashed spiced mixed vegetable curry cooked with generous butter on a giant iron tawa.', bestPlace: 'Sardar Refreshments, Tardeo' },
      { name: 'Puneri & Kolhapuri Misal Pav', desc: 'Sprouted moth beans in a fiery red gravy (tarri) topped with crunchy farsan and chopped onions.', bestPlace: 'Aaswad, Dadar' },
      { name: 'Bombil (Bombay Duck) Fry', desc: 'Crispy rava-crusted fresh coastal fish fried golden with fiery Koli green masala.', bestPlace: 'Gajalee / Mahesh Lunch Home' }
    ]
  },
  lucknow: {
    region: 'Awadh / Uttar Pradesh',
    dishes: [
      { name: 'Galouti Kebab', desc: 'Legendary royal minced meat kebab marinated with 160 secret herbs and spices, melting on the tongue.', bestPlace: 'Tunday Kababi, Chowk' },
      { name: 'Awadhi Dum Biryani', desc: 'Fragrant long-grain basmati rice cooked on slow charcoal dum with tender saffron-infused mutton.', bestPlace: 'Idris Biryani / Dastarkhwan' },
      { name: 'Sheermal & Nihari', desc: 'Slow-simmered rich shank stew served with saffron-brushed sweet flatbreads at dawn.', bestPlace: 'Mubin’s, Akbari Gate' }
    ]
  },
  kolkata: {
    region: 'Bengal',
    dishes: [
      { name: 'Kolkata Kathi Roll', desc: 'Flaky paratha layered with egg, tender marinated chicken/paneer, crisp onions and fresh lime.', bestPlace: 'Nizam’s, New Market' },
      { name: 'Mishti Doi & Rosogolla', desc: 'Caramelized sweet terracotta baked curd and spongy cottage cheese balls steeped in light syrup.', bestPlace: 'K.C. Das & Balaram Mullick' },
      { name: 'Shorshe Ilish (Hilsa Fish Curry)', desc: 'Tender Hilsa fish steamed in stone-ground mustard paste, green chillies and mustard oil.', bestPlace: '6 Ballygunge Place / Oh! Calcutta' },
      { name: 'Kolkata Mutton Biryani', desc: 'Fragrant Awadhi-style biryani uniquely paired with velvety spiced whole potatoes and boiled egg.', bestPlace: 'Arsalan / Shiraz Golden Restaurant' }
    ]
  },
  rajasthan: {
    region: 'Rajasthan (Jaipur / Udaipur / Jodhpur)',
    dishes: [
      { name: 'Dal Baati Churma', desc: 'Baked hard wheat balls crushed in pure desi ghee, served with 5-lentil panchmel dal and sweet powdered jaggery churma.', bestPlace: 'Chokhi Dhani / LMB' },
      { name: 'Laal Maas', desc: 'Royal Rajasthani fiery smoked mutton curry braised with mathania red chillies.', bestPlace: 'Handi Restaurant, MI Road' },
      { name: 'Pyaaz & Mawa Kachori', desc: 'Golden crispy flaky pastry stuffed with caramelized spiced onions or sweetened dry fruits.', bestPlace: 'Rawat Mishthan Bhandar' },
      { name: 'Ker Sangri', desc: 'Desert berries and wild dried beans slow-cooked with sour curd and aromatic dry spices.', bestPlace: 'Traditional Haveli Kitchens' }
    ]
  },
  kerala: {
    region: 'Kerala (Kochi / Munnar / Alleppey)',
    dishes: [
      { name: 'Appam with Coconut Stew', desc: 'Lacy fermented rice pancakes with a soft spongy center paired with aromatic coconut milk vegetable/chicken stew.', bestPlace: 'Grand Pavilion, Kochi' },
      { name: 'Karimeen Pollichathu', desc: 'Fresh backwater Pearl Spot fish marinated in shallots, ginger, tomato paste and pan-roasted inside a banana leaf.', bestPlace: 'Fort Kochi Shacks' },
      { name: 'Kerala Sadya Feast', desc: 'Grand vegetarian banquet of 24+ dishes served on fresh plantain leaf with red rice and payasam.', bestPlace: 'BTH Sarovaram' },
      { name: 'Malabar Parotta & Beef Roast', desc: 'Flaky multi-layered parotta torn and dipped into caramelized black pepper spiced roast.', bestPlace: 'Paragon Restaurant' }
    ]
  },
  goa: {
    region: 'Goa',
    dishes: [
      { name: 'Goan Fish Curry with Rice', desc: 'Fresh Kingfish or Pomfret simmered in fresh ground coconut, red chillies and sour kokum.', bestPlace: 'Vinayak Family Restaurant, Assagao' },
      { name: 'Pork / Chicken Vindaloo', desc: 'Portuguese-influenced fiery curry flavored with palm vinegar, garlic, and Kashmiri chillies.', bestPlace: 'Mum’s Kitchen, Panaji' },
      { name: 'Bebinca Layered Cake', desc: 'Traditional 7 to 16-layer baked pudding made with coconut milk, egg yolks, sugar, and ghee.', bestPlace: 'Confeitaria 31 De Janeiro' }
    ]
  }
};

export default function RegionalFoodGuide({ city = '', state = '' }) {
  // Normalize
  const normalized = city.toLowerCase();
  let selected = null;

  if (normalized.includes('delhi') || normalized.includes('agra')) selected = REGIONAL_CUISINES.delhi;
  else if (normalized.includes('mumbai') || normalized.includes('pune') || normalized.includes('lonavala')) selected = REGIONAL_CUISINES.mumbai;
  else if (normalized.includes('jaipur') || normalized.includes('udaipur') || normalized.includes('jodhpur') || normalized.includes('jaisalmer')) selected = REGIONAL_CUISINES.rajasthan;
  else if (normalized.includes('kochi') || normalized.includes('munnar') || normalized.includes('kerala') || normalized.includes('wayanad')) selected = REGIONAL_CUISINES.kerala;
  else if (normalized.includes('goa')) selected = REGIONAL_CUISINES.goa;
  else if (normalized.includes('kolkata')) selected = REGIONAL_CUISINES.kolkata;
  else selected = REGIONAL_CUISINES.delhi;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Culinary Heritage
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
              Must-Eat Regional Dishes
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Signature Regional Food Guide</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {selected.region}: Authentic culinary experiences vetted by generational local cooks
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 self-start sm:self-center">
          <Utensils className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selected.dishes.map((dish, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-navy-950/50 border border-slate-200/60 dark:border-navy-800/80 hover:border-amber-500/40 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{dish.name}</span>
              </h4>
              <span className="text-[10px] font-semibold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-md">
                Local Classic
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {dish.desc}
            </p>

            <div className="pt-1.5 border-t border-slate-200/50 dark:border-navy-800 text-[11px] text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Recommended Spot: </strong>
              {dish.bestPlace}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
