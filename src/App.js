className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
              >
                <option value="ml">mL</option>
                <option value="glass">Glasses</option>
              </select>
              <input
                type="number"
                value={addAmount}
                onChange={e => setAddAmount(parseInt(e.target.value) || 0)}
                className="w-20 text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-teal-400"
              />
              <button
                onClick={addLog}
                className="flex items-center gap-1.5 bg-sky-500 text-white text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-sky-600 transition-colors"
              >
                <Plus size={16}/> Add
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Main Application Container ────────────────────────────────────────────────
export default function HealthDashboard() {
  const [profile, setProfile] = useState(INIT_PROFILE);
  const [meals, setMeals] = useState(INIT_MEALS);
  const [numMeals, setNumMeals] = useState(6);
  const [exercises, setExercises] = useState(INIT_EXERCISES);
  const [water, setWater] = useState(INIT_WATER);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Metabolic Health Dashboard</h1>
          <p className="text-slate-500">
            Patient: <span className="font-semibold text-teal-600">{profile.name}</span> | 
            Monitoring metabolic markers and lifestyle interventions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ModuleProfile profile={profile} setProfile={setProfile} />
          <ModuleFoodDiary profile={profile} meals={meals} setMeals={setMeals} numMeals={numMeals} setNumMeals={setNumMeals} />
          <ModuleExercise profile={profile} exercises={exercises} setExercises={setExercises} />
          <ModuleWater water={water} setWater={setWater} />
        </div>
      </div>
    </div>
  );
}