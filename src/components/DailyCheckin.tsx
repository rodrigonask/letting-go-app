import { usePersistedState, todayISO } from '@/lib/hooks'
import { CheckIn } from '@/lib/storage'

const FACES = [
  { v: 1 as const, label: 'Heavy', color: 'bg-stone-300', dot: 'bg-stone-400' },
  { v: 2 as const, label: 'Tense', color: 'bg-stone-200', dot: 'bg-stone-300' },
  { v: 3 as const, label: 'Okay', color: 'bg-cream', dot: 'bg-gold-soft' },
  { v: 4 as const, label: 'Calm', color: 'bg-sage-100', dot: 'bg-sage-300' },
  { v: 5 as const, label: 'Light', color: 'bg-sage-200', dot: 'bg-sage-400' },
]

export default function DailyCheckin() {
  const [checkIns, setCheckIns] = usePersistedState<CheckIn[]>('checkins', [])
  const today = todayISO()
  const todayCheckIn = checkIns.find((c) => c.date === today)

  const setToday = (feel: 1 | 2 | 3 | 4 | 5) => {
    const filtered = checkIns.filter((c) => c.date !== today)
    setCheckIns([{ date: today, feel }, ...filtered])
  }

  // Build last 28 days
  const days: { date: string; checkIn?: CheckIn }[] = []
  const cursor = new Date()
  for (let i = 0; i < 28; i++) {
    const yyyy = cursor.getFullYear()
    const mm = String(cursor.getMonth() + 1).padStart(2, '0')
    const dd = String(cursor.getDate()).padStart(2, '0')
    const date = `${yyyy}-${mm}-${dd}`
    days.unshift({ date, checkIn: checkIns.find((c) => c.date === date) })
    cursor.setDate(cursor.getDate() - 1)
  }

  return (
    <section className="bg-ivory border border-rule/60 rounded-2xl p-6 md:p-8">
      <div className="eyebrow mb-2">Daily check-in</div>
      <h2 className="font-display text-3xl text-ink mb-1">How does home feel today?</h2>
      <p className="text-base text-muted mb-6">A 30-second pause. No right answer.</p>

      <div className="flex items-stretch gap-2 md:gap-3 mb-7">
        {FACES.map((f) => {
          const active = todayCheckIn?.feel === f.v
          return (
            <button
              key={f.v}
              onClick={() => setToday(f.v)}
              className={`flex-1 group rounded-xl border-2 transition-all p-4 ${
                active
                  ? 'border-sage-400 bg-sage-50 shadow-sm'
                  : 'border-rule/60 bg-cream/30 hover:border-sage-300 hover:bg-cream'
              }`}
            >
              <div className={`w-10 h-10 mx-auto rounded-full ${f.dot} mb-2 transition-transform group-hover:scale-110 ${active ? 'scale-110' : ''}`} />
              <div className={`text-sm font-medium ${active ? 'text-sage-600' : 'text-ink-soft'}`}>
                {f.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* 28-day heatmap */}
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-muted mb-3">Last 4 weeks</div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map(({ date, checkIn }) => {
            const f = checkIn ? FACES.find((x) => x.v === checkIn.feel) : null
            const isToday = date === today
            return (
              <div
                key={date}
                title={`${date}${checkIn ? ` — ${f?.label}` : ' — no check-in'}`}
                className={`aspect-square rounded-md ${
                  f ? f.color : 'bg-rule/40'
                } ${isToday ? 'ring-2 ring-sage-400 ring-offset-1 ring-offset-ivory' : ''}`}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted">
          <span>Heavier</span>
          <div className="flex gap-1">
            {FACES.map((f) => (
              <div key={f.v} className={`w-3 h-3 rounded-sm ${f.color}`} />
            ))}
          </div>
          <span>Lighter</span>
        </div>
      </div>
    </section>
  )
}
