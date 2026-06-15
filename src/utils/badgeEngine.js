export const BADGES = [
  {
    id: 'place_value_pioneer',
    label: '🏅 Place Value Pioneer',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'regrouper',
    label: '🥈 Regrouper',
    description: 'Complete all 3 simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'hundreds_hero',
    label: '🥇 Hundreds Hero',
    description: 'Score 80%+ across the Play phase',
    condition: (s) => {
      const total = s.worldScores.reduce((sum, ws) => sum + (ws ?? 0), 0);
      return total >= 80;
    },
  },
  {
    id: 'perfect_column',
    label: '💎 Perfect Column',
    description: 'Score 10/10 in any single world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_legend',
    label: '🔥 Streak Legend',
    description: 'Achieve a 10-answer consecutive streak',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'double_digit',
    label: '⚡ Double Regrouper',
    description: 'Answer a double-regrouping question correctly on the first try',
    condition: (s) => s.doubleReGroupFirstTry === true,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}
