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
      style={{
        height: '100%',
        width: '100%',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <div className="phase-band phase-band--wonder" style={{ marginBottom: '4px', flexShrink: 0 }} />

      {/* Title */}
      <h2 style={{
        fontFamily: "'Fredoka One', Nunito, sans-serif",
        fontSize: 'clamp(28px, 4.5vh, 48px)',
        fontWeight: 900,
        color: '#ffffff',
        margin: 0,
        textAlign: 'center',
        lineHeight: 1.1,
        letterSpacing: '0.01em',
        flexShrink: 0,
      }}>
        🔮 Wonder Hook
      </h2>

      {/* Mascot */}
      <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <Mascot mood={isCounting ? 'curious' : count >= 833 ? 'happy' : 'thinking'} />
      </div>

      {/* Counter panel */}
      <div className="glass-panel glass-panel--inset" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(10px, 1.8vh, 18px) var(--space-md)',
        borderStyle: 'dashed',
        gap: '4px',
        borderColor: 'rgba(250,204,21,0.4)',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 'clamp(36px, 6vh, 64px)',
          animation: isCounting ? 'shake 0.3s infinite' : 'none',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
          lineHeight: 1,
        }}>
          🧱
        </div>

        <div style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(36px, 6vh, 68px)',
          fontWeight: 900,
          color: 'var(--color-gold)',
          textShadow: '0 0 28px rgba(250,204,21,0.6)',
          lineHeight: 1,
        }}>
          {count} Blocks!
        </div>

        <p style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(14px, 2vh, 20px)',
          fontWeight: 900,
          color: 'var(--color-wonder)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {count < 833 ? 'Counting blocks rapidly...' : '✓ Total Delivery Counted!'}
        </p>
      </div>

      {/* Story text */}
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 'clamp(16px, 2.4vh, 23px)',
        fontWeight: 900,
        color: '#ffffff',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: '640px',
        lineHeight: 1.4,
        flexShrink: 0,
      }}>
        Oliver's toy shop has{' '}
        <strong style={{ color: 'var(--color-gold)', fontSize: '1.2em', fontFamily: "'Fredoka One', Nunito, sans-serif", fontWeight: 900 }}>476</strong>{' '}
        blocks and receives{' '}
        <strong style={{ color: 'var(--color-gold)', fontSize: '1.2em', fontFamily: "'Fredoka One', Nunito, sans-serif", fontWeight: 900 }}>357</strong>{' '}
        more. How can we count them without losing track?
      </p>

      {/* CTA button */}
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <button
          onClick={handleComplete}
          disabled={isCounting}
          className="btn-gold"
          style={{ padding: '14px 44px', fontSize: 'clamp(17px, 2.4vh, 22px)', fontWeight: 900 }}
        >
          Discover the Story ➔
        </button>
      </div>
    </div>
  );
}
