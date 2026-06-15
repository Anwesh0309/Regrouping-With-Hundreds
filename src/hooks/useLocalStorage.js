import { useState } from 'react';

// ── Strict phase order — must match App.jsx ──────────────────────────────────
const REQUIRED_PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect'];

/**
 * Returns true only when the saved object has:
 *  - a valid phaseComplete object with all 5 phases as booleans
 *  - phases are in the correct sequential order (no later phase can be
 *    complete if an earlier one is not, except for resume mid-sequence)
 */
function isValidGameState(parsed) {
  if (!parsed || typeof parsed !== 'object') return false;
  const pc = parsed.phaseComplete;
  if (!pc || typeof pc !== 'object') return false;

  // All 5 keys must exist and be booleans
  if (!REQUIRED_PHASES.every((k) => typeof pc[k] === 'boolean')) return false;

  // Enforce sequential integrity:
  // If a phase N is complete, all phases 0..N-1 must also be complete.
  let seenFalse = false;
  for (const phase of REQUIRED_PHASES) {
    if (seenFalse && pc[phase]) {
      // A later phase is marked complete but an earlier one isn't — corrupt
      return false;
    }
    if (!pc[phase]) seenFalse = true;
  }

  return true;
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Reject if older than 24 h
        const age = parsed.timestamp ? Date.now() - parsed.timestamp : 0;
        if (age < 86_400_000 && isValidGameState(parsed)) {
          return parsed;
        }
      }
    } catch { /* ignore parse errors */ }

    // Nothing valid — start completely fresh
    try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    return initialValue;
  });

  const setValue = (value) => {
    try {
      const next = value instanceof Function ? value(storedValue) : value;
      setStoredValue(next);
      window.localStorage.setItem(key, JSON.stringify({ ...next, timestamp: Date.now() }));
    } catch (err) {
      console.error('localStorage write error:', err);
    }
  };

  return [storedValue, setValue];
}
