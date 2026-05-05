import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, Download, ArrowRight } from 'lucide-react'
import { usePersistedState } from '@/lib/hooks'
import { AllAnswers, LadderItem, ResetEntry, CheckIn } from '@/lib/storage'
import { journeys } from '@/content/journeys'

export default function Notes() {
  const [answers, setAnswers] = usePersistedState<AllAnswers>('answers', {})
  const [items] = usePersistedState<LadderItem[]>('ladder_items', [])
  const [resets] = usePersistedState<ResetEntry[]>('resets', [])
  const [checkIns] = usePersistedState<CheckIn[]>('checkins', [])
  const [promptResp] = usePersistedState<{ [date: string]: string }>('prompt_responses', {})
  const [q, setQ] = useState('')

  const matches = (text: string) => !q.trim() || text.toLowerCase().includes(q.toLowerCase())

  // Build a flat list of journey-prompt entries that have content
  const entries = journeys
    .map((j) => {
      const a = answers[j.id] ?? {}
      const filled = Object.entries(a).filter(([_, v]) => v && v.trim().length > 0)
      return { journey: j, filled }
    })
    .filter((x) => x.filled.length > 0)

  const totalEntries = entries.reduce((sum, x) => sum + x.filled.length, 0)

  const updateAnswer = (journeyId: string, fieldId: string, value: string) => {
    setAnswers({
      ...answers,
      [journeyId]: { ...(answers[journeyId] ?? {}), [fieldId]: value },
    })
  }

  const deleteAnswer = (journeyId: string, fieldId: string) => {
    const next = { ...answers }
    if (next[journeyId]) {
      const { [fieldId]: _, ...rest } = next[journeyId]
      next[journeyId] = rest
    }
    setAnswers(next)
  }

  const exportAll = () => {
    const blob = new Blob(
      [JSON.stringify({ answers, items, resets, checkIns, promptResp }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `letting-go-notes-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const promptResponses = Object.entries(promptResp)
    .filter(([_, v]) => v && v.trim().length > 0)
    .sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 pt-8 md:pt-14 pb-24">
      <div className="eyebrow mb-3">Saved on this device</div>
      <h1 className="font-display italic font-light text-5xl md:text-6xl text-ink leading-none">
        My Notes
      </h1>
      <div className="accent-rule mt-5" />
      <p className="font-display italic text-2xl text-muted mt-5 max-w-xl leading-snug">
        Everything you've written, in one place. Edit anything inline. It saves automatically.
      </p>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
        <Stat label="Journey entries" value={String(totalEntries)} />
        <Stat label="Daily prompts" value={String(promptResponses.length)} />
        <Stat label="Ladder items" value={String(items.length)} />
        <Stat label="Resets logged" value={String(resets.length)} />
      </div>

      {/* SEARCH + EXPORT */}
      <div className="mt-8 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your notes…"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-cream/40 border border-rule text-lg focus:outline-none focus:bg-cream focus:border-sage-400 transition-colors"
          />
        </div>
        <button onClick={exportAll} className="btn-ghost text-base whitespace-nowrap">
          <Download className="w-4 h-4" /> Export everything
        </button>
      </div>

      {/* DAILY PROMPT RESPONSES */}
      {promptResponses.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-3xl text-ink mb-4">Daily prompts</h2>
          <div className="space-y-3">
            {promptResponses.filter(([_, v]) => matches(v)).map(([date, text]) => (
              <div key={date} className="bg-cream/40 border border-rule/60 rounded-xl p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-gold-deep mb-1.5">{date}</div>
                <p className="font-display italic text-xl text-ink-soft leading-relaxed">
                  "{text}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* JOURNEY ENTRIES */}
      {entries.length > 0 ? (
        <section className="mt-12 space-y-8">
          <h2 className="font-display text-3xl text-ink">Workbook reflections</h2>
          {entries.map(({ journey, filled }) => {
            const visible = filled.filter(([_, v]) => matches(v))
            if (visible.length === 0) return null
            return (
              <div key={journey.id} className="bg-ivory border border-rule/60 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-rule/60">
                  <div>
                    <div className="eyebrow">Journey {journey.numberRoman}</div>
                    <h3 className="font-display text-2xl text-ink mt-1">
                      {journey.title}{' '}
                      <span className="italic text-sage-500">{journey.titleAccent}</span>
                    </h3>
                  </div>
                  <Link
                    to={`/journey/${journey.id}`}
                    className="text-sm text-sage-500 hover:text-sage-600 inline-flex items-center gap-1"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-5">
                  {visible.map(([fieldId, value]) => (
                    <div key={fieldId} className="group">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-sm uppercase tracking-[0.18em] text-muted font-medium">
                          {humanizeField(fieldId)}
                        </div>
                        <button
                          onClick={() => deleteAnswer(journey.id, fieldId)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-stone-600 transition-opacity"
                          title="Delete this entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        value={value}
                        onChange={(e) => updateAnswer(journey.id, fieldId, e.target.value)}
                        rows={Math.max(2, Math.ceil(value.length / 60))}
                        className="textarea-soft text-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      ) : promptResponses.length === 0 ? (
        <div className="mt-16 text-center py-12 px-4">
          <div className="font-display italic text-3xl text-muted leading-snug max-w-md mx-auto">
            Nothing saved yet.
            <br />
            <span className="text-sage-500">That's a perfect place to begin.</span>
          </div>
          <Link to="/journeys" className="btn-primary mt-6 text-base">
            Open the journeys
          </Link>
        </div>
      ) : null}

      {/* LADDER ITEMS */}
      {items.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-3xl text-ink mb-4">Items on the ladder</h2>
          <div className="space-y-2">
            {items.filter((i) => matches(i.name) || matches(i.why)).map((it) => (
              <Link
                key={it.id}
                to="/ladder"
                className="flex items-center justify-between bg-ivory border border-rule/60 rounded-xl p-4 hover:bg-cream/40 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-display italic text-xl text-ink">{it.name}</div>
                  {it.why && <div className="text-base text-muted italic mt-0.5">{it.why}</div>}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-sage-500">
                    {it.step === 5 ? 'Released' : `Step ${it.step}/5`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-sage-500" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RESET HISTORY */}
      {resets.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-3xl text-ink mb-4">Reset history</h2>
          <div className="space-y-2">
            {resets.filter((r) => matches(r.notes ?? '')).slice(0, 30).map((r, i) => (
              <div key={i} className="bg-ivory border border-rule/60 rounded-xl p-4">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-lg text-ink">{r.date}</div>
                  <div className="text-xs tracking-[0.22em] uppercase text-sage-500">
                    {Math.round(r.durationSec / 60)} min
                  </div>
                </div>
                {r.notes && <p className="text-base text-muted italic mt-1">"{r.notes}"</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream/40 border border-rule/60 rounded-xl p-4 text-center">
      <div className="font-display text-3xl text-sage-600">{value}</div>
      <div className="text-xs tracking-[0.18em] uppercase text-muted mt-1">{label}</div>
    </div>
  )
}

// Convert internal field IDs to human-readable labels
function humanizeField(id: string): string {
  const map: Record<string, string> = {
    why: 'My deeper "why"',
    rooms: 'Heaviest rooms',
    heaviest: 'The heaviest space',
    one_drawer: 'Where I could start',
    reward: 'My reward',
    body_snap: 'After-feeling',
    guilt_phrase: 'When guilt shows up',
    cheerleader: 'My accountability person',
    kids_art: "Children's art",
    heirloom_box: 'Legacy Box',
    hobby_boundary: 'Hobby boundary',
    soother: 'Texture soother',
    story_card: 'Story card',
  }
  if (map[id]) return map[id]
  if (id.startsWith('trap_')) return `Trap #${parseInt(id.slice(5)) + 1}`
  if (id.startsWith('reframe_')) return `Reframe #${parseInt(id.slice(8)) + 1}`
  return id.replace(/_/g, ' ')
}
