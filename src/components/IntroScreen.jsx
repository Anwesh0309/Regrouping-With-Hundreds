import Mascot from './shared/Mascot';

export default function IntroScreen({ onStart }) {
  // Background floating numbers matching screenshot
  const bgNumbers = [
    { num: '54', top: '8%', left: '8%', size: '32px' },
    { num: '91', top: '5%', left: '22%', size: '44px' },
    { num: '11', top: '8%', left: '25%', size: '22px' },
    { num: '66', top: '6%', left: '27%', size: '30px' },
    { num: '90', top: '4%', left: '35%', size: '28px' },
    { num: '64', top: '4%', left: '52%', size: '32px' },
    { num: '30', top: '6%', left: '66%', size: '30px' },
    { num: '69', top: '4%', left: '69%', size: '22px' },
    { num: '90', top: '8%', left: '91%', size: '48px' },
  ];

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: '100%',
      width: '100%',
      padding: '0 16px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* Background floating numbers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}>
        {bgNumbers.map((b, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              fontSize: b.size,
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 0.07)',
              userSelect: 'none',
            }}
          >
            {b.num}
          </span>
        ))}

        {/* Top right close icon button */}
        <button
          type="button"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#0284c7',
            border: 'none',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
            pointerEvents: 'auto',
          }}
        >
          ✕
        </button>
      </div>

      {/* Main Content (Z-Index 1 above floating numbers) */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
      }}>

        {/* Top Curriculum Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50px',
          padding: '6px 22px',
          fontSize: 'clamp(14px, 2vh, 18px)',
          fontWeight: 900,
          color: '#ffffff',
          fontFamily: "'Nunito', sans-serif",
          flexShrink: 0,
        }}>
          <span>✨</span>
          <span> MOE Curriculum · Grade 2</span>
        </div>

        {/* Main Title */}
        <h1 style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          fontSize: 'clamp(38px, 6.5vh, 56px)',
          fontWeight: 900,
          color: '#ffffff',
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.12,
          letterSpacing: '0.01em',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          flexShrink: 0,
        }}>
          Regrouping with{' '}
          <span style={{ color: '#fbbf24', textShadow: '0 0 24px rgba(251,191,36,0.5)' }}>
            Hundreds
          </span>
        </h1>

        {/* Mascot Avatar & Speech Bubble */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          flexShrink: 0,
        }}>
          {/* Circular Mascot Frame */}
          <div style={{
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 4px 18px rgba(251, 191, 36, 0.45)',
            border: '3px solid #ffffff',
            flexShrink: 0,
          }}>
            🦁
          </div>

          {/* White Speech Bubble */}
          <div style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            borderRadius: '18px',
            padding: '10px 22px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: 'clamp(15px, 2.2vh, 19px)',
            fontWeight: 900,
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          }}>
            Ready for a number adventure? 🎉
          </div>
        </div>

        {/* Sub-description Paragraph */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 'clamp(15px, 2.2vh, 18px)',
          fontWeight: 800,
          color: '#f8fafc',
          textAlign: 'center',
          margin: 0,
          maxWidth: '620px',
          lineHeight: 1.45,
          flexShrink: 0,
        }}>
          Join Leo on a journey to add and subtract 3-digit numbers with regrouping
          through stories, simulations, and fun practice challenges!
        </p>

        {/* YOUR LEARNING JOURNEY Glass Card */}
        <div style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'rgba(30, 20, 60, 0.55)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: 'clamp(12px, 1.8vh, 18px) clamp(16px, 2.2vh, 24px)',
          boxSizing: 'border-box',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
          flexShrink: 0,
        }}>
          <p style={{
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: 'clamp(13px, 1.8vh, 15px)',
            fontWeight: 900,
            color: '#fbbf24',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: '0 0 10px 0',
          }}>
            YOUR LEARNING JOURNEY
          </p>

          {/* Journey Steps Diagram */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
          }}>
            {/* Row 1: Wonder → Story → Simulate */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
            }}>
              {/* Wonder */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(192, 132, 252, 0.25)',
                  border: '2px solid #c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  🔍
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: "'Fredoka One'", fontSize: 'clamp(14px, 2vh, 16px)', color: '#ffffff', fontWeight: 900 }}>Wonder</span>
                  <span style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#cbd5e1', fontWeight: 800 }}>Spark curiosity</span>
                </div>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, fontSize: '16px' }}>→</span>

              {/* Story */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(251, 146, 60, 0.25)',
                  border: '2px solid #fb923c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  📖
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: "'Fredoka One'", fontSize: 'clamp(14px, 2vh, 16px)', color: '#ffffff', fontWeight: 900 }}>Story</span>
                  <span style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#cbd5e1', fontWeight: 800 }}>Hear the tale</span>
                </div>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, fontSize: '16px' }}>→</span>

              {/* Simulate */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(56, 189, 248, 0.25)',
                  border: '2px solid #38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  🧪
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: "'Fredoka One'", fontSize: 'clamp(14px, 2vh, 16px)', color: '#ffffff', fontWeight: 900 }}>Simulate</span>
                  <span style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#cbd5e1', fontWeight: 800 }}>Explore & discover</span>
                </div>
              </div>
            </div>

            {/* Row 2: Practice → Reflect */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
            }}>
              {/* Practice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(74, 222, 128, 0.25)',
                  border: '2px solid #4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  🎮
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: "'Fredoka One'", fontSize: 'clamp(14px, 2vh, 16px)', color: '#ffffff', fontWeight: 900 }}>Practice</span>
                  <span style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#cbd5e1', fontWeight: 800 }}>Test your skills</span>
                </div>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, fontSize: '16px' }}>→</span>

              {/* Reflect */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(129, 140, 248, 0.25)',
                  border: '2px solid #818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  📋
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: "'Fredoka One'", fontSize: 'clamp(14px, 2vh, 16px)', color: '#ffffff', fontWeight: 900 }}>Reflect</span>
                  <span style={{ fontSize: 'clamp(11px, 1.5vh, 12px)', color: '#cbd5e1', fontWeight: 800 }}>What did you learn?</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onStart}
          style={{
            padding: '14px 48px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            border: 'none',
            color: '#0f172a',
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: 'clamp(18px, 2.6vh, 22px)',
            fontWeight: 900,
            boxShadow: '0 6px 24px rgba(245, 158, 11, 0.55)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, boxShadow 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.75)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(245, 158, 11, 0.55)';
          }}
        >
          🚀 Begin Your Journey!
        </button>

        {/* Bottom 3 Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          width: '100%',
          maxWidth: '600px',
          flexShrink: 0,
        }}>
          {[
            { icon: '🔢', label: 'Place Value', sub: 'H, T & O blocks' },
            { icon: '🧱', label: 'Simulations', sub: 'Interactive labs' },
            { icon: '🏆', label: '10 Game Worlds', sub: 'XP & awards' },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(30, 20, 60, 0.5)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '24px' }}>{f.icon}</div>
              <div style={{
                fontFamily: "'Fredoka One', Nunito, sans-serif",
                fontSize: 'clamp(13px, 1.9vh, 15px)',
                fontWeight: 900,
                color: '#ffffff',
              }}>
                {f.label}
              </div>
              <div style={{
                fontSize: 'clamp(11px, 1.5vh, 12px)',
                color: '#cbd5e1',
                fontWeight: 800,
              }}>
                {f.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
