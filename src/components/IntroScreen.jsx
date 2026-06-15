import Mascot from './shared/Mascot';

export default function IntroScreen({ onStart, hasSavedSession, onResetSession }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      padding: '0 16px',
      boxSizing: 'border-box',
      gap: '18px',
      maxWidth: '680px',
      margin: '0 auto',
    }}>

      {/* Curriculum badge */}
      <div className="badge-pill" style={{ padding: '5px 16px', fontSize: '13px' }}>
        <span>✨</span>
        <span>Singapore MOE Curriculum · Grade 2</span>
      </div>

      {/* Main title */}
      <h1 style={{
        fontFamily: "'Fredoka One', Nunito, sans-serif",
        fontSize: 'clamp(28px, 5vh, 46px)',
        fontWeight: 900,
        color: '#ffffff',
        margin: 0,
        textAlign: 'center',
        lineHeight: 1.1,
      }}>
        Regrouping with{' '}
        <span style={{ color: 'var(--color-gold)', textShadow: '0 0 24px rgba(250,204,21,0.45)' }}>
          Hundreds
        </span>
      </h1>

      {/* Mascot row: avatar + speech bubble */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
      }}>
        {/* Mascot avatar circle */}
        <div style={{
          width: 'clamp(58px, 8vh, 76px)',
          height: 'clamp(58px, 8vh, 76px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 35%, rgba(250,204,21,0.4), rgba(139,92,246,0.3))',
          border: '3px solid var(--color-gold)',
          boxShadow: '0 0 20px rgba(250,204,21,0.3), 0 6px 16px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{ transform: 'scale(1.15) translateY(3px)' }}>
            <Mascot mood="happy" />
          </div>
        </div>

        {/* Speech bubble */}
        <div style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          color: '#1a0a3e',
          padding: '10px 16px',
          borderRadius: '16px',
          fontSize: 'clamp(13px, 1.8vh, 15px)',
          fontWeight: 800,
          fontFamily: "'Nunito', sans-serif",
          boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
          maxWidth: '240px',
          lineHeight: 1.35,
        }}>
          Ready for a number adventure? 🚀
          {/* Left-pointing tail */}
          <div style={{
            position: 'absolute',
            left: '-9px',
            top: '50%',
            transform: 'translateY(-50%)',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '9px solid #FFFFFF',
          }} />
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 'clamp(13px, 1.8vh, 15px)',
        fontWeight: 600,
        color: '#cbd5e1',
        textAlign: 'center',
        margin: 0,
        maxWidth: '520px',
        lineHeight: 1.5,
      }}>
        Join Leo on a journey to add and subtract 3-digit numbers with regrouping
        through stories, simulations, and fun games!
      </p>

      {/* Learning Journey card */}
      <div style={{
        width: '100%',
        backgroundColor: 'rgba(30, 20, 70, 0.65)',
        border: '1.5px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        padding: '16px 20px',
        backdropFilter: 'blur(12px)',
        boxSizing: 'border-box',
      }}>
        <p style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: '11px',
          fontWeight: 900,
          color: 'var(--color-gold)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'center',
          margin: '0 0 14px 0',
        }}>
          Your Learning Journey
        </p>

        {/* Phase flow: Wonder → Story → Simulate, Play → Reflect */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '4px 0',
          rowGap: '10px',
        }}>
          {/* Row 1: Wonder → Story → Simulate */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { icon: '🔮', label: 'Wonder', desc: 'Spark your curiosity', color: 'var(--color-wonder)' },
              null, // arrow
              { icon: '📖', label: 'Story', desc: 'Hear the tale', color: 'var(--color-story)' },
              null,
              { icon: '🧪', label: 'Simulate', desc: 'Explore & discover', color: 'var(--color-simulate)' },
            ].map((item, idx) => {
              if (item === null) {
                return (
                  <div key={`arrow-${idx}`} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', margin: '0 2px', paddingBottom: '16px' }}>
                    →
                  </div>
                );
              }
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(13,11,38,0.85)',
                    border: `2px solid ${item.color}`,
                    boxShadow: `0 0 10px ${item.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    marginBottom: '5px',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontFamily: "'Fredoka One', Nunito, sans-serif",
                    fontSize: '12px',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '1px',
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--color-text-subtle)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Row 2: Play → Reflect (offset to the right to show flow) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '182px' }}>
            {[
              { icon: '🎮', label: 'Play', desc: 'Test your skills', color: 'var(--color-play)' },
              null,
              { icon: '📝', label: 'Reflect', desc: 'What did you learn?', color: 'var(--color-reflect)' },
            ].map((item, idx) => {
              if (item === null) {
                return (
                  <div key={`arrow2-${idx}`} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', margin: '0 2px', paddingBottom: '16px' }}>
                    →
                  </div>
                );
              }
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(13,11,38,0.85)',
                    border: `2px solid ${item.color}`,
                    boxShadow: `0 0 10px ${item.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    marginBottom: '5px',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontFamily: "'Fredoka One', Nunito, sans-serif",
                    fontSize: '12px',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '1px',
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--color-text-subtle)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
        <button
          type="button"
          onClick={onStart}
          className="btn-gold"
          style={{
            padding: '14px 48px',
            fontSize: 'clamp(15px, 2.2vh, 20px)',
            borderRadius: '50px',
            width: '100%',
            maxWidth: '340px',
            letterSpacing: '0.01em',
            boxShadow: '0 6px 24px rgba(250,204,21,0.35)',
          }}
        >
          🚀 {hasSavedSession ? 'Resume Journey' : 'Begin Your Journey!'}
        </button>

        {hasSavedSession && (
          <button
            type="button"
            onClick={onResetSession}
            className="btn-secondary"
            style={{ maxWidth: '200px', width: '100%', padding: '8px 0', fontSize: '13px', borderRadius: '50px' }}
          >
            Start Fresh ↺
          </button>
        )}
      </div>

      {/* Bottom 3 feature cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        width: '100%',
      }}>
        {[
          { icon: '🔢', label: 'Place Value', sub: 'H, T & O blocks', color: '#60a5fa' },
          { icon: '🧩', label: 'Simulations', sub: '3 interactive labs', color: '#4ade80' },
          { icon: '🏆', label: '10 Worlds', sub: 'XP, streaks & awards', color: 'var(--color-gold)' },
        ].map((f) => (
          <div key={f.label} style={{
            backgroundColor: 'rgba(30, 20, 70, 0.55)',
            border: '1.5px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: 'clamp(22px, 3.5vh, 30px)', filter: `drop-shadow(0 0 8px ${f.color}55)` }}>
              {f.icon}
            </div>
            <div style={{
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              fontSize: 'clamp(11px, 1.6vh, 13px)',
              fontWeight: 900,
              color: '#ffffff',
            }}>
              {f.label}
            </div>
            <div style={{
              fontSize: 'clamp(9px, 1.2vh, 11px)',
              color: 'var(--color-text-subtle)',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              {f.sub}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
