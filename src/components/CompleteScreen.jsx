import Mascot from './shared/Mascot';
import { BADGES } from '../utils/badgeEngine';

export default function CompleteScreen({ gameState, onResetSession }) {
  const totalStars = gameState.worldStars.reduce((sum, s) => sum + (s || 0), 0);
  const unlockedBadges = BADGES.filter((b) => gameState.badges.includes(b.id));

  return (
    <div className="certificate-card phase-screen phase-screen--narrow" style={{ margin: '40px auto' }}>
      <Mascot mood="celebrating" />

      <h1 className="text-main-heading" style={{
        marginTop: 'var(--space-md)',
        marginBottom: 'var(--space-sm)',
        color: 'var(--color-gold)',
        textShadow: '0 0 24px rgba(250,204,21,0.35)'
      }}>
        Congratulations! 🎉
      </h1>

      <p className="text-learning-objective" style={{
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-lg)',
        lineHeight: 1.45
      }}>
        You completed Grade 2 Mathematics Lesson 5.3:{' '}
        <strong className="text-gold">Regrouping with Hundreds!</strong>
      </p>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <span className="text-accent-label" style={{ fontSize: '16px' }}>Total XP</span>
          <div className="text-number" style={{ marginTop: '8px', color: '#ffffff' }}>
            {gameState.xp}
          </div>
        </div>
        <div>
          <span className="text-accent-label" style={{ fontSize: '16px' }}>Stars Earned</span>
          <div className="text-number" style={{ marginTop: '8px' }}>
            ⭐ {totalStars}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 className="text-learning-objective text-gold" style={{ marginBottom: 'var(--space-md)' }}>
          🏆 Badges Earned ({unlockedBadges.length} of 7)
        </h3>

        {unlockedBadges.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--space-sm)'
          }}>
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: 'popIn 0.3s ease forwards',
                  transition: 'transform 0.2s'
                }}
              >
                <span style={{ fontSize: '36px', marginBottom: '8px' }}>{badge.label.split(' ')[0]}</span>
                <span className="text-gold" style={{
                  fontSize: 'var(--fs-caption)',
                  fontWeight: 900,
                  fontFamily: "'Fredoka One', Nunito, sans-serif",
                  lineHeight: 1.2
                }}>
                  {badge.label.substring(badge.label.indexOf(' ') + 1)}
                </span>
                <span className="text-body" style={{
                  fontSize: '16px',
                  marginTop: '8px',
                  lineHeight: 1.3
                }}>
                  {badge.description}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body">No badges unlocked this run. Try playing again!</p>
        )}
      </div>

      <button onClick={onResetSession} className="btn-gold">
        Restart Lesson 🔄
      </button>
    </div>
  );
}
