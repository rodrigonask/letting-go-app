import { useState, useEffect, useRef, useMemo } from 'react'
import { Play, Pause, RotateCcw, Check, Volume2, VolumeX } from 'lucide-react'
import { usePersistedState, todayISO, streakFromDates } from '@/lib/hooks'
import { ResetEntry } from '@/lib/storage'
import { useAmbientPad, playChime } from '@/lib/ambient'

const SESSION_SECONDS = 15 * 60

// Rotating gentle prompts — one per ~90 sec slot
const PROMPTS = [
  'Begin with the surface that bothers you most.',
  'One item at a time. No rush.',
  'Notice your shoulders. Let them drop.',
  "What doesn't have a home yet? Give it one now.",
  "Breathe in slowly. You don't have to fix everything.",
  'Halfway through. You are doing beautifully.',
  'Notice the floor under your feet.',
  'Three deep breaths, then three more items.',
  'Almost there. Keep going gently.',
  'Last minutes. Let the room exhale with you.',
]

// 12 floating particles, randomized once
function useParticles(count = 14) {
  return useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        size: 6 + Math.random() * 22,
        left: Math.random() * 100,
        startY: 100 + Math.random() * 30,
        duration: 22 + Math.random() * 26,
        delay: -Math.random() * 50,
        drift: -30 + Math.random() * 60,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    [count],
  )
}

export default function Reset() {
  const [resets, setResets] = usePersistedState<ResetEntry[]>('resets', [])
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [notes, setNotes] = useState('')
  const intervalRef = useRef<number | null>(null)
  const { playing: musicOn, start: startMusic, stop: stopMusic } = useAmbientPad()
  const particles = useParticles()

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

  // Mid-session chimes at 10:00 and 5:00 remaining (so you know halfway / homestretch)
  useEffect(() => {
    if (!running) return
    if (secondsLeft === 10 * 60 || secondsLeft === 5 * 60) {
      playChime(523.25, 1.0) // C5, gentle
    }
  }, [secondsLeft, running])

  // Completion
  useEffect(() => {
    if (secondsLeft === 0 && running) {
      setRunning(false)
      setCompleted(true)
      playChime(659.25, 2.0) // E5, longer bell
    }
  }, [secondsLeft, running])

  const start = async () => {
    if (secondsLeft === 0) {
      setSecondsLeft(SESSION_SECONDS)
      setCompleted(false)
    }
    setRunning(true)
    if (!musicOn) await startMusic()
  }

  const pause = () => {
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setSecondsLeft(SESSION_SECONDS)
    setCompleted(false)
    setNotes('')
    if (musicOn) stopMusic()
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
    if (musicOn) stopMusic()
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const elapsed = SESSION_SECONDS - secondsLeft
  const progress = elapsed / SESSION_SECONDS
  const streak = streakFromDates(resets.map((r) => r.date))
  const today = resets.filter((r) => r.date === todayISO()).length
  const inSession = running || (secondsLeft < SESSION_SECONDS && !completed)
  const promptIndex = Math.min(Math.floor(elapsed / 90), PROMPTS.length - 1)
  const currentPrompt = PROMPTS[promptIndex]

  return (
    <div className="relative">
      {/* AMBIENT BACKGROUND — only when in session */}
      {inSession && (
        <>
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-sage-100 via-cream to-sage-50 bg-drift pointer-events-none" />
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
              <span
                key={i}
                className="particle bg-sage-300"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.startY}%`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  ['--drift' as any]: `${p.drift}px`,
                  ['--target-opacity' as any]: p.opacity,
                }}
              />
            ))}
          </div>
        </>
      )}

      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-8 md:pt-14 pb-24 relative">
        <div className="eyebrow mb-3">Journey V · Daily resets</div>
        <h1 className="font-display italic font-light text-5xl md:text-6xl text-ink leading-none">
          The 15-Minute
          <br />
          <span className="font-medium text-sage-500">Reset</span>
        </h1>
        <div className="accent-rule mt-5" />
        <p className="font-display italic text-2xl text-muted mt-5 leading-snug">
          Before your tush hits the couch tonight, take 15 minutes. Put a few things back where they belong. That's it.
        </p>

        {/* TIMER + PULSING AURA */}
        <div className="mt-12 grid place-items-center">
          <div className="relative w-72 h-72 md:w-80 md:h-80">
            {/* Pulsing aura, only while running */}
            {running && (
              <>
                <div className="absolute inset-0 rounded-full bg-sage-300 aura-pulse" style={{ filter: 'blur(20px)' }} />
                <div className="absolute -inset-6 rounded-full bg-gold-soft/30 aura-pulse" style={{ animationDelay: '-3s', filter: 'blur(30px)' }} />
              </>
            )}

            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90 relative">
              <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(232,239,235,0.7)" strokeWidth="8" />
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

        {/* ROTATING PROMPT — only during session */}
        {inSession && !completed && (
          <div className="mt-8 text-center min-h-[64px]">
            <p key={promptIndex} className="font-display italic text-2xl md:text-3xl text-sage-600 leading-snug breathe-soft">
              {currentPrompt}
            </p>
          </div>
        )}

        {/* CONTROLS */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          {!running && !completed && (
            <button onClick={start} className="btn-primary px-7 py-3.5 text-base">
              <Play className="w-4 h-4" /> {secondsLeft === SESSION_SECONDS ? 'Begin reset' : 'Resume'}
            </button>
          )}
          {running && (
            <button onClick={pause} className="btn-primary px-7 py-3.5 text-base">
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}
          {(secondsLeft < SESSION_SECONDS || completed) && (
            <button onClick={reset} className="btn-ghost text-base">
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
          )}
          <button
            onClick={() => (musicOn ? stopMusic() : startMusic())}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-colors ${
              musicOn
                ? 'bg-gold-soft/60 text-gold-deep hover:bg-gold-soft'
                : 'text-muted hover:text-sage-500 hover:bg-cream'
            }`}
            title={musicOn ? 'Mute the pad' : 'Play ambient pad'}
          >
            {musicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {musicOn ? 'Sound on' : 'Sound off'}
          </button>
        </div>

        <div className="mt-3 text-center text-sm text-muted">
          {running && secondsLeft <= 5 * 60 && secondsLeft > 0 && '✦ Last five minutes — stay gentle.'}
          {running && secondsLeft <= 10 * 60 && secondsLeft > 5 * 60 && 'You are halfway. Beautiful work.'}
        </div>

        {/* COMPLETED FLOW */}
        {completed && (
          <div className="mt-10 bg-gradient-to-b from-sage-50 to-ivory border border-sage-300 rounded-2xl p-6 md:p-7">
            <div className="text-gold font-display italic text-4xl text-center">— ✦ —</div>
            <h3 className="font-display italic text-3xl md:text-4xl text-sage-600 text-center mt-3 leading-tight">
              That's it.
              <br />
              You did the thing.
            </h3>
            <p className="text-center text-muted text-base mt-4 max-w-sm mx-auto">
              Take a body snapshot — has anything shifted? Then jot a note (optional) and log this session.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What feels lighter now? What did you put back where it belongs?"
              className="textarea-soft text-lg mt-5"
            />
            <button onClick={logSession} className="btn-primary mt-4 w-full justify-center text-base">
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
                <div key={i} className="flex items-start justify-between bg-ivory border border-rule/60 rounded-lg p-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg text-ink">{r.date}</div>
                    {r.notes && <div className="text-base text-muted italic mt-0.5">"{r.notes}"</div>}
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
          <p className="font-display italic text-2xl md:text-3xl text-sage-600 leading-snug">
            You don't need to be perfect.
            <br />
            You just need to be consistent.
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-cream/60 border border-rule/60 rounded-xl p-4 text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-muted">{label}</div>
      <div className="font-display text-3xl text-sage-600 mt-1">{value}</div>
      <div className="text-sm text-muted">{sub}</div>
    </div>
  )
}
