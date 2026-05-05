import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Check } from 'lucide-react'
import { usePersistedState, todayISO, streakFromDates } from '@/lib/hooks'
import { ResetEntry } from '@/lib/storage'

const SESSION_SECONDS = 15 * 60

export default function Reset() {
  const [resets, setResets] = usePersistedState<ResetEntry[]>('resets', [])
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [notes, setNotes] = useState('')
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1))
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  useEffect(() => {
    if (secondsLeft === 0 && running) {
      setRunning(false)
      setCompleted(true)
      // Try to play a soft chime. Fallback gracefully if blocked.
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.connect(g)
        g.connect(ctx.destination)
        o.frequency.value = 660
        g.gain.setValueAtTime(0.0001, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)
        o.start()
        o.stop(ctx.currentTime + 1.3)
      } catch {}
    }
  }, [secondsLeft, running])

  const start = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(SESSION_SECONDS)
      setCompleted(false)
    }
    setRunning(true)
  }

  const reset = () => {
    setRunning(false)
    setSecondsLeft(SESSION_SECONDS)
    setCompleted(false)
    setNotes('')
  }

  const logSession = () => {
    const entry: ResetEntry = {
      date: todayISO(),
      durationSec: SESSION_SECONDS - secondsLeft,
      notes: notes.trim() || undefined,
    }
    setResets([entry, ...resets])
    setSecondsLeft(SESSION_SECONDS)
    setCompleted(false)
    setNotes('')
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const progress = (SESSION_SECONDS - secondsLeft) / SESSION_SECONDS
  const streak = streakFromDates(resets.map((r) => r.date))
  const today = resets.filter((r) => r.date === todayISO()).length

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 pt-8 md:pt-14 pb-24">
      <div className="eyebrow mb-3">Journey V · Daily resets</div>
      <h1 className="font-display italic font-light text-5xl md:text-6xl text-ink leading-none">
        The 15-Minute
        <br />
        <span className="font-medium text-sage-500">Reset</span>
      </h1>
      <div className="accent-rule mt-5" />
      <p className="font-display italic text-xl text-muted mt-5">
        Before your tush hits the couch tonight, take 15 minutes. Put a few things back where they belong. That's it.
      </p>

      {/* TIMER */}
      <div className="mt-12 grid place-items-center">
        <div className="relative w-72 h-72 md:w-80 md:h-80">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#E8EFEB" strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="#7A9E8E"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 92}
              strokeDashoffset={2 * Math.PI * 92 * (1 - progress)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display text-7xl md:text-8xl text-ink leading-none tabular-nums">
                {minutes}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-[11px] tracking-[0.32em] uppercase text-muted mt-3">
                {completed ? 'Time' : running ? 'Resetting' : secondsLeft < SESSION_SECONDS ? 'Paused' : 'Ready'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {!running && !completed && (
          <button onClick={start} className="btn-primary px-7 py-3 text-base">
            <Play className="w-4 h-4" /> {secondsLeft === SESSION_SECONDS ? 'Begin reset' : 'Resume'}
          </button>
        )}
        {running && (
          <button onClick={() => setRunning(false)} className="btn-primary px-7 py-3 text-base">
            <Pause className="w-4 h-4" /> Pause
          </button>
        )}
        {(secondsLeft < SESSION_SECONDS || completed) && (
          <button onClick={reset} className="btn-ghost">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* COMPLETED FLOW */}
      {completed && (
        <div className="mt-10 bg-gradient-to-b from-sage-50 to-ivory border border-sage-300 rounded-2xl p-6">
          <div className="text-gold font-display italic text-3xl text-center">— ✦ —</div>
          <h3 className="font-display italic text-3xl text-sage-600 text-center mt-3 leading-tight">
            That's it.
            <br />
            You did the thing.
          </h3>
          <p className="text-center text-muted text-sm mt-3 max-w-sm mx-auto">
            Take a body snapshot — has anything shifted? Then jot a note (optional) and log this session.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="What feels lighter now? What did you put back where it belongs?"
            className="textarea-soft text-base mt-5"
          />
          <button onClick={logSession} className="btn-primary mt-4 w-full justify-center">
            <Check className="w-4 h-4" /> Log this reset
          </button>
        </div>
      )}

      {/* STATS */}
      <section className="mt-16">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Streak" value={`${streak}`} sub={`day${streak === 1 ? '' : 's'}`} />
          <Stat label="Today" value={String(today)} sub={`reset${today === 1 ? '' : 's'}`} />
          <Stat label="Total" value={String(resets.length)} sub="logged" />
        </div>
      </section>

      {/* HISTORY */}
      {resets.length > 0 && (
        <section className="mt-12">
          <div className="eyebrow mb-3">Recent resets</div>
          <div className="space-y-2">
            {resets.slice(0, 8).map((r, i) => (
              <div key={i} className="flex items-start justify-between bg-ivory border border-rule/60 rounded-lg p-3">
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base text-ink">{r.date}</div>
                  {r.notes && <div className="text-sm text-muted italic mt-0.5">"{r.notes}"</div>}
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-sage-500 flex-shrink-0 ml-3">
                  {Math.round(r.durationSec / 60)} min
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 text-center">
        <p className="font-display italic text-2xl text-sage-600 leading-snug">
          You don't need to be perfect.
          <br />
          You just need to be consistent.
        </p>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-cream/60 border border-rule/60 rounded-xl p-4 text-center">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted">{label}</div>
      <div className="font-display text-3xl text-sage-600 mt-1">{value}</div>
      <div className="text-xs text-muted">{sub}</div>
    </div>
  )
}
