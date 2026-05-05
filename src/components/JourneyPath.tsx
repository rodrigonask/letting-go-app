import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { journeys } from '@/content/journeys'
import { usePersistedState } from '@/lib/hooks'
import { AllAnswers, LadderItem, ResetEntry } from '@/lib/storage'

type Status = 'untouched' | 'tending' | 'complete'

function statusFor(
  journeyId: string,
  answers: AllAnswers,
  items: LadderItem[],
  resets: ResetEntry[],
): { status: Status; written: number; expected: number } {
  const a = answers[journeyId] ?? {}
  const filled = Object.values(a).filter((v) => typeof v === 'string' && v.trim().length > 0).length

  // Per-journey expected counts
  const expectedMap: Record<string, number> = {
    welcome: 2,
    'journey-1': 2,
    'journey-2': 10, // 5 trap + 5 reframe
    'journey-3': 4,
    'journey-4': 1, // 1+ ladder items
    'journey-5': 1, // 1+ resets
    'journey-6': 5,
    'journey-7': 1, // visit
  }
  const expected = expectedMap[journeyId] ?? 1

  // Special-case: Journey 4 = ladder, Journey 5 = reset, Journey 7 = visit
  if (journeyId === 'journey-4') {
    const written = items.length
    return {
      status: written === 0 ? 'untouched' : items.some((i) => i.step === 5) ? 'complete' : 'tending',
      written,
      expected,
    }
  }
  if (journeyId === 'journey-5') {
    const written = resets.length
    return {
      status: written === 0 ? 'untouched' : written >= 3 ? 'complete' : 'tending',
      written,
      expected,
    }
  }

  if (filled === 0) return { status: 'untouched', written: 0, expected }
  if (filled >= expected) return { status: 'complete', written: filled, expected }
  return { status: 'tending', written: filled, expected }
}

export default function JourneyPath() {
  const [answers] = usePersistedState<AllAnswers>('answers', {})
  const [items] = usePersistedState<LadderItem[]>('ladder_items', [])
  const [resets] = usePersistedState<ResetEntry[]>('resets', [])
  const [lastVisited] = usePersistedState<string>('last_journey', '')

  const statuses = journeys.map((j) => ({
    journey: j,
    ...statusFor(j.id, answers, items, resets),
  }))

  const completed = statuses.filter((s) => s.status === 'complete').length
  const tending = statuses.filter((s) => s.status === 'tending').length
  const total = statuses.length

  // Find the "next" journey: prefer first untouched (gentle path), else continue last visited if tending, else first tending
  const lastVisitedStatus = statuses.find((s) => s.journey.id === lastVisited)
  const firstUntouched = statuses.find((s) => s.status === 'untouched')
  const nextJourney =
    firstUntouched ||
    (lastVisitedStatus && lastVisitedStatus.status === 'tending' ? lastVisitedStatus : null) ||
    statuses.find((s) => s.status === 'tending') ||
    statuses[0]!

  const overallPct = Math.round(((completed + tending * 0.5) / total) * 100)

  return (
    <section className="relative bg-gradient-to-br from-sage-50 via-cream/40 to-ivory border border-sage-200 rounded-3xl p-6 md:p-9 mb-12 overflow-hidden">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sage-200/40 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
          <div>
            <div className="eyebrow mb-2">Your path</div>
            <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight">
              {completed === 0 && tending === 0
                ? 'Eight gentle steps await.'
                : completed === total
                  ? 'You have walked the full path.'
                  : 'Continue where you left off.'}
            </h2>
            <p className="text-base md:text-lg text-muted mt-2 max-w-xl">
              {completed === 0 && tending === 0
                ? 'There is no rush. Begin wherever feels softest today.'
                : `${completed} complete · ${tending} tending · ${total - completed - tending} untouched`}
            </p>
          </div>

          {/* Big progress arc */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <ProgressRing pct={overallPct} />
          </div>
        </div>

        {/* THE PATH — 8 nodes connected by a line */}
        <div className="relative">
          {/* Right-edge fade on mobile to hint at scroll */}
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-cream/80 to-transparent z-10 pointer-events-none rounded-r-3xl" />

          <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pt-4 pb-2">
            <div className="relative flex items-start min-w-max md:min-w-0 md:justify-between gap-2 md:gap-0">
              {/* Connecting line — sits behind nodes, aligned to node center (16px pt + 28px = 44px) */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-sage-200 via-gold-soft to-sage-200 -z-0" style={{ top: '44px', marginLeft: '44px', marginRight: '44px' }} />

              {statuses.map((s, i) => (
                <PathNode
                  key={s.journey.id}
                  journeyId={s.journey.id}
                  roman={s.journey.numberRoman}
                  isWelcome={i === 0}
                  title={s.journey.title}
                  accent={s.journey.titleAccent}
                  status={s.status}
                  isNext={s.journey.id === nextJourney.journey.id}
                  written={s.written}
                  expected={s.expected}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CONTINUE CTA */}
        {nextJourney.status !== 'complete' && completed < total && (
          <Link
            to={`/journey/${nextJourney.journey.id}`}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage-500 hover:bg-sage-600 text-cream font-medium text-base transition-colors group"
          >
            {nextJourney.status === 'untouched' ? (
              <>
                <Sparkles className="w-4 h-4" />
                Begin {nextJourney.journey.numberRoman === '—' ? 'with the welcome' : `Journey ${nextJourney.journey.numberRoman}`}
              </>
            ) : (
              <>
                Continue {nextJourney.journey.numberRoman === '—' ? 'the welcome' : `Journey ${nextJourney.journey.numberRoman}`}
              </>
            )}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
        {completed === total && (
          <div className="mt-6 text-gold-deep font-display italic text-2xl">
            ✦ Eight steps walked, gently. Return whenever you need to.
          </div>
        )}
      </div>
    </section>
  )
}

function PathNode({
  journeyId,
  roman,
  isWelcome,
  title,
  status,
  isNext,
  written,
  expected,
}: {
  journeyId: string
  roman: string
  isWelcome: boolean
  title: string
  accent: string
  status: Status
  isNext: boolean
  written: number
  expected: number
}) {
  // Welcome gets its own soft styling so it reads as an invitation, not a placeholder
  const isWelcomeUntouched = isWelcome && status === 'untouched'

  const styles = {
    untouched: {
      bg: isWelcomeUntouched ? 'bg-cream' : 'bg-cream',
      border: isWelcomeUntouched ? 'border-gold-soft border-2' : 'border-rule border-dashed',
      text: isWelcomeUntouched ? 'text-gold-deep' : 'text-muted',
    },
    tending: {
      bg: 'bg-gold-soft',
      border: 'border-gold border-2',
      text: 'text-gold-deep',
    },
    complete: {
      bg: 'bg-sage-400',
      border: 'border-sage-500 border-2',
      text: 'text-cream',
    },
  }[status]

  const shortLabel = isWelcome ? 'Welcome' : title.replace(/[,.]?$/, '')

  const tendingHint =
    journeyId === 'journey-4'
      ? `${written} item${written === 1 ? '' : 's'}`
      : journeyId === 'journey-5'
        ? `${Math.min(written, 3)}/3 resets`
        : `${written}/${expected}`

  return (
    <Link
      to={`/journey/${journeyId}`}
      className="relative flex flex-col items-center gap-2.5 z-10 group min-w-[78px] md:min-w-0"
    >
      <div
        className={`w-14 h-14 rounded-full grid place-items-center border ${styles.bg} ${styles.border} ${styles.text} font-display italic text-xl transition-all group-hover:scale-110`}
        style={
          isNext
            ? { boxShadow: '0 0 0 3px rgba(122,158,142,0.18), 0 2px 10px -2px rgba(122,158,142,0.28)' }
            : undefined
        }
      >
        {isWelcome ? <span className="text-xl leading-none">✦</span> : roman}
      </div>
      <div className="text-center w-20 md:w-24">
        <div
          className={`font-display text-sm md:text-base leading-tight font-medium truncate ${
            isNext ? 'text-sage-600' : 'text-ink'
          }`}
        >
          {shortLabel}
        </div>
        <div
          className={`text-[10px] tracking-[0.18em] uppercase mt-1 h-3.5 ${
            status === 'complete'
              ? 'text-sage-600 font-semibold'
              : status === 'tending'
                ? 'text-gold-deep'
                : isNext
                  ? 'text-sage-500 font-medium'
                  : 'text-transparent'
          }`}
        >
          {status === 'tending'
            ? tendingHint
            : status === 'complete'
              ? '✓ done'
              : isNext
                ? 'Start here'
                : '·'}
        </div>
      </div>
    </Link>
  )
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 32
  const c = 2 * Math.PI * r
  const offset = c * (1 - pct / 100)
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E8EFEB" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#7A9E8E"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-2xl text-sage-600 leading-none">{pct}<span className="text-sm">%</span></div>
        </div>
      </div>
    </div>
  )
}
