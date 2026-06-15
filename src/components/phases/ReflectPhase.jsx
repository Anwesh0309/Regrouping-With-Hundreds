import { useMemo, useState } from 'react';
import { usePageNarration } from '../../hooks/useAudio';
import { reflectNarration } from '../../utils/narration';
import { cleanupAudio } from '../../utils/audioManager';
import Mascot from '../shared/Mascot';

export default function ReflectPhase({ audioEnabled, onComplete, gameState }) {
  const [reflectionText, setReflectionText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const segments = useMemo(() => reflectNarration(), []);

  usePageNarration(audioEnabled, 'reflect-prompt', segments);

  const handleSubmit = () => {
    if (reflectionText.trim().length < 10) {
      setErrorMsg('Please write at least 10 characters so Leo can understand!');
    } else {
      setErrorMsg('');
      cleanupAudio();
      setTimeout(() => onComplete(reflectionText), 50);
    }
  };

  // Build scoreboard from gameState
  const worldNames = [
    'Addition — No Regroup', 'Addition — Regroup Ones', 'Addition — Regroup Tens',
    'Addition — Double Regroup', 'Subtraction — No Borrow', 'Subtraction — Borrow Tens',
    'Subtraction — Borrow Hundreds', 'Subtraction — Double Borrow', 'Word Problems', 'Mixed & Inverse',
  ];
  const totalXP    = gameState?.xp ?? 0;
  const totalStars = (gameState?.worldStars ?? []).reduce((s, v) => s + (v || 0), 0);
  const maxStreak  = gameState?.maxStreak ?? 0;
  const badges     = gameState?.badges ?? [];
  const worldStars = gameState?.worldStars ?? Array(10).fill(null);
  const worldScores = gameState?.worldScores ?? Array(10).fill(null);

  return (
    <div className="glass-card glass-card--interactive phase-screen" style={{ maxWidth: '820px', padding: 'var(--space-md)', overflow: 'auto' }}>
      <div className="phase-band phase-band--reflect" style={{ marginBottom: 'var(--space-xs)' }} />

      <h2 className="text-section-heading" style={{ marginBottom: 'var(--space-xs)', textAlign: 'center' }}>
        Reflect & Scoreboard
      </h2>

      {/* ── SCOREBOARD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: 'var(--space-sm)' }}>
        {[
          { icon: '✨', label: 'Total XP', value: totalXP, color: '#facc15' },
          { icon: '⭐', label: 'Stars', value: `${totalStars} / 30`, color: '#fbbf24' },
          { icon: '🔥', label: 'Best Streak', value: maxStreak, color: '#fb923c' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px' }}>{s.icon}</div>
            <div style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", fontSize: '20px', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* World scores */}
      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <h4 style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", color: '#facc15', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          World Results
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {worldNames.map((name, i) => {
            const stars = worldStars[i] || 0;
            const score = worldScores[i];
            const played = score !== null;
            return (
              <div key={i} style={{ background: played ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${played ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '8px 6px', textAlign: 'center', fontSize: '11px' }}>
                <div style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", fontWeight: 900, color: played ? '#4ade80' : '#64748b', marginBottom: '2px', lineHeight: 1.2, fontSize: '10px' }}>
                  W{i + 1}
                </div>
                <div style={{ fontSize: '13px' }}>
                  {played ? ('⭐'.repeat(stars) || '0⭐') : '—'}
                </div>
                {played && <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>{score}/10</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <h4 style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", color: '#facc15', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>
            Badges Earned
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {badges.map((bid) => (
              <div key={bid} style={{ background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 900, color: '#facc15', fontFamily: "'Fredoka One', Nunito, sans-serif" }}>
                🏅 {bid}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: 'var(--space-xs) 0' }} />

      {/* Reflection prompt */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xs)' }}>
        <Mascot mood="curious" />
      </div>

      <p className="text-body" style={{ maxWidth: '560px', margin: '0 auto var(--space-sm)', textAlign: 'center', fontSize: 'clamp(13px,1.8vh,16px)' }}>
        What did you learn about regrouping today? Can you explain it to Leo with an example?
      </p>

      <div className="glass-panel glass-panel--inset" style={{ marginBottom: 'var(--space-sm)' }}>
        <textarea
          value={reflectionText}
          onChange={(e) => { setReflectionText(e.target.value); if (e.target.value.trim().length >= 10) setErrorMsg(''); }}
          placeholder="Dear Leo, regrouping is when we..."
          style={{ width: '100%', height: '120px', border: 'none', outline: 'none', resize: 'none', backgroundColor: 'transparent', fontFamily: "'Nunito', sans-serif", fontSize: 'var(--fs-body-text)', fontWeight: 700, color: '#ffffff', lineHeight: 1.5, boxSizing: 'border-box' }}
        />
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
          {reflectionText.length} / 10 min
        </div>
      </div>

      {errorMsg && (
        <p style={{ color: '#f87171', fontSize: '13px', fontWeight: 700, marginBottom: '10px', textAlign: 'center' }}>
          ⚠️ {errorMsg}
        </p>
      )}

      <div style={{ textAlign: 'center' }}>
        <button onClick={handleSubmit} className="btn-gold" style={{ padding: '12px 36px', fontSize: '16px' }}>
          Complete Lesson! 🎉
        </button>
      </div>
    </div>
  );
}
