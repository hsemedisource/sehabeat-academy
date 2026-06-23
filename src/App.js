import { useState, useMemo, useCallback } from "react";
import {
  User, Activity, Utensils, Droplets, FlaskConical, BarChart3,
  FileText, Dumbbell, Heart, ChevronRight, Plus, Trash2,
  Pencil, Check, X, Printer, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Info, Clock, Target,
  ChevronDown, ChevronUp, Flame, Zap
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart
} from "recharts";

// ─── Color / Design Tokens ────────────────────────────────────────────────────
const C = {
  navy:    "#0F172A",
  slate:   "#1E293B",
  slate2:  "#334155",
  slate3:  "#475569",
  muted:   "#94A3B8",
  border:  "#E2E8F0",
  bg:      "#F8FAFC",
  white:   "#FFFFFF",
  emerald: "#10B981",
  teal:    "#0D9488",
  teal2:   "#14B8A6",
  amber:   "#F59E0B",
  rose:    "#F43F5E",
  violet:  "#8B5CF6",
  sky:     "#0EA5E9",
};

// ─── Initial Mock Data ─────────────────────────────────────────────────────────
const INIT_PROFILE = {
  name: "Sarah Al-Mansouri",
  age: 38,
  gender: "female",
  weight: 74,
  height: 165,
  waist: 88,
  abdominal: 92,
  activityLevel: "moderate",
  targetWeeklyChange: -0.5,
  targetCalories: 1680,
  targetProteinPct: 30,
  targetCarbPct: 40,
  targetFatPct: 30,
};

const MEAL_NAMES = ["Breakfast","Morning Snack","Lunch","Afternoon Snack","Dinner","Evening Snack"];

const INIT_MEALS = [
  {
    id: 1,
    items: [
      { id: 1, name: "Greek Yogurt (low-fat)", qty: "200g", cal: 120, carbs: 10, protein: 17, fat: 3 },
      { id: 2, name: "Mixed Berries", qty: "80g", cal: 45, carbs: 11, protein: 0.5, fat: 0.3 },
      { id: 3, name: "Chia Seeds", qty: "15g", cal: 73, carbs: 6, protein: 2.5, fat: 4.7 },
    ]
  },
  { id: 2, items: [
    { id: 1, name: "Handful Almonds", qty: "25g", cal: 145, carbs: 5, protein: 5, fat: 12.5 },
  ]},
  { id: 3, items: [
    { id: 1, name: "Grilled Chicken Breast", qty: "150g", cal: 248, carbs: 0, protein: 46, fat: 5.4 },
    { id: 2, name: "Quinoa", qty: "120g cooked", cal: 138, carbs: 24, protein: 5, fat: 2.2 },
    { id: 3, name: "Mixed Salad + EVOO", qty: "1 bowl", cal: 110, carbs: 8, protein: 2, fat: 8 },
  ]},
  { id: 4, items: [] },
  { id: 5, items: [
    { id: 1, name: "Salmon Fillet", qty: "180g", cal: 332, carbs: 0, protein: 36, fat: 20 },
    { id: 2, name: "Roasted Broccoli", qty: "200g", cal: 70, carbs: 14, protein: 5.8, fat: 0.8 },
  ]},
  { id: 6, items: [] },
];

const INIT_EXERCISES = [
  { id: 1, name: "Brisk Walking", duration: 35, sets: "—", reps: "—", timeOfDay: "07:00", intensity: "moderate" },
  { id: 2, name: "Resistance Training (Full Body)", duration: 45, sets: "4", reps: "12", timeOfDay: "17:30", intensity: "moderate" },
];

const INIT_WATER = { logs: [250,250,300,250,200], target: 2500 };

const INIT_GLUCOSE = [
  { id:1, time:"06:30", phase:"Fasting", value:94, type:"SMBG", unit:"mg/dL" },
  { id:2, time:"08:00", phase:"Pre-Breakfast", value:90, type:"SMBG", unit:"mg/dL" },
  { id:3, time:"10:00", phase:"2-hr Post-Breakfast", value:138, type:"CGM", unit:"mg/dL" },
  { id:4, time:"12:30", phase:"Pre-Lunch", value:102, type:"SMBG", unit:"mg/dL" },
  { id:5, time:"14:30", phase:"2-hr Post-Lunch", value:153, type:"CGM", unit:"mg/dL" },
  { id:6, time:"18:00", phase:"Pre-Dinner", value:98, type:"SMBG", unit:"mg/dL" },
  { id:7, time:"20:00", phase:"2-hr Post-Dinner", value:141, type:"CGM", unit:"mg/dL" },
  { id:8, time:"22:30", phase:"Bedtime", value:112, type:"SMBG", unit:"mg/dL" },
];

const INIT_LABS = {
  hba1c: { value: "6.2", date: "2025-05-10", status: "Borderline" },
  fastingInsulin: { value: "14.3", date: "2025-05-10", status: "Borderline" },
  totalCholesterol: { value: "198", date: "2025-05-10", status: "Normal" },
  hdl: { value: "52", date: "2025-05-10", status: "Normal" },
  ldl: { value: "128", date: "2025-05-10", status: "Borderline" },
  triglycerides: { value: "165", date: "2025-05-10", status: "Borderline" },
  creatinine: { value: "0.84", date: "2025-05-10", status: "Normal" },
  alt: { value: "28", date: "2025-05-10", status: "Normal" },
  ast: { value: "24", date: "2025-05-10", status: "Normal" },
  hemoglobin: { value: "12.8", date: "2025-05-10", status: "Normal" },
  wbc: { value: "6.4", date: "2025-05-10", status: "Normal" },
  platelets: { value: "247", date: "2025-05-10", status: "Normal" },
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const MET_VALUES = {
  light: 3.0,
  moderate: 5.0,
  vigorous: 8.0,
};

const PHASES = [
  "Fasting","Pre-Breakfast","2-hr Post-Breakfast",
  "Pre-Lunch","2-hr Post-Lunch","Pre-Dinner","2-hr Post-Dinner",
  "Bedtime","Nocturnal"
];

const STATUS_COLOR = {
  Normal: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Borderline: "text-amber-600 bg-amber-50 border-amber-200",
  High: "text-rose-600 bg-rose-50 border-rose-200",
};

// ─── Utility Functions ─────────────────────────────────────────────────────────
function calcBMI(weight, height) {
  const h = height / 100;
  return weight / (h * h);
}
function bmiClass(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-sky-500" };
  if (bmi < 25)   return { label: "Normal", color: "text-emerald-500" };
  if (bmi < 30)   return { label: "Overweight", color: "text-amber-500" };
  return { label: "Obese", color: "text-rose-500" };
}
function calcBMR(weight, height, age, gender) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}
function calcTDEE(bmr, activity) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity] || 1.55));
}
function calcExerciseCals(duration, intensity, weight) {
  return Math.round((MET_VALUES[intensity] || 5) * weight * (duration / 60));
}
function sumMacro(meals, key) {
  return meals.reduce((a, m) => a + m.items.reduce((b, i) => b + (parseFloat(i[key]) || 0), 0), 0);
}

// ─── Sub-Components ────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, color = C.teal }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + "18" }}>
        <Icon size={18} style={{ color }} />
      </div>
      <h2 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h2>
    </div>
  );
}

function ProgressBar({ value, max, color = C.emerald, label, showPct = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const over = value > max;
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{label}</span>
          <span className={over ? "text-rose-500 font-medium" : ""}>{Math.round(value)} / {Math.round(max)}</span>
        </div>
      )}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: over ? C.rose : color }}
        />
      </div>
      {showPct && <div className="text-right text-xs text-slate-400 mt-0.5">{pct}%</div>}
    </div>
  );
}

function StatPill({ label, value, unit, color = C.teal, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} style={{ color }} />}
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold" style={{ color }}>{value}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

function EditableField({ value, onChange, type = "text", className = "", step }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => { onChange(type === "number" ? parseFloat(draft) : draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };
  if (editing) {
    return (
      <span className="inline-flex items-center gap-1">
        <input
          autoFocus
          type={type}
          step={step}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
          className={`border border-teal-400 rounded px-2 py-0.5 text-sm outline-none ${className}`}
        />
        <button onClick={commit} className="text-emerald-600 hover:text-emerald-700"><Check size={13}/></button>
        <button onClick={cancel} className="text-slate-400 hover:text-rose-500"><X size={13}/></button>
      </span>
    );
  }
  return (
    <button onClick={() => { setDraft(value); setEditing(true); }}
      className="inline-flex items-center gap-1 hover:text-teal-600 transition-colors group">
      {value}
      <Pencil size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
    </button>
  );
}

// ─── MODULE A: Patient Profile ─────────────────────────────────────────────────
function ModuleProfile({ profile, setProfile }) {
  const bmi = calcBMI(profile.weight, profile.height);
  const bmr = calcBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calcTDEE(bmr, profile.activityLevel);
  const bc = bmiClass(bmi);

  const totalMacroPct = profile.targetProteinPct + profile.targetCarbPct + profile.targetFatPct;
  const macroValid = totalMacroPct === 100;

  const up = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const calTarget = profile.targetCalories;
  const proteinG = Math.round((calTarget * profile.targetProteinPct / 100) / 4);
  const carbG = Math.round((calTarget * profile.targetCarbPct / 100) / 4);
  const fatG = Math.round((calTarget * profile.targetFatPct / 100) / 9);

  return (
    <div className="space-y-5">
      <Card>
        <SectionHeader icon={User} title="Patient Profile" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Name", "name", "text"],
            ["Age", "age", "number"],
            ["Weight (kg)", "weight", "number"],
            ["Height (cm)", "height", "number"],
            ["Waist (cm)", "waist", "number"],
            ["Abdominal (cm)", "abdominal", "number"],
          ].map(([label, key, type]) => (
            <div key={key}>
              <div className="text-xs text-slate-500 mb-1 font-medium">{label}</div>
              <div className="text-sm font-semibold text-slate-800">
                <EditableField
                  value={profile[key]}
                  type={type}
                  onChange={v => up(key, v)}
                />
              </div>
            </div>
          ))}
          <div>
            <div className="text-xs text-slate-500 mb-1 font-medium">Gender</div>
            <select value={profile.gender} onChange={e => up("gender", e.target.value)}
              className="text-sm font-semibold text-slate-800 bg-transparent border-none outline-none cursor-pointer">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1 font-medium">Activity Level</div>
            <select value={profile.activityLevel} onChange={e => up("activityLevel", e.target.value)}
              className="text-sm font-semibold text-slate-800 bg-transparent border-none outline-none cursor-pointer">
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="veryActive">Very Active</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatPill label="BMI" value={bmi.toFixed(1)} unit="kg/m²" color={bc.color.replace("text-","").includes("emerald") ? C.emerald : bc.color.includes("amber") ? C.amber : bc.color.includes("rose") ? C.rose : C.sky} icon={Activity} />
        <div className="flex flex-col gap-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Classification</span>
          <span className={`text-xl font-bold ${bc.color}`}>{bc.label}</span>
        </div>
        <StatPill label="BMR" value={Math.round(bmr)} unit="kcal/day" color={C.violet} icon={Flame} />
        <StatPill label="TDEE" value={tdee} unit="kcal/day" color={C.teal} icon={Zap} />
      </div>

      <Card>
        <SectionHeader icon={Target} title="Caloric & Macronutrient Targets" color={C.violet} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                value={profile.targetCalories}
                onChange={e => up("targetCalories", parseFloat(e.target.value))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-teal-400"
              />
              <div className="text-xs text-slate-400 mt-1">TDEE: {tdee} kcal — Weekly target: <span className="font-medium">{profile.targetWeeklyChange > 0 ? "+" : ""}{profile.targetWeeklyChange} kg/wk</span></div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Weekly Goal (kg change)</label>
              <input
                type="number"
                step="0.25"
                value={profile.targetWeeklyChange}
                onChange={e => up("targetWeeklyChange", parseFloat(e.target.value))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-teal-400"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Macronutrient Split</span>
              {!macroValid && (
                <span className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertTriangle size={12}/> Total: {totalMacroPct}% (must = 100%)
                </span>
              )}
              {macroValid && <span className="text-xs text-emerald-500 font-medium flex items-center gap-1"><CheckCircle size={12}/>Valid</span>}
            </div>
            {[
              ["Protein", "targetProteinPct", C.violet, proteinG],
              ["Carbohydrates", "targetCarbPct", C.sky, carbG],
              ["Fat", "targetFatPct", C.amber, fatG],
            ].map(([label, key, color, g]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs w-24 text-slate-600">{label}</span>
                <input
                  type="number"
                  min={0} max={100}
                  value={profile[key]}
                  onChange={e => up(key, parseInt(e.target.value) || 0)}
                  className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-center outline-none focus:border-teal-400"
                  style={{ borderColor: !macroValid ? C.rose : "" }}
                />
                <span className="text-xs text-slate-400">% = <b style={{ color }}>{g}g</b></span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE B: Food Diary ──────────────────────────────────────────────────────
function ModuleFoodDiary({ profile, meals, setMeals, numMeals, setNumMeals }) {
  const [expandedMeal, setExpandedMeal] = useState(null);

  const totalCals = sumMacro(meals.slice(0, numMeals), "cal");
  const totalCarbs = sumMacro(meals.slice(0, numMeals), "carbs");
  const totalProtein = sumMacro(meals.slice(0, numMeals), "protein");
  const totalFat = sumMacro(meals.slice(0, numMeals), "fat");

  const calTarget = profile.targetCalories;
  const proteinG = Math.round((calTarget * profile.targetProteinPct / 100) / 4);
  const carbG = Math.round((calTarget * profile.targetCarbPct / 100) / 4);
  const fatG = Math.round((calTarget * profile.targetFatPct / 100) / 9);

  const addItem = (mealIdx) => {
    setMeals(ms => ms.map((m, i) => i !== mealIdx ? m : {
      ...m, items: [...m.items, {
        id: Date.now(), name: "", qty: "", cal: 0, carbs: 0, protein: 0, fat: 0
      }]
    }));
  };

  const updateItem = (mealIdx, itemId, key, val) => {
    setMeals(ms => ms.map((m, i) => i !== mealIdx ? m : {
      ...m, items: m.items.map(item => item.id !== itemId ? item : { ...item, [key]: val })
    }));
  };

  const removeItem = (mealIdx, itemId) => {
    setMeals(ms => ms.map((m, i) => i !== mealIdx ? m : {
      ...m, items: m.items.filter(item => item.id !== itemId)
    }));
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader icon={Utensils} title="Daily Nutrition Summary" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Meals per day:</span>
            <select value={numMeals} onChange={e => setNumMeals(parseInt(e.target.value))}
              className="border border-slate-200 rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 outline-none">
              {[3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatPill label="Calories" value={Math.round(totalCals)} unit={`/ ${calTarget}`} color={totalCals > calTarget ? C.rose : C.emerald} icon={Flame} />
          <StatPill label="Protein" value={`${totalProtein.toFixed(0)}g`} unit={`/ ${proteinG}g`} color={C.violet} icon={Activity} />
          <StatPill label="Carbs" value={`${totalCarbs.toFixed(0)}g`} unit={`/ ${carbG}g`} color={C.sky} icon={TrendingUp} />
          <StatPill label="Fat" value={`${totalFat.toFixed(0)}g`} unit={`/ ${fatG}g`} color={C.amber} icon={Zap} />
        </div>

        <div className="space-y-2">
          <ProgressBar value={totalCals} max={calTarget} color={C.emerald} label="Calories" />
          <ProgressBar value={totalProtein} max={proteinG} color={C.violet} label="Protein (g)" />
          <ProgressBar value={totalCarbs} max={carbG} color={C.sky} label="Carbohydrates (g)" />
          <ProgressBar value={totalFat} max={fatG} color={C.amber} label="Fat (g)" />
        </div>
      </Card>

      {meals.slice(0, numMeals).map((meal, mealIdx) => {
        const mealCals = meal.items.reduce((a, i) => a + (parseFloat(i.cal) || 0), 0);
        const isOpen = expandedMeal === mealIdx;

        return (
          <Card key={meal.id}>
            <button
              onClick={() => setExpandedMeal(isOpen ? null : mealIdx)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: C.teal + "18", color: C.teal }}>
                  {mealIdx + 1}
                </div>
                <span className="font-semibold text-slate-800">{MEAL_NAMES[mealIdx]}</span>
                <span className="text-xs text-slate-400">{meal.items.length} item{meal.items.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">{Math.round(mealCals)} kcal</span>
                {isOpen ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
            </button>

            {isOpen && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Food Item","Qty","Cal","Carbs g","Protein g","Fat g",""].map(h => (
                          <th key={h} className="pb-2 text-left text-slate-400 font-medium pr-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {meal.items.map(item => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                          {[
                            ["name","text"],["qty","text"],["cal","number"],
                            ["carbs","number"],["protein","number"],["fat","number"]
                          ].map(([key, type]) => (
                            <td key={key} className="py-1.5 pr-3">
                              <input
                                type={type}
                                value={item[key]}
                                onChange={e => updateItem(mealIdx, item.id, key, type === "number" ? parseFloat(e.target.value)||0 : e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-slate-700 min-w-0"
                                style={{ minWidth: key === "name" ? 120 : 48 }}
                              />
                            </td>
                          ))}
                          <td>
                            <button onClick={() => removeItem(mealIdx, item.id)} className="text-slate-300 hover:text-rose-400 transition-colors">
                              <Trash2 size={13}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => addItem(mealIdx)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  <Plus size={13}/> Add food item
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── MODULE C: Exercise ────────────────────────────────────────────────────────
function ModuleExercise({ profile, exercises, setExercises }) {
  const totalBurned = exercises.reduce((a, ex) => a + calcExerciseCals(ex.duration, ex.intensity, profile.weight), 0);

  const add = () => setExercises(ex => [...ex, {
    id: Date.now(), name: "", duration: 30, sets: "", reps: "", timeOfDay: "08:00", intensity: "moderate"
  }]);

  const update = (id, key, val) => setExercises(ex => ex.map(e => e.id !== id ? e : { ...e, [key]: val }));
  const remove = (id) => setExercises(ex => ex.filter(e => e.id !== id));

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader icon={Dumbbell} title="Exercise Log" color={C.violet} />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Burned</div>
              <div className="text-lg font-bold" style={{ color: C.violet }}>{totalBurned} kcal</div>
            </div>
            <button onClick={add} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium text-white transition-all" style={{ background: C.violet }}>
              <Plus size={14}/> Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {exercises.map(ex => {
            const burned = calcExerciseCals(ex.duration, ex.intensity, profile.weight);
            return (
              <div key={ex.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-400 block mb-1">Exercise</label>
                    <input value={ex.name} onChange={e => update(ex.id,"name",e.target.value)}
                      className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-teal-400" placeholder="Exercise name"/>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Duration (min)</label>
                    <input type="number" value={ex.duration} onChange={e => update(ex.id,"duration",parseInt(e.target.value)||0)}
                      className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-teal-400"/>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Sets × Reps</label>
                    <div className="flex gap-1">
                      <input value={ex.sets} onChange={e => update(ex.id,"sets",e.target.value)} placeholder="—"
                        className="w-10 text-sm text-center text-slate-700 bg-white border border-slate-200 rounded-lg px-1 py-1.5 outline-none focus:border-teal-400"/>
                      <span className="self-center text-slate-400">×</span>
                      <input value={ex.reps} onChange={e => update(ex.id,"reps",e.target.value)} placeholder="—"
                        className="w-10 text-sm text-center text-slate-700 bg-white border border-slate-200 rounded-lg px-1 py-1.5 outline-none focus:border-teal-400"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Time</label>
                    <input type="time" value={ex.timeOfDay} onChange={e => update(ex.id,"timeOfDay",e.target.value)}
                      className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-teal-400"/>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Intensity</label>
                    <select value={ex.intensity} onChange={e => update(ex.id,"intensity",e.target.value)}
                      className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none">
                      <option value="light">Light</option>
                      <option value="moderate">Moderate</option>
                      <option value="vigorous">Vigorous</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: C.violet }}>
                    <Flame size={12}/> <b>{burned} kcal</b> estimated burn
                    <span className="text-slate-400 ml-1">MET {MET_VALUES[ex.intensity]} × {profile.weight}kg × {ex.duration/60}h</span>
                  </div>
                  <button onClick={() => remove(ex.id)} className="text-slate-300 hover:text-rose-400 transition-colors">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            );
          })}
          {exercises.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No exercises logged yet. Click "Add" to start tracking.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE D: Water ───────────────────────────────────────────────────────────
function ModuleWater({ water, setWater }) {
  const [addAmount, setAddAmount] = useState(250);
  const [unit, setUnit] = useState("ml");
  const totalMl = water.logs.reduce((a, b) => a + b, 0);
  const pct = Math.min(100, (totalMl / water.target) * 100);

  const addLog = () => {
    const ml = unit === "glass" ? addAmount * 250 : addAmount;
    setWater(w => ({ ...w, logs: [...w.logs, ml] }));
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionHeader icon={Droplets} title="Fluid Balance" color={C.sky} />
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Water Ring */}
          <div className="relative flex-shrink-0">
            <svg width={140} height={140} className="transform -rotate-90">
              <circle cx={70} cy={70} r={58} fill="none" stroke="#E0F2FE" strokeWidth={12}/>
              <circle
                cx={70} cy={70} r={58}
                fill="none"
                stroke={pct >= 100 ? C.emerald : C.sky}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - pct / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets size={18} style={{ color: C.sky }}/>
              <span className="text-xl font-bold text-slate-800 mt-1">{(totalMl/1000).toFixed(1)}L</span>
              <span className="text-xs text-slate-400">{Math.round(pct)}%</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Daily Target</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={water.target}
                  onChange={e => setWater(w => ({ ...w, target: parseInt(e.target.value)||2500 }))}
                  className="w-20 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-teal-400"
                />
                <span className="text-xs text-slate-400">mL</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {water.logs.map((ml, i) => (
                <div key={i} className="relative group">
                  <div className="flex flex-col items-center bg-sky-50 border border-sky-100 rounded-xl p-2 min-w-[52px]">
                    <Droplets size={16} style={{ color: C.sky }}/>
                    <span className="text-xs font-semibold text-sky-700 mt-0.5">{ml}mL</span>
                  </div>
                  <button
                    onClick={() => setWater(w => ({ ...w, logs: w.logs.filter((_, j) => j !== i) }))}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={9} className="text-white"/>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select value={unit} onChange={e => setUnit(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none text-slate-700">
                <option value="ml">mL</option>
                <option value="glass">Glasses (250mL)</option>
              </select>
              <input type="number" value={addAmount} onChange={e => setAddAmount(parseInt(e.target.value)||250)}
                className="w-20 text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-teal-400 text-slate-700"/>
              <button onClick={addLog}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all"
                style={{ background: C.sky }}>
                <Plus size={14}/> Log
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[250,500,750].map(ml => (
                <button key={ml} onClick={() => setWater(w => ({ ...w, logs: [...w.logs, ml] }))}
                  className="text-xs py-1.5 rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 font-medium transition-colors">
                  +{ml}mL
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE E: Glycemic Log ────────────────────────────────────────────────────
function glucoseAlert(phase, value) {
  const isFasting = phase.toLowerCase().includes("fasting") || phase === "Pre-Breakfast";
  if (isFasting && value > 100) return "high";
  if (!isFasting && value > 140) return "high";
  if (isFasting && value < 70) return "low";
  if (!isFasting && value < 70) return "low";
  return "normal";
}

function ModuleGlycemic({ glucose, setGlucose }) {
  const add = () => setGlucose(g => [...g, {
    id: Date.now(), time: "12:00", phase: "Pre-Lunch", value: 100, type: "SMBG", unit: "mg/dL"
  }]);
  const update = (id, key, val) => setGlucose(g => g.map(e => e.id !== id ? e : { ...e, [key]: val }));
  const remove = (id) => setGlucose(g => g.filter(e => e.id !== id));

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader icon={Heart} title="Glycemic Monitoring Log" color={C.rose} />
          <button onClick={add}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium text-white"
            style={{ background: C.rose }}>
            <Plus size={14}/> Add Reading
          </button>
        </div>

        <div className="flex gap-4 mb-4 text-xs">
          {[
            ["bg-emerald-50 border-emerald-200 text-emerald-700", "Normal"],
            ["bg-amber-50 border-amber-200 text-amber-700", "Borderline"],
            ["bg-rose-50 border-rose-200 text-rose-700", "High / Hypo"],
          ].map(([cls, label]) => (
            <div key={label} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${cls}`}>
              <div className={`w-2 h-2 rounded-full ${cls.split(" ")[0].replace("bg-","bg-")}`}/>
              {label}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Time","Phase","Reading","Type","Unit",""].map(h => (
                  <th key={h} className="pb-2 text-left text-xs text-slate-400 font-medium pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {glucose.sort((a,b) => a.time.localeCompare(b.time)).map(entry => {
                const alert = glucoseAlert(entry.phase, entry.value);
                const rowCls = alert === "high" ? "bg-rose-50" : alert === "low" ? "bg-amber-50" : "";
                return (
                  <tr key={entry.id} className={`${rowCls} hover:opacity-80`}>
                    <td className="py-2 pr-4">
                      <input type="time" value={entry.time} onChange={e => update(entry.id,"time",e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-700 text-sm"/>
                    </td>
                    <td className="py-2 pr-4">
                      <select value={entry.phase} onChange={e => update(entry.id,"phase",e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-700 text-sm max-w-[180px]">
                        {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <input type="number" value={entry.value} onChange={e => update(entry.id,"value",parseInt(e.target.value)||0)}
                          className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-teal-400 text-slate-800"/>
                        {alert === "high" && <AlertTriangle size={14} style={{ color: C.rose }}/>}
                        {alert === "normal" && <CheckCircle size={14} style={{ color: C.emerald }}/>}
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <select value={entry.type} onChange={e => update(entry.id,"type",e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-500 text-xs">
                        <option value="SMBG">SMBG</option>
                        <option value="CGM">CGM</option>
                      </select>
                    </td>
                    <td className="py-2 pr-4">
                      <select value={entry.unit} onChange={e => update(entry.id,"unit",e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-500 text-xs">
                        <option value="mg/dL">mg/dL</option>
                        <option value="mmol/L">mmol/L</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <button onClick={() => remove(entry.id)} className="text-slate-300 hover:text-rose-400 transition-colors">
                        <Trash2 size={13}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            ["Avg BG", Math.round(glucose.reduce((a,e)=>a+e.value,0)/(glucose.length||1)), "mg/dL", C.teal],
            ["Peak BG", Math.max(...glucose.map(e=>e.value)), "mg/dL", C.rose],
            ["In Range", `${glucose.filter(e=>glucoseAlert(e.phase,e.value)==="normal").length}/${glucose.length}`, "", C.emerald],
          ].map(([label, val, unit, color]) => (
            <div key={label} className="text-center bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400 mb-1">{label}</div>
              <div className="font-bold text-lg" style={{ color }}>{val} <span className="text-xs font-normal text-slate-400">{unit}</span></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── MODULE F: Analytics ───────────────────────────────────────────────────────
function ModuleAnalytics({ meals, glucose, exercises, numMeals }) {
  const chartData = useMemo(() => {
    const points = [];
    const mealTimes = ["07:30","10:00","12:30","15:00","18:30","21:00"];
    meals.slice(0, numMeals).forEach((m, i) => {
      const mealCals = m.items.reduce((a, item) => a + (parseFloat(item.cal)||0), 0);
      const mealCarbs = m.items.reduce((a, item) => a + (parseFloat(item.carbs)||0), 0);
      const t = mealTimes[i] || `${8+i*3}:00`;
      points.push({ time: t, label: MEAL_NAMES[i], calories: Math.round(mealCals), carbs: Math.round(mealCarbs), type: "meal" });
    });
    glucose.forEach(g => {
      points.push({ time: g.time, label: g.phase, glucose: g.value, type: "glucose" });
    });
    return points.sort((a, b) => a.time.localeCompare(b.time));
  }, [meals, glucose, numMeals]);

  return (
    <div className="space-y-5">
      <Card>
        <SectionHeader icon={BarChart3} title="Glycemic & Caloric Correlation" color={C.teal} />
        <div className="text-xs text-slate-400 mb-4">
          Line: Blood Glucose (mg/dL) — Bars: Carbohydrate load per meal (g)
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top:10, right:20, left:0, bottom:10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
            <XAxis dataKey="time" tick={{ fontSize:11, fill: C.muted }} />
            <YAxis yAxisId="left" tick={{ fontSize:11, fill: C.muted }} label={{ value:"BG mg/dL", angle:-90, position:"insideLeft", fontSize:10, fill:C.muted }}/>
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize:11, fill: C.muted }} label={{ value:"Carbs g", angle:90, position:"insideRight", fontSize:10, fill:C.muted }}/>
            <Tooltip
              contentStyle={{ fontSize:12, borderRadius:8, border:"1px solid #E2E8F0", boxShadow:"0 4px 6px -1px rgba(0,0,0,0.05)" }}
            />
            <Legend wrapperStyle={{ fontSize:12 }}/>
            <ReferenceLine yAxisId="left" y={140} stroke={C.rose} strokeDasharray="4 4" label={{ value:"Post-meal target 140", fontSize:10, fill:C.rose }} />
            <ReferenceLine yAxisId="left" y={100} stroke={C.amber} strokeDasharray="4 4" label={{ value:"Fasting target 100", fontSize:10, fill:C.amber }} />
            <Bar yAxisId="right" dataKey="carbs" fill={C.sky} opacity={0.6} name="Carbs (g)" radius={[4,4,0,0]}/>
            <Line yAxisId="left" type="monotone" dataKey="glucose" stroke={C.rose} strokeWidth={2.5} dot={{ r:4, fill:C.rose }} name="Blood Glucose (mg/dL)" connectNulls={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader icon={TrendingUp} title="Caloric Breakdown by Meal" color={C.violet} />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={meals.slice(0,numMeals).map((m,i) => ({
            name: MEAL_NAMES[i].split(" ")[0],
            calories: Math.round(m.items.reduce((a,item)=>a+(parseFloat(item.cal)||0),0)),
            protein: Math.round(m.items.reduce((a,item)=>a+(parseFloat(item.protein)||0),0)),
            carbs: Math.round(m.items.reduce((a,item)=>a+(parseFloat(item.carbs)||0),0)),
            fat: Math.round(m.items.reduce((a,item)=>a+(parseFloat(item.fat)||0),0)),
          }))} margin={{ top:5, right:20, left:0, bottom:5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
            <XAxis dataKey="name" tick={{ fontSize:11, fill:C.muted }}/>
            <YAxis tick={{ fontSize:11, fill:C.muted }}/>
            <Tooltip contentStyle={{ fontSize:12, borderRadius:8, border:"1px solid #E2E8F0" }}/>
            <Legend wrapperStyle={{ fontSize:12 }}/>
            <Bar dataKey="calories" fill={C.emerald} name="Calories" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── MODULE G: Labs ────────────────────────────────────────────────────────────
const LAB_FIELDS = [
  { section: "Glycemic Control", fields: [
    { key: "hba1c", label: "HbA1c", unit: "%" },
    { key: "fastingInsulin", label: "Fasting Insulin", unit: "µIU/mL" },
  ]},
  { section: "Lipid Profile", fields: [
    { key: "totalCholesterol", label: "Total Cholesterol", unit: "mg/dL" },
    { key: "hdl", label: "HDL Cholesterol", unit: "mg/dL" },
    { key: "ldl", label: "LDL Cholesterol", unit: "mg/dL" },
    { key: "triglycerides", label: "Triglycerides", unit: "mg/dL" },
  ]},
  { section: "Renal / Hepatic / Hematology", fields: [
    { key: "creatinine", label: "Serum Creatinine", unit: "mg/dL" },
    { key: "alt", label: "ALT", unit: "U/L" },
    { key: "ast", label: "AST", unit: "U/L" },
    { key: "hemoglobin", label: "Hemoglobin", unit: "g/dL" },
    { key: "wbc", label: "WBC", unit: "×10³/µL" },
    { key: "platelets", label: "Platelets", unit: "×10³/µL" },
  ]},
];

function ModuleLabs({ labs, setLabs }) {
  const update = (key, field, val) => setLabs(l => ({ ...l, [key]: { ...l[key], [field]: val } }));

  return (
    <div className="space-y-5">
      {LAB_FIELDS.map(({ section, fields }) => (
        <Card key={section}>
          <SectionHeader icon={FlaskConical} title={section} color={C.teal} />
          <div className="space-y-3">
            {fields.map(({ key, label, unit }) => {
              const lab = labs[key] || {};
              return (
                <div key={key} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">{label}</div>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        value={lab.value || ""}
                        onChange={e => update(key, "value", e.target.value)}
                        className="w-24 text-sm font-bold text-slate-800 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-teal-400"
                        placeholder="—"
                      />
                      <span className="text-xs text-slate-400">{unit}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Date</div>
                    <input
                      type="date"
                      value={lab.date || ""}
                      onChange={e => update(key, "date", e.target.value)}
                      className="text-sm text-slate-700 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Status</div>
                    <select
                      value={lab.status || "Normal"}
                      onChange={e => update(key, "status", e.target.value)}
                      className={`text-xs font-semibold border rounded-lg px-2 py-1.5 outline-none ${STATUS_COLOR[lab.status] || STATUS_COLOR.Normal}`}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Borderline">Borderline</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLOR[lab.status] || STATUS_COLOR.Normal}`}>
                      {lab.status || "Normal"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── MODULE H: Report ──────────────────────────────────────────────────────────
function ModuleReport({ profile, meals, exercises, water, glucose, labs, numMeals }) {
  const [timeframe, setTimeframe] = useState("day");
  const [notes, setNotes] = useState(`Patient demonstrates early-stage metabolic risk factors including borderline fasting glucose and elevated postprandial readings. Dietary adherence is moderate. Exercise compliance is encouraging. Continued monitoring of HbA1c progression recommended.`);
  const [recs, setRecs] = useState(`1. Reduce refined carbohydrate intake, prioritize low-GI foods.\n2. Maintain minimum 150 min/week moderate aerobic activity.\n3. Increase fiber intake to ≥25g/day.\n4. Repeat HbA1c and fasting insulin in 3 months.\n5. Consider referral to dietitian for Medical Nutrition Therapy (MNT).`);

  const bmi = calcBMI(profile.weight, profile.height);
  const bmr = calcBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calcTDEE(bmr, profile.activityLevel);
  const bc = bmiClass(bmi);
  const totalCals = sumMacro(meals.slice(0, numMeals), "cal");
  const totalProtein = sumMacro(meals.slice(0, numMeals), "protein");
  const totalCarbs = sumMacro(meals.slice(0, numMeals), "carbs");
  const totalFat = sumMacro(meals.slice(0, numMeals), "fat");
  const totalBurned = exercises.reduce((a, ex) => a + calcExerciseCals(ex.duration, ex.intensity, profile.weight), 0);
  const totalWater = water.logs.reduce((a, b) => a + b, 0);
  const avgGlucose = glucose.length ? Math.round(glucose.reduce((a,e)=>a+e.value,0)/glucose.length) : 0;

  const printReport = () => window.print();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {["day","week","month"].map(t => (
            <button key={t} onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                timeframe === t ? "text-white shadow" : "text-slate-500 hover:text-slate-700 bg-white border border-slate-200"
              }`}
              style={timeframe === t ? { background: C.navy } : {}}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={printReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:opacity-90"
          style={{ background: C.teal }}>
          <Printer size={15}/> Print Report
        </button>
      </div>

      <div id="printable-report">
        {/* Report Header */}
        <Card className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-1">SehaBeat Academy</div>
              <h1 className="text-xl font-bold text-slate-900">Clinical Metabolic Report</h1>
              <div className="text-sm text-slate-500 mt-1">
                {profile.name} · {profile.age}y · {profile.gender === "female" ? "Female" : "Male"}
                · Generated: {new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Timeframe: <span className="font-medium capitalize">{timeframe}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: C.teal + "15" }}>
              <Heart size={22} style={{ color: C.teal }}/>
            </div>
          </div>
        </Card>

        {/* Profile & Metrics */}
        <Card className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Patient Metrics</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              ["Weight", `${profile.weight} kg`],
              ["Height", `${profile.height} cm`],
              ["BMI", `${bmi.toFixed(1)} — ${bc.label}`],
              ["BMR", `${Math.round(bmr)} kcal`],
              ["TDEE", `${tdee} kcal`],
              ["Waist", `${profile.waist} cm`],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-50 rounded-xl p-2 text-center">
                <div className="text-xs text-slate-400">{k}</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Nutrition */}
        <Card className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Nutritional Intake Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {[
              ["Energy", `${Math.round(totalCals)} kcal`, `Target: ${profile.targetCalories}`, C.emerald],
              ["Protein", `${totalProtein.toFixed(0)}g`, `Target: ${Math.round((profile.targetCalories * profile.targetProteinPct/100)/4)}g`, C.violet],
              ["Carbohydrates", `${totalCarbs.toFixed(0)}g`, `Target: ${Math.round((profile.targetCalories * profile.targetCarbPct/100)/4)}g`, C.sky],
              ["Fat", `${totalFat.toFixed(0)}g`, `Target: ${Math.round((profile.targetCalories * profile.targetFatPct/100)/9)}g`, C.amber],
            ].map(([label, val, sub, color]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400">{label}</div>
                <div className="text-lg font-bold mt-0.5" style={{ color }}>{val}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Glycemic + Exercise + Water */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Glycemic</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Avg BG</span><b style={{color:C.teal}}>{avgGlucose} mg/dL</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Peak</span><b style={{color:C.rose}}>{Math.max(...glucose.map(e=>e.value),0)} mg/dL</b></div>
              <div className="flex justify-between"><span className="text-slate-500">In Range</span><b style={{color:C.emerald}}>{glucose.filter(e=>glucoseAlert(e.phase,e.value)==="normal").length}/{glucose.length}</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Readings</span><b>{glucose.length}</b></div>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Exercise</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Sessions</span><b>{exercises.length}</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Total Duration</span><b>{exercises.reduce((a,e)=>a+e.duration,0)} min</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Calories Burned</span><b style={{color:C.violet}}>{totalBurned} kcal</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Net Intake</span><b>{Math.round(totalCals - totalBurned)} kcal</b></div>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Hydration</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Total Intake</span><b style={{color:C.sky}}>{(totalWater/1000).toFixed(2)} L</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Target</span><b>{(water.target/1000).toFixed(1)} L</b></div>
              <div className="flex justify-between"><span className="text-slate-500">% Achievement</span><b>{Math.round((totalWater/water.target)*100)}%</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Log Entries</span><b>{water.logs.length}</b></div>
            </div>
          </Card>
        </div>

        {/* Labs Summary */}
        <Card className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Laboratory Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {LAB_FIELDS.flatMap(s => s.fields).map(({ key, label, unit }) => {
              const lab = labs[key] || {};
              return (
                <div key={key} className={`rounded-xl p-2 border text-xs ${STATUS_COLOR[lab.status] || STATUS_COLOR.Normal}`}>
                  <div className="font-medium text-slate-600">{label}</div>
                  <div className="font-bold text-base mt-0.5">{lab.value || "—"} <span className="text-xs font-normal">{unit}</span></div>
                  <div className="mt-0.5 font-medium">{lab.status || "Normal"}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Clinical Notes */}
        <Card className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Clinical Notes</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-400 resize-none leading-relaxed"
            placeholder="Add clinical observations here..."
          />
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Recommendations</h3>
          <textarea
            value={recs}
            onChange={e => setRecs(e.target.value)}
            rows={5}
            className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-400 resize-none leading-relaxed"
            placeholder="Enter clinical recommendations..."
          />
        </Card>
      </div>
    </div>
  );
}

// ─── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV = [
  { id:"profile", label:"Profile", icon: User },
  { id:"diary", label:"Food Diary", icon: Utensils },
  { id:"exercise", label:"Exercise", icon: Dumbbell },
  { id:"water", label:"Hydration", icon: Droplets },
  { id:"glycemic", label:"Glycemic", icon: Heart },
  { id:"analytics", label:"Analytics", icon: BarChart3 },
  { id:"labs", label:"Labs", icon: FlaskConical },
  { id:"report", label:"Report", icon: FileText },
];

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(INIT_PROFILE);
  const [meals, setMeals] = useState(INIT_MEALS);
  const [numMeals, setNumMeals] = useState(5);
  const [exercises, setExercises] = useState(INIT_EXERCISES);
  const [water, setWater] = useState(INIT_WATER);
  const [glucose, setGlucose] = useState(INIT_GLUCOSE);
  const [labs, setLabs] = useState(INIT_LABS);

  const totalCals = sumMacro(meals.slice(0, numMeals), "cal");
  const totalBurned = exercises.reduce((a, ex) => a + calcExerciseCals(ex.duration, ex.intensity, profile.weight), 0);
  const netCals = Math.round(totalCals - totalBurned);
  const totalWater = water.logs.reduce((a, b) => a + b, 0);
  const avgGlucose = glucose.length ? Math.round(glucose.reduce((a,e)=>a+e.value,0)/glucose.length) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        body { background: #F8FAFC; }
        @media print {
          body { background: white !important; }
          #app-header, #app-nav, #app-topbar { display: none !important; }
          #printable-report * { color-adjust: exact; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          #main-content { padding: 0 !important; }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: C.bg }}>
        {/* Header */}
        <header id="app-header" className="sticky top-0 z-50 shadow-sm" style={{ background: C.navy }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.teal }}>
                <Heart size={18} className="text-white"/>
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none">SehaBeat Academy</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>Clinical Lifestyle Tracker</div>
              </div>
            </div>

            {/* Header Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              {[
                ["Net Calories", `${netCals} kcal`, netCals > profile.targetCalories ? C.rose : C.emerald],
                ["Water", `${(totalWater/1000).toFixed(1)}L`, totalWater >= water.target ? C.emerald : C.sky],
                ["Avg BG", `${avgGlucose} mg/dL`, avgGlucose > 140 ? C.rose : avgGlucose > 100 ? C.amber : C.emerald],
              ].map(([label, val, color]) => (
                <div key={label} className="text-center">
                  <div style={{ color: C.muted }}>{label}</div>
                  <div className="font-bold text-sm" style={{ color }}>{val}</div>
                </div>
              ))}
            </div>

            <div className="text-right hidden md:block">
              <div className="text-white text-sm font-semibold">{profile.name}</div>
              <div style={{ color: C.muted }} className="text-xs">Active Session</div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav id="app-nav" className="sticky top-[61px] z-40 border-b border-slate-200 bg-white shadow-sm overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-0 min-w-max">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === id
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon size={14}/>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === "profile" && (
            <ModuleProfile profile={profile} setProfile={setProfile} />
          )}
          {activeTab === "diary" && (
            <ModuleFoodDiary
              profile={profile}
              meals={meals}
              setMeals={setMeals}
              numMeals={numMeals}
              setNumMeals={setNumMeals}
            />
          )}
          {activeTab === "exercise" && (
            <ModuleExercise profile={profile} exercises={exercises} setExercises={setExercises} />
          )}
          {activeTab === "water" && (
            <ModuleWater water={water} setWater={setWater} />
          )}
          {activeTab === "glycemic" && (
            <ModuleGlycemic glucose={glucose} setGlucose={setGlucose} />
          )}
          {activeTab === "analytics" && (
            <ModuleAnalytics meals={meals} glucose={glucose} exercises={exercises} numMeals={numMeals} />
          )}
          {activeTab === "labs" && (
            <ModuleLabs labs={labs} setLabs={setLabs} />
          )}
          {activeTab === "report" && (
            <ModuleReport
              profile={profile}
              meals={meals}
              exercises={exercises}
              water={water}
              glucose={glucose}
              labs={labs}
              numMeals={numMeals}
            />
          )}
        </main>
      </div>
    </>
  );
}