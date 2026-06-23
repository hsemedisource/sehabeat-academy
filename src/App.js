import { useState } from "react";
import { Flame, Activity, TrendingUp, Zap } from "lucide-react";

// ─── 1. Constants & Helper ────────────────────────────────────────────────────
const INIT_PROFILE = { name: "Sulaiman Ahmed", targetCalories: 2000 };

function ProgressBar({ value, max, label, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── 2. Main Dashboard ────────────────────────────────────────────────────────
export default function HealthDashboard() {
  const [profile] = useState(INIT_PROFILE);
  const [nutrition] = useState({ cals: 1200, protein: 80, carbs: 150, fat: 40 });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {profile.name}</h1>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Flame className="text-orange-500" size={20} /> Daily Nutrition
          </h3>
          
          <ProgressBar value={nutrition.cals} max={profile.targetCalories} label="Calories" color="#10B981" />
          <ProgressBar value={nutrition.protein} max={150} label="Protein (g)" color="#8B5CF6" />
          <ProgressBar value={nutrition.carbs} max={250} label="Carbs (g)" color="#0EA5E9" />
          <ProgressBar value={nutrition.fat} max={70} label="Fat (g)" color="#F59E0B" />
        </div>
      </div>
    </div>
  );
}