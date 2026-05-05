import { useState } from 'react'
import { Plus, Trash2, ArrowRight, ArrowLeft, Sparkles, X } from 'lucide-react'
import { usePersistedState } from '@/lib/hooks'
import { LadderItem, LadderStep } from '@/lib/storage'
import { ladderSteps } from '@/content/journeys'

export default function Ladder() {
  const [items, setItems] = usePersistedState<LadderItem[]>('ladder_items', [])
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [why, setWhy] = useState('')

  const addItem = () => {
    if (!name.trim()) return
    const item: LadderItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      why: why.trim(),
      step: 1,
      history: [{ step: 1, date: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    }
    setItems([item, ...items])
    setName('')
    setWhy('')
    setShowAdd(false)
  }

  const advance = (id: string, dir: 1 | -1) => {
    setItems(
      items.map((it) => {
        if (it.id !== id) return it
        const next = Math.min(5, Math.max(1, it.step + dir)) as LadderStep
        if (next === it.step) return it
        return {
          ...it,
          step: next,
          history: [...it.history, { step: next, date: new Date().toISOString() }],
        }
      }),
    )
  }

  const remove = (id: string) => {
    setItems(items.filter((it) => it.id !== id))
  }

  const active = items.filter((i) => i.step < 5)
  const released = items.filter((i) => i.step === 5)

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 pt-8 md:pt-14 pb-24">
      <div className="eyebrow mb-3">Journey IV · Gentle let-go methods</div>
      <h1 className="font-display italic font-light text-5xl md:text-6xl text-ink leading-none">
        The Exposure
        <br />
        <span className="font-medium text-sage-500">Ladder</span>
      </h1>
      <div className="accent-rule mt-5" />
      <p className="font-display italic text-2xl text-muted mt-5 max-w-xl leading-snug">
        One small step at a time. Add an emotionally sticky item below — and walk it gently down.
      </p>

      {/* The 5 steps reference */}
      <div className="mt-9 mb-10 grid grid-cols-5 gap-2 md:gap-3">
        {ladderSteps.map((s) => (
          <div key={s.n} className="text-center bg-sage-50 rounded-lg p-3 md:p-4">
            <div className="font-display italic text-3xl md:text-4xl text-sage-400 leading-none">{s.roman}</div>
            <div className="font-display text-sm md:text-base text-ink mt-1.5 leading-tight">{s.title}</div>
          </div>
        ))}
      </div>

      {/* ADD BUTTON */}
      {!showAdd && (
        <button onClick={() => setShowAdd(true)} className="w-full bg-cream hover:bg-gold-soft/40 border-2 border-dashed border-gold-soft hover:border-gold rounded-2xl p-7 transition-colors flex items-center justify-center gap-2 text-sage-600 font-display italic text-2xl">
          <Plus className="w-6 h-6" /> Add an item to the ladder
        </button>
      )}

      {showAdd && (
        <div className="bg-ivory border border-sage-300 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="eyebrow mb-1">A new item</div>
              <h3 className="font-display text-2xl text-ink">Just one. That's enough.</h3>
            </div>
            <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-full hover:bg-cream text-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.22em] text-sage-600 mb-2">
                What's the item?
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mom's old vase. The boxes in the basement."
                className="input-line"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.22em] text-sage-600 mb-2">
                Why is this hard? (optional)
              </label>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="It reminds me of…"
                rows={2}
                className="textarea-soft text-base"
              />
            </div>
            <button onClick={addItem} disabled={!name.trim()} className="btn-primary">
              <Sparkles className="w-4 h-4" /> Begin at Step I
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE ITEMS */}
      {active.length > 0 && (
        <section className="mt-12">
          <div className="eyebrow mb-3">In process</div>
          <h2 className="font-display text-2xl text-ink mb-5">Walking down the staircase.</h2>
          <div className="space-y-4">
            {active.map((item) => (
              <ItemRow key={item.id} item={item} onAdvance={advance} onRemove={remove} />
            ))}
          </div>
        </section>
      )}

      {/* RELEASED */}
      {released.length > 0 && (
        <section className="mt-14">
          <div className="eyebrow mb-3">Released</div>
          <h2 className="font-display text-2xl text-ink mb-5">What you've let go of.</h2>
          <div className="space-y-2">
            {released.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-sage-50/60 border border-sage-200 rounded-lg px-4 py-3">
                <div>
                  <div className="font-display italic text-lg text-sage-600">{item.name}</div>
                  {item.why && <div className="text-sm text-muted">{item.why}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-sage-500">Released</span>
                  <button onClick={() => remove(item.id)} className="p-1.5 rounded-full hover:bg-ivory text-muted">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {items.length === 0 && !showAdd && (
        <div className="mt-12 text-center py-12 px-4">
          <div className="font-display italic text-3xl text-muted leading-snug max-w-md mx-auto">
            How do you eat an elephant?
            <br />
            <span className="text-sage-500">One bite at a time.</span>
          </div>
          <p className="text-sm text-muted mt-4 max-w-md mx-auto">
            Choose just one emotionally sticky item to begin. The ladder lives here. Come back as often as you'd like.
          </p>
        </div>
      )}

      {/* LADDER REFERENCE */}
      <section className="mt-20 pt-10 border-t border-rule/60">
        <div className="eyebrow mb-3">Reference</div>
        <h2 className="font-display text-2xl text-ink mb-6">The five steps explained.</h2>
        <div className="space-y-3">
          {ladderSteps.map((s) => (
            <div key={s.n} className="flex gap-4 bg-ivory border border-rule/60 rounded-xl p-4 md:p-5">
              <div className="font-display italic text-3xl text-sage-400 w-12 text-center flex-shrink-0 leading-none pt-1">
                {s.roman}
              </div>
              <div className="flex-1">
                <h4 className="font-display text-xl text-ink font-medium leading-tight">{s.title}</h4>
                <p className="font-display text-base text-ink-soft mt-1 leading-relaxed">{s.body}</p>
                {s.suggestedDays > 0 && (
                  <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-gold">
                    Suggested wait · {s.suggestedDays} days
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ItemRow({
  item,
  onAdvance,
  onRemove,
}: {
  item: LadderItem
  onAdvance: (id: string, dir: 1 | -1) => void
  onRemove: (id: string) => void
}) {
  const currentStep = ladderSteps[item.step - 1]!
  const nextStep = item.step < 5 ? (ladderSteps as readonly typeof ladderSteps[number][])[item.step] ?? null : null
  const lastTransition = item.history[item.history.length - 1]
  const daysSince = Math.floor(
    (Date.now() - new Date(lastTransition.date).getTime()) / (1000 * 60 * 60 * 24),
  )
  const suggested = currentStep.suggestedDays
  const ready = suggested === 0 || daysSince >= suggested

  return (
    <div className="bg-ivory border border-rule/60 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="font-display italic text-3xl text-ink leading-tight">{item.name}</div>
          {item.why && <div className="text-base text-muted mt-1.5 italic">{item.why}</div>}
        </div>
        <button onClick={() => onRemove(item.id)} className="p-1.5 rounded-full hover:bg-cream text-muted flex-shrink-0">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {ladderSteps.map((s) => (
          <div
            key={s.n}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s.n < item.step ? 'bg-sage-400' : s.n === item.step ? 'bg-gold' : 'bg-rule'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className="bg-cream/60 rounded-xl p-5 border border-gold-soft">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display italic text-3xl text-sage-500">{currentStep.roman}</span>
          <span className="text-xs uppercase tracking-[0.22em] text-muted">Currently at</span>
        </div>
        <div className="font-display text-2xl text-ink font-medium">{currentStep.title}</div>
        <p className="text-base text-ink-soft mt-2 leading-relaxed">{currentStep.body}</p>

        {nextStep && suggested > 0 && (
          <div className="mt-3 text-sm text-muted">
            {ready ? (
              <span className="text-sage-600 font-medium">
                ✓ Ready to advance — it's been {daysSince} day{daysSince === 1 ? '' : 's'}.
              </span>
            ) : (
              <span>
                Suggested wait: {suggested - daysSince} more day{suggested - daysSince === 1 ? '' : 's'} before advancing.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-5 gap-2">
        <button
          onClick={() => onAdvance(item.id, -1)}
          disabled={item.step === 1}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-base font-medium text-muted hover:text-sage-500 hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        {nextStep ? (
          <button onClick={() => onAdvance(item.id, 1)} className="btn-primary text-base">
            Advance to {nextStep.title} <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => onAdvance(item.id, 1)} className="btn-primary text-base">
            Released <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
