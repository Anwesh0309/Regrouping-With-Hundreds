import { useEffect, useMemo, useState } from 'react';
import { usePageNarration } from '../../hooks/useAudio';
import { wonderNarration } from '../../utils/narration';
import { cleanupAudio } from '../../utils/audioManager';
import Mascot from '../shared/Mascot';

export default function WonderPhase({ audioEnabled, onComplete }) {
  const [count, setCount] = useState(476);
  const [isCounting, setIsCounting] = useState(false);
  const segments = useMemo(() => wonderNarration(), []);

  usePageNarration(audioEnabled, 'wonder-hook', segments);

  useEffect(() => {
    const timer = setTimeout(() => setIsCounting(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isCounting) return undefined;
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 833) { clearInterval(interval); setIsCounting(false); return 833; }
        return prev + 17;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isCounting]);

  const handleComplete = () => {
    cleanupAudio();
    setTimeout(() => onComplete(), 50);
  };

  return (
    <div
      className="glass-card glass-card--interactive phase-screen phase-screen--narrow"
      style={{ padding: 'var(--space-md)', gap: 0, justifyContent: 'space-evenly' }}
    >
      <div className="phase-band phase-band--wonder" style={{ marginBottom: 'var(--space-xs)' }} />

      {/* Title */}
      <h2 style={{
        fontFamily: "'Fredoka One', Nunito, sans-serif",
        fontSize: 'clamp(28px, 4.5vh, 52px)',
        fontWeight: 900,
        color: '#ffffff',
        margin: '0 0 var(--space-xs) 0',
        textAlign: 'center',
        lineHeight: 1.1,
      }}>
        🔮 Wonder Hook
      </h2>

      {/* Mascot */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Mascot mood={isCounting ? 'curious' : count >= 833 ? 'happy' : 'thinking'} />
      </div>

      {/* Counter panel */}
      <div className="glass-panel glass-panel--inset" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)',
        borderStyle: 'dashed',
        gap: '4px',
      }}>
        <div style={{
          fontSize: 'clamp(40px, 7vh, 72px)',
          animation: isCounting ? 'shake 0.3s infinite' : 'none',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
          lineHeight: 1,
        }}>
          🧱
        </div>

        <div style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(36px, 6.5vh, 72px)',
          fontWeight: 900,
          color: 'var(--color-gold)',
          textShadow: '0 0 24px rgba(250,204,21,0.5)',
          lineHeight: 1,
        }}>
          {count} Blocks!
        </div>

        <p style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(14px, 2vh, 20px)',
          fontWeight: 900,
          color: 'var(--color-wonder)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {count < 833 ? 'Counting blocks rapidly...' : '✓ Total Delivery Counted!'}
        </p>
      </div>

      {/* Story text */}
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 'clamp(16px, 2.3vh, 22px)',
        fontWeight: 800,
        color: '#e2e8f0',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: '600px',
        lineHeight: 1.5,
      }}>
        Oliver's toy shop has{' '}
        <strong style={{ color: 'var(--color-gold)', fontSize: '1.2em' }}>476</strong>{' '}
        blocks and receives{' '}
        <strong style={{ color: 'var(--color-gold)', fontSize: '1.2em' }}>357</strong>{' '}
        more. How can we count them without losing track?
      </p>

      {/* CTA button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleComplete}
          disabled={isCounting}
          className="btn-gold"
          style={{ padding: '14px 40px', fontSize: 'clamp(16px,2.4vh,22px)' }}
        >
          Discover the Story ➔
        </button>
      </div>
    </div>
  );
}
