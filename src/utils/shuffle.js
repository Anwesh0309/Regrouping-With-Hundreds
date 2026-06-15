export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  
  // Pick exactly 10 questions per type (shuffled within type)
  const selected = Object.values(byType).flatMap(qs => shuffleArray(qs).slice(0, 10));
  
  // Final cross-type shuffle to create the 100-question journey
  // Wait, let's keep the order sorted by difficulty or let it be fully shuffled?
  // Let's sort them by world order so that World 1 gets World 1 questions, World 2 gets World 2, etc.
  // The TRD says:
  // World 1 (Q1-10: Addition, regroup hundreds, easy)
  // World 2 (Q11-20: Addition, regroup hundreds, med)
  // ...
  // So questions should be ordered by their world! That's very important.
  // Let's group them by world, shuffle within each world, and then assemble them in order of World 0 to 9.
  // That matches the progress map perfectly!
  const byWorld = Array.from({ length: 10 }, () => []);
  selected.forEach(q => {
    // each question has a world property (0-9)
    if (q.world >= 0 && q.world < 10) {
      byWorld[q.world].push(q);
    }
  });

  // Shuffle within each world, then flatten
  const finalSet = [];
  for (let w = 0; w < 10; w++) {
    const worldQs = shuffleArray(byWorld[w]);
    // If a world doesn't have exactly 10 questions, fill it up or adjust.
    // Let's make sure it has exactly 10 questions.
    finalSet.push(...worldQs.slice(0, 10));
  }

  return finalSet;
}
