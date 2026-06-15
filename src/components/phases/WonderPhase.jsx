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
        if (prev >= 833) {
          clearInterval(interval);
          setIsCounting(false);
          return 833;
        }
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
    <div className="glass-card glass-card--interactive phase-screen phase-screen--narrow" style={{ padding: 'var(--space-md)' }}>
      <div className="phase-band phase-band--wonder" style={{ marginBottom: 'var(--space-sm)' }} />

      <h2 className="text-section-heading" style={{ marginBottom: 'var(--space-xs)' }}>
        Wonder Hook
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-xs) 0' }}>
        <Mascot mood={isCounting ? 'curious' : count >= 833 ? 'happy' : 'thinking'} />
      </div>

      <div className="glass-panel glass-panel--inset" style={{
        height: 'clamp(120px, 20vh, 180px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-sm)',
        borderStyle: 'dashed',
        padding: 'var(--space-sm)'
      }}>
        <div style={{
          fontSize: 'clamp(32px, 5.5vh, 60px)',
          marginBottom: '2px',
          animation: isCounting ? 'shake 0.3s infinite' : 'none',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}>
          🧱
        </div>

        <div className="text-number" style={{ textShadow: '0 0 20px rgba(250,204,21,0.35)', fontSize: 'var(--fs-important-numbers)' }}>
          {count} Blocks!
        </div>

        <p className="text-accent-label" style={{ marginTop: '2px', fontSize: 'clamp(12px, 1.6vh, 16px)' }}>
          {count < 833 ? 'Counting blocks rapidly...' : 'Total Delivery Counted!'}
        </p>
      </div>

      <p className="text-body" style={{ maxWidth: '680px', margin: '0 auto var(--space-md) auto', fontSize: 'var(--fs-body-text)', lineHeight: 1.45 }}>
        Oliver's toy shop has <strong className="text-gold">476</strong> blocks and receives{' '}
        <strong className="text-gold">357</strong> more. How can we count them up without losing track? Let's find out!
      </p>

      <button
        onClick={handleComplete}
        disabled={isCounting}
        className="btn-gold"
        style={{ padding: '10px 32px', fontSize: 'var(--fs-button-text)' }}
      >
        Discover the Story ➔
      </button>
    </div>
  );
}
