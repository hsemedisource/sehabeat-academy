import { useState } from "react";
import { Flame, Droplets } from "lucide-react";

// ─── Components ────────────────────────────────────────────────────────
function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        {Icon && <Icon className="text-teal-600" size={20} />}
        {title}
      </h3>
      {children}
    </div>
  );
}

function ProgressBar({ value, max, label, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────
export default function HealthDashboard() {
  const [nutrition] = useState({ cals: 1450, protein: 95, carbs: 180, fat: 55 });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Metabolic Health</h1>
          <p className="text-slate-500">Welcome back, Sulaiman Ahmed</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Daily Nutrition" icon={Flame}>
            <ProgressBar value={nutrition.cals} max={2000} label="Calories" color="#10B981" />
            <ProgressBar value={nutrition.protein} max={150} label="Protein (g)" color="#8B5CF6" />
            <ProgressBar value={nutrition.carbs} max={250} label="Carbs (g)" color="#0EA5E9" />
            <ProgressBar value={nutrition.fat} max={70} label="Fat (g)" color="#F59E0B" />
          </Card>

          <Card title="Water Intake" icon={Droplets}>
            <div className="text-4xl font-bold text-teal-600">1200 <span className="text-lg text-slate-400">/ 2500 mL</span></div>
            <p className="text-sm text-slate-500 mt-2">Keep it up! You're 48% of the way there.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}