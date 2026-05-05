import { useEffect, useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { todayISO, usePersistedState } from '@/lib/hooks'

const PROMPTS = [
  "What's one thing on your kitchen counter you don't love anymore?",
  'Name a corner of your home you avoid. What story is it telling?',
  'If you could have one room feel light by next week, which one?',
  "What's the smallest possible win you could claim today?",
  "Which item in your home brings you genuine joy? Why?",
  "What's a 'should' you've been carrying that you could put down?",
  "Whose voice do you hear when guilt shows up about letting things go?",
  'If you kept only the essence of someone you love, what would it be?',
  'What does a room that supports you actually look like?',
  "What's one thing you've kept 'just in case' for over a year?",
  "What feels lighter today than it did a month ago?",
  'Where in your body do you feel clutter the most?',
  'Name a memory you\'re afraid to lose. Where does it actually live?',
  "What would 'enough' look like in your most cluttered room?",
  'What\'s one item that would bless someone else if you let it go?',
  'If a friend told you what you tell yourself, what would you say to her?',
  "What's a small gift you could give your future self today?",
  "Which surface in your home is your 'emotional support surface'?",
  'What\'s a 5-minute thing you could do right now that future-you would thank you for?',
  "Name something you've already let go of recently. How did it feel?",
]

export default function TodaysPrompt() {
  const [seed, setSeed] = usePersistedState<{ date: string; index: number }>('prompt_seed', {
    date: '',
    index: 0,
  })
  const [response, setResponse] = usePersistedState<{ [date: string]: string }>('prompt_responses', {})
  const today = todayISO()

  useEffect(() => {
    if (seed.date !== today) {
      setSeed({ date: today, index: Math.floor(Math.random() * PROMPTS.length) })
    }
  }, [today])

  const draw = () => {
    setSeed({ date: today, index: Math.floor(Math.random() * PROMPTS.length) })
  }

  const prompt = PROMPTS[seed.index] ?? PROMPTS[0]
  const todayValue = response[today] ?? ''

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cream via-ivory to-gold-soft/40 border border-gold-soft p-6 md:p-8">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold-soft/20 blur-2xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="eyebrow text-gold-deep flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Today's gentle prompt
          </div>
          <button
            onClick={draw}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-sage-500 transition-colors"
            title="Draw another"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New prompt
          </button>
        </div>
        <p className="font-display italic text-3xl md:text-4xl text-sage-600 leading-snug mb-5">
          {prompt}
        </p>
        <textarea
          value={todayValue}
          onChange={(e) => setResponse({ ...response, [today]: e.target.value })}
          placeholder="A few words. A whole paragraph. Whatever shows up."
          rows={3}
          className="textarea-soft text-lg"
        />
        {todayValue && (
          <div className="text-xs tracking-[0.22em] uppercase text-sage-500 mt-2">
            ✓ saved on this device
          </div>
        )}
      </div>
    </section>
  )
}
