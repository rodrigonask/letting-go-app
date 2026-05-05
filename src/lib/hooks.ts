import { useEffect, useState } from 'react'
import { load, save } from './storage'

// Persistent state hook — reads from localStorage on mount, writes on every change.
export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => load<T>(key, initial))

  useEffect(() => {
    save(key, value)
  }, [key, value])

  return [value, setValue] as const
}

// Returns today's date as YYYY-MM-DD in the user's local timezone.
export function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Compute current consecutive-day streak from a list of date strings.
export function streakFromDates(dates: string[]): number {
  if (dates.length === 0) return 0
  const set = new Set(dates)
  let streak = 0
  const cursor = new Date()
  for (;;) {
    const yyyy = cursor.getFullYear()
    const mm = String(cursor.getMonth() + 1).padStart(2, '0')
    const dd = String(cursor.getDate()).padStart(2, '0')
    const key = `${yyyy}-${mm}-${dd}`
    if (set.has(key)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      // Allow today to be empty without breaking the streak
      if (streak === 0 && set.size > 0) {
        cursor.setDate(cursor.getDate() - 1)
        const yk = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
        if (set.has(yk)) continue
      }
      break
    }
  }
  return streak
}
