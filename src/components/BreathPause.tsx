import { useEffect, useState } from 'react'
import { Wind, X } from 'lucide-react'

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'rest'

const SEQUENCE: { phase: Phase; seconds: number; label: string }[] = [
  { phase: 'inhale', seconds: 4, label: 'Breathe in' },
  { phase: 'hold', seconds: 7, label: 'Hold' },
  { phase: 'exhale', seconds: 8, label: 'Breathe out' },
  { phase: 'rest', seconds: 1, label: 'Rest' },
]

export default function BreathPause() {
  const [open, setOpen] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [secLeft, setSecLeft] = useState(SEQUENCE[0]!.seconds)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    if (!open) return
    const id = setInterval(() => {
      setSecLeft((s) => {
        if (s > 1) return s - 1
        // Advance phase
        setStepIdx((i) => {
          const next = (i + 1) % SEQUENCE.length
          setSecLeft(SEQUENCE[next]!.seconds)
          if (next === 0) setCycles((c) => c + 1)
          return next
        })
        return SEQUENCE[stepIdx]!.seconds
      })
    }, 1000)
    return () => clearInterval(id)
  }, [open, stepIdx])

  const close = () => {
    setOpen(false)
    setStepIdx(0)
    setSecLeft(SEQUENCE[0]!.seconds)
    setCycles(0)
  }

  const step = SEQUENCE[stepIdx]!
  const scale =
    step.phase === 'inhale'
      ? 1.0
      : step.phase === 'hold'
        ? 1.0
        : step.phase === 'exhale'
          ? 0.55
          : 0.55
  const transitionMs =
    step.phase === 'inhale' ? 4000 : step.phase === 'exhale' ? 8000 : 200

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-5 md:right-6 z-40 group"
        title="Take a breath"
      >
        <div className="w-14 h-14 rounded-full bg-sage-500 hover:bg-sage-600 text-cream shadow-lg shadow-sage-500/30 grid place-items-center transition-all hover:scale-105">
          <Wind className="w-5 h-5" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-pulse" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-sage-700/95 grid place-items-center p-6">
          <button
            onClick={close}
            className="absolute top-5 right-5 p-2 rounded-full text-cream/70 hover:bg-cream/10 hover:text-cream"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center text-cream max-w-md">
            <div className="text-[11px] tracking-[0.42em] uppercase text-gold-soft mb-3">
              4 · 7 · 8 breath
            </div>
            <h2 className="font-display italic text-4xl md:text-5xl mb-12">
              Take a moment.
            </h2>

            {/* Breathing orb */}
            <div className="relative h-80 grid place-items-center mb-8">
              <div
                className="rounded-full bg-cream/15 border border-cream/30 grid place-items-center"
                style={{
                  width: 280,
                  height: 280,
                  transform: `scale(${scale})`,
                  transition: `transform ${transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              >
                <div className="text-center">
                  <div className="font-display italic text-3xl text-cream/95">{step.label}</div>
                  <div className="font-display text-7xl text-gold-soft mt-2 tabular-nums">
                    {secLeft}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-base text-cream/70">
              {cycles} cycle{cycles === 1 ? '' : 's'} complete · close anytime
            </div>
          </div>
        </div>
      )}
    </>
  )
}
