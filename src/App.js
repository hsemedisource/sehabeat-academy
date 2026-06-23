import { useState } from "react";
import { Plus } from "lucide-react";

// ─── 1. Constants ─────────────────────────────────────────────────────────────
const INIT_PROFILE = { name: "Sulaiman Ahmed", bmi: 24.5 };
const INIT_MEALS = [];
const INIT_EXERCISES = [];
const INIT_WATER = 0;

// ─── 2. Sub-Components ────────────────────────────────────────────────────────
function Card({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ModuleProfile({ profile, setProfile }) {
  return <Card title="Profile">Name: {profile.name}</Card>;
}

function ModuleFoodDiary({ profile, meals, setMeals }) {
  return <Card title="Food Diary">Meal data placeholder</Card>;
}

function ModuleExercise({ profile, exercises, setExercises }) {
  return <Card title="Exercise">Exercise data placeholder</Card>;
}

function ModuleWater({ water, setWater }) {
  return <Card title="Water Intake">{water} mL</Card>;
}

// ─── 3. Main Dashboard ────────────────────────────────────────────────────────
export default function HealthDashboard() {
  const [profile] = useState(INIT_PROFILE);
  const [meals] = useState(INIT_MEALS);
  const [exercises] = useState(INIT_EXERCISES);
  const [water] = useState(INIT_WATER);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">Metabolic Health Dashboard</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModuleProfile profile={profile} />
          <ModuleFoodDiary profile={profile} meals={meals} />
          <ModuleExercise profile={profile} exercises={exercises} />
          <ModuleWater water={water} />
        </div>
      </div>
    </div>
  );
}