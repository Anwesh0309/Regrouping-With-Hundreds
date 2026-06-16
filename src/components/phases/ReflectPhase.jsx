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
    <div className="glass-card glass-card--interactive phase-screen" style={{ maxWidth: '880px', padding: 'var(--space-sm) var(--space-md)', overflow: 'hidden', gap: 0, justifyContent: 'space-between' }}>
      <div className="phase-band phase-band--reflect" style={{ marginBottom: 'var(--space-xs)' }} />

      <h2 className="text-section-heading" style={{ marginBottom: 'var(--space-xs)', textAlign: 'center', fontSize: 'clamp(24px,3.8vh,42px)' }}>
        🏆 Reflect &amp; Scoreboard
      </h2>

      {/* ── SCOREBOARD ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
        {[
          { icon: '✨', label: 'Total XP', value: totalXP, color: '#facc15' },
          { icon: '⭐', label: 'Stars', value: `${totalStars} / 30`, color: '#fbbf24' },
          { icon: '🔥', label: 'Best Streak', value: maxStreak, color: '#fb923c' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px' }}>{s.icon}</div>
            <div style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", fontSize: 'clamp(18px,2.8vh,28px)', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 'clamp(11px,1.4vh,13px)', color: '#94a3b8', fontWeight: 800 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* World scores */}
      <div style={{ marginBottom: '6px' }}>
        <h4 style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", color: '#facc15', fontSize: 'clamp(11px,1.5vh,14px)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 5px' }}>
          World Results
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
          {worldNames.map((name, i) => {
            const stars = worldStars[i] || 0;
            const score = worldScores[i];
            const played = score !== null;
            return (
              <div key={i} style={{ background: played ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${played ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '10px', padding: '5px 2px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", fontWeight: 900, color: played ? '#4ade80' : '#64748b', fontSize: 'clamp(10px,1.3vh,13px)', lineHeight: 1 }}>W{i + 1}</div>
                <div style={{ fontSize: 'clamp(10px,1.3vh,13px)', margin: '2px 0' }}>{played ? ('⭐'.repeat(stars) || '0⭐') : '—'}</div>
                {played && <div style={{ color: '#94a3b8', fontSize: '10px' }}>{score}/10</div>}
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
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />

      {/* Reflection prompt — row layout to save vertical space */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <div style={{ flexShrink: 0 }}>
          <Mascot mood="curious" />
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: 'clamp(14px,1.9vh,18px)',
            fontWeight: 900,
            color: '#e2e8f0',
            margin: '0 0 6px',
            lineHeight: 1.4,
          }}>
            What did you learn about regrouping? Explain it to Leo with an example!
          </p>

          <div className="glass-panel glass-panel--inset" style={{ padding: '10px 14px' }}>
            <textarea
              value={reflectionText}
              onChange={(e) => { setReflectionText(e.target.value); if (e.target.value.trim().length >= 10) setErrorMsg(''); }}
              placeholder="Dear Leo, regrouping is when we..."
              style={{ width: '100%', height: '72px', border: 'none', outline: 'none', resize: 'none', backgroundColor: 'transparent', fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(14px,1.9vh,17px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
              {reflectionText.length} / 10 min chars
            </div>
          </div>

          {errorMsg && (
            <p style={{ color: '#f87171', fontSize: '13px', fontWeight: 800, margin: '4px 0 0' }}>
              ⚠️ {errorMsg}
            </p>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <button onClick={handleSubmit} className="btn-gold" style={{ padding: '12px 36px', fontSize: 'clamp(15px,2.2vh,20px)' }}>
          Complete Lesson! 🎉
        </button>
      </div>
    </div>
  );
}
