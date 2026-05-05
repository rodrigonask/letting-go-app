// Procedural ambient pad — five sine voices in a soft Aeolian chord,
// each with slow LFO swells and slight detune drift, low-pass filtered.
// No audio asset, no copyright, fully tunable.

import { useEffect, useRef, useState } from 'react'

const VOICES = [
  { freq: 110.0, vol: 0.18 }, // A2 — root
  { freq: 164.81, vol: 0.14 }, // E3 — fifth
  { freq: 220.0, vol: 0.13 }, // A3 — octave
  { freq: 261.63, vol: 0.10 }, // C4 — minor third
  { freq: 329.63, vol: 0.09 }, // E4 — top
]

export function useAmbientPad() {
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{ stop: (when: number) => void }[]>([])
  const masterRef = useRef<GainNode | null>(null)
  const [playing, setPlaying] = useState(false)

  const start = async () => {
    if (ctxRef.current) return
    try {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
      const ctx = new Ctx()
      // Some browsers suspend on first creation
      if (ctx.state === 'suspended') await ctx.resume()
      ctxRef.current = ctx

      const master = ctx.createGain()
      master.gain.setValueAtTime(0, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3)

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1400
      filter.Q.value = 0.6

      master.connect(filter)
      filter.connect(ctx.destination)
      masterRef.current = master

      VOICES.forEach((v) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = v.freq

        const gain = ctx.createGain()
        gain.gain.value = v.vol
        osc.connect(gain)
        gain.connect(master)

        // Slow swell (0.04–0.12 Hz, ~8–25 sec cycles)
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = 0.04 + Math.random() * 0.08
        lfoGain.gain.value = v.vol * 0.6
        lfo.connect(lfoGain)
        lfoGain.connect(gain.gain)

        // Tiny detune drift for warmth
        const detune = ctx.createOscillator()
        const detuneGain = ctx.createGain()
        detune.frequency.value = 0.06 + Math.random() * 0.05
        detuneGain.gain.value = 3 + Math.random() * 4 // cents
        detune.connect(detuneGain)
        detuneGain.connect(osc.detune)

        osc.start()
        lfo.start()
        detune.start()

        nodesRef.current.push(
          { stop: (t) => osc.stop(t) },
          { stop: (t) => lfo.stop(t) },
          { stop: (t) => detune.stop(t) },
        )
      })

      setPlaying(true)
    } catch (e) {
      // Audio blocked or unsupported — fail silently
      console.warn('Ambient pad unavailable:', e)
    }
  }

  const stop = () => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) {
      setPlaying(false)
      return
    }
    const t = ctx.currentTime
    master.gain.cancelScheduledValues(t)
    master.gain.setValueAtTime(master.gain.value, t)
    master.gain.linearRampToValueAtTime(0, t + 1.5)
    nodesRef.current.forEach((n) => {
      try {
        n.stop(t + 1.6)
      } catch {}
    })
    setTimeout(() => {
      try {
        ctx.close()
      } catch {}
      ctxRef.current = null
      masterRef.current = null
      nodesRef.current = []
    }, 1700)
    setPlaying(false)
  }

  useEffect(
    () => () => {
      // Cleanup on unmount
      const ctx = ctxRef.current
      if (ctx) {
        try {
          ctx.close()
        } catch {}
      }
    },
    [],
  )

  return { playing, start, stop }
}

// Soft bell chime, used for milestone markers and completion
export function playChime(freq = 660, durationSec = 1.2) {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
    const ctx = new Ctx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    o.connect(g)
    g.connect(ctx.destination)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.04)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec)
    o.start()
    o.stop(ctx.currentTime + durationSec + 0.05)
    setTimeout(() => ctx.close().catch(() => {}), (durationSec + 0.2) * 1000)
  } catch {}
}
