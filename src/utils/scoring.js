import { shuffleArray } from './shuffle.js';

export function calcXP(attemptNumber, hintsUsed, streak) {
  let base;
  if (attemptNumber === 1 && hintsUsed === 0) {
    base = 10; // Perfect first try
  } else if (hintsUsed > 0) {
    base = 5;  // Used a hint
  } else {
    base = 7;  // Second try, no hint
  }

  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(correctCount) {
  // Thresholds: 9-10 → 3 stars, 7-8 → 2 stars, 6 → 1 star, <6 → locked
  if (correctCount >= 9) return 3;
  if (correctCount >= 7) return 2;
  if (correctCount >= 6) return 1;
  return 0; // locked — world not unlocked
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 6; // >=6/10 correct = 1 star minimum
}

export function generateDistractors(correct, operandA, operandB, mode) {
  const candidates = new Set();

  if (mode === 'add') {
    candidates.add(correct - 10);  // Forgot tens carry
    candidates.add(correct - 100); // Forgot hundreds carry
    candidates.add(correct + 10);  // Double carried tens
    candidates.add(correct - 9);   // Ones digit off by 1
  } else {
    candidates.add(correct + 10);  // Forgot to borrow from tens
    candidates.add(correct + 100); // Forgot to borrow from hundreds
    candidates.add(correct - 10);  // Borrowed when not needed
    candidates.add(correct + 1);   // Ones digit off by 1
  }

  // Filter: must be 3-digit, positive, <=999, not equal to correct
  const valid = [...candidates].filter(d => d !== correct && d > 99 && d <= 999);
  const distractors = shuffleArray(valid).slice(0, 3);

  // Ensure always 3 unique distractors
  let fallback = correct + 10;
  while (distractors.length < 3) {
    if (fallback !== correct && !distractors.includes(fallback)) {
      distractors.push(fallback);
    }
    fallback += 10;
  }

  return shuffleArray([correct, ...distractors]);
}
