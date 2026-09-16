# 🌍 TripMind AI — AI-Powered Travel Planning SaaS

> **"Your Next Adventure, Planned by AI."**

TripMind AI is a modern, production-quality AI travel planning platform designed to generate personalized, day-by-day itineraries with intelligent route clustering, regional food recommendations, weather synchronization, budget transparency, and live schedule diff previews.

---

## ✨ Features

### 🇮🇳 1. India-First Travel Platform
- **Default Experience**: India is preselected by default with INR (`₹`) budgeting across 3 tiers (Budget: ₹1,500–₹3,000/day, Comfort: ₹3,000–₹7,000/day, Premium: ₹7,000+/day).
- **35+ Indian Hubs**: North, West, South, East, Central, and Northeast India.
- **Indian Transportation**: Vande Bharat & Rajdhani Express trains, domestic flights, intercity bus, taxi/cabs, self-drive, metro, and auto rickshaws.
- **Regional Food Engine**: Curated culinary guides for Delhi, Mumbai, Lucknow, Kolkata, Rajasthan, Kerala, and Goa.
- **Weekend Trip Planner**: Getaways starting from Delhi NCR, Mumbai / Pune, and Bengaluru.
- **Festival Travel**: Cultural travel across Diwali, Holi, Durga Puja, Navratri, Onam, Pushkar Camel Fair, and Christmas in Goa.

### 🌍 2. International Travel & Multi-Currency
- **14 Global Hubs**: Paris, Tokyo, Bali, Dubai, Rome, Singapore, Switzerland, New York, London, Barcelona, Bangkok, Istanbul, Maldives, Sydney.
- **Multi-Currency Support**: Instant toggle between USD ($), EUR (€), GBP (£), JPY (¥), and INR (₹).

### 🧠 3. Provider-Based AI Architecture & Security
- **No Hardcoded API Keys**: Clean separation of frontend client and AI provider layer.
- **Provider Pattern**: `travelPlannerService.js` delegates to `mockProvider.js` for instant out-of-the-box demo mode, with clean interfaces for `openaiProvider.js` and `geminiProvider.js` backend proxies.
- **Confidence Notices**: All AI estimates are clearly labelled to distinguish sample data from verified real-world bookings.

### ⚡ 4. Dynamic Itinerary & Live Diff Preview
- **Interactive Day Timeline**: Time slots, category icons, locations, costs, and edit/reorder tools.
- **✨ Regenerate Day with Live Diff Preview**: Select optimization focuses (*Make It Cheaper, Make It More Relaxed, Add More Food, Add More Adventure, Reduce Travel Time, Add Hidden Gems*) to preview a live diff of **Removed** vs. **Added** activities, **Budget impact**, and **Transit impact** before applying changes.
- **✦ Ask TripMind AI**: Floating context-aware assistant for custom schedule modifications and local travel advice.
- **🎒 AI Packing Assistant**: Climate-aware packing checklist with interactive check-offs, custom item additions, and progress tracking.
- **Interactive Map & Weather**: Map waypoints, distance clusters, and weather forecasts with *"Best outdoor hours: 10 AM – 4 PM"*.

### 📁 5. Travel Portfolio & Persistence
- **Full CRUD**: Save, Load, Rename, Duplicate, Delete, Print, and Export as JSON.
- **Search & Filters**: Search saved trips, filter by `All`, `🇮🇳 India`, or `🌍 International`, and sort by `Newest`/`Oldest`.
- **First-Visit Onboarding**: Interactive questionnaire personalizing travel styles and preferred destinations saved to `localStorage`.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript (ES6+ / JSX)
- **Styling**: Tailwind CSS, Modern CSS animations, Responsive glassmorphism
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State & Persistence**: Custom hooks (`useTripPlanner`, `useLocalStorage`, `useTheme`, `useToast`)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Ankityadav753/Trip-Mind-AI.git
cd Trip-Mind-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
