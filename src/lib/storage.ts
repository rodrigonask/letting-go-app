// Local-first persistence. No accounts, no backend — everything lives in the user's browser.
// This makes the demo zero-friction: open the link, start using it.

const PREFIX = 'lgwl_v1_'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Silently swallow — likely quota or private mode
  }
}

export function clear(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {}
}

export function clearAll(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {}
}

export type LadderStep = 1 | 2 | 3 | 4 | 5

export interface LadderItem {
  id: string
  name: string
  why: string
  step: LadderStep
  history: { step: LadderStep; date: string; note?: string }[]
  createdAt: string
}

export interface ResetEntry {
  date: string // YYYY-MM-DD
  durationSec: number
  notes?: string
}

export interface UserProfile {
  name?: string
  why?: string
  rooms?: string[]
  createdAt: string
}

export interface JourneyAnswers {
  [fieldId: string]: string
}

export type AllAnswers = {
  [journeyId: string]: JourneyAnswers
}
