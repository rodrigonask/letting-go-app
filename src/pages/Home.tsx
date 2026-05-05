import { Link } from 'react-router-dom'
import { ArrowRight, ListChecks, Timer, Sparkles } from 'lucide-react'
import { usePersistedState, streakFromDates } from '@/lib/hooks'
import { LadderItem, ResetEntry } from '@/lib/storage'
import DailyCheckin from '@/components/DailyCheckin'
import TodaysPrompt from '@/components/TodaysPrompt'
import JourneyPath from '@/components/JourneyPath'

export default function Home() {
  const [items] = usePersistedState<LadderItem[]>('ladder_items', [])
  const [resets] = usePersistedState<ResetEntry[]>('resets', [])
  const streak = streakFromDates(resets.map((r) => r.date))
  const onLadder = items.filter((i) => i.step < 5).length
  const released = items.filter((i) => i.step === 5).length

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-6 md:pt-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-500 via-sage-400 to-sage-600 text-cream p-8 md:p-14 mb-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-soft/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold-soft/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <div className="text-[11px] tracking-[0.42em] uppercase text-gold-soft mb-4">
            Organize <span className="font-display italic lowercase tracking-normal text-base">by</span> Designe™
          </div>
          <h1 className="font-display italic font-light text-5xl md:text-7xl leading-[0.95] tracking-tight">
            Letting Go
            <br />
            <span className="font-display italic font-medium text-gold-soft">with Love</span>
          </h1>
          <p className="font-display italic text-2xl md:text-3xl text-cream/85 mt-7 max-w-xl leading-snug">
            A gentle, interactive workbook for releasing emotional clutter — one small step at a time.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/welcome" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-cream text-sage-600 font-medium text-base tracking-wide hover:bg-gold-soft hover:text-sage-700 transition-colors">
              <Sparkles className="w-5 h-5" /> Begin gently
            </Link>
            <Link to="/journeys" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-cream/30 text-cream font-medium text-base tracking-wide hover:bg-cream/10 transition-colors">
              Browse the journeys <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-10 text-base text-cream/70 flex items-center gap-3">
            <span>By Nichole Gehman &amp; Kate Fish, LMFT</span>
          </div>
        </div>
      </section>

      {/* JOURNEY PATH — progress through all 8 journeys */}
      <JourneyPath />

      {/* STATS */}
      {(items.length > 0 || resets.length > 0) && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <Stat label="On the ladder" value={String(onLadder)} sub="items in process" />
          <Stat label="Released" value={String(released)} sub="items let go" />
          <Stat label="Reset streak" value={`${streak}`} sub="day(s) in a row" />
          <Stat label="Total resets" value={String(resets.length)} sub="completed sessions" />
        </section>
      )}

      {/* DAILY CHECK-IN + TODAY'S PROMPT */}
      <div className="grid md:grid-cols-2 gap-5 mb-14">
        <DailyCheckin />
        <TodaysPrompt />
      </div>

      {/* QUICK TOOLS — small inline links to the two interactive features */}
      <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickLink
          to="/ladder"
          icon={<ListChecks className="w-5 h-5" />}
          title="The Exposure Ladder"
          body="Walk one emotionally sticky item down a 5-step staircase."
          accent="gold"
        />
        <QuickLink
          to="/reset"
          icon={<Timer className="w-5 h-5" />}
          title="15-Minute Reset"
          body="Tonight's tiny ritual. Builds your streak."
          accent="sage"
        />
      </section>

      {/* CLOSING */}
      <section className="text-center max-w-2xl mx-auto py-12">
        <div className="text-gold font-display italic text-4xl mb-5">— ✦ —</div>
        <p className="font-display italic text-3xl text-sage-600 leading-snug">
          Healing — like decluttering — begins with giving yourself permission to release what no longer serves you.
        </p>
        <div className="font-script text-3xl text-muted mt-6">— Nichole &amp; Kate</div>
      </section>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-ivory border border-rule/60 rounded-xl p-4 md:p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted font-medium">{label}</div>
      <div className="font-display text-3xl md:text-4xl text-sage-600 mt-1">{value}</div>
      <div className="text-xs text-muted mt-1">{sub}</div>
    </div>
  )
}

function QuickLink({
  to,
  icon,
  title,
  body,
  accent,
}: {
  to: string
  icon: React.ReactNode
  title: string
  body: string
  accent: 'sage' | 'gold'
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 p-5 bg-ivory border border-rule/60 rounded-2xl hover:border-sage-300 hover:shadow-md transition-all"
    >
      <div
        className={`w-11 h-11 rounded-lg grid place-items-center flex-shrink-0 ${
          accent === 'sage' ? 'bg-sage-50 text-sage-500' : 'bg-cream text-gold'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-xl text-ink leading-tight">{title}</h3>
        <p className="text-base text-muted mt-1 leading-snug">{body}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted group-hover:text-sage-500 self-center flex-shrink-0 group-hover:translate-x-1 transition-all" />
    </Link>
  )
}
