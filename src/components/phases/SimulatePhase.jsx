import { useMemo, useState } from 'react';
import Base10Station from './simulate/Base10Station';
import ColumnStation from './simulate/ColumnStation';
import InverseStation from './simulate/InverseStation';
import { simulateStationIntro } from '../../utils/narration';
import { usePageNarration } from '../../hooks/useAudio';
import { cleanupAudio } from '../../utils/audioManager';

export default function SimulatePhase({
  audioEnabled,
  simStationsComplete,
  onCompleteStation,
  onCompletePhase
}) {
  const [activeStation, setActiveStation] = useState(0);
  const segments = useMemo(() => simulateStationIntro(activeStation), [activeStation]);

  usePageNarration(audioEnabled, `simulate-station-${activeStation}`, segments);

  const handleStationChange = (stationId) => {
    cleanupAudio();
    setTimeout(() => setActiveStation(stationId), 50);
  };

  const handleCompleteStationInternal = () => {
    onCompleteStation(activeStation);
    if (activeStation < 2) {
      cleanupAudio();
      setTimeout(() => setActiveStation((prev) => prev + 1), 50);
    }
  };

  const handleCompletePhase = () => {
    cleanupAudio();
    setTimeout(() => onCompletePhase(), 50);
  };

  return (
    <div className="glass-card phase-screen phase-screen--wide" style={{ padding: 'var(--space-md)', overflow: 'hidden' }}>
      <div className="phase-band phase-band--simulate" style={{ marginBottom: 'var(--space-xs)' }} />

      <h2 className="text-section-heading" style={{ marginBottom: 'var(--space-xs)', fontSize: 'clamp(28px, 4.5vh, 46px)', fontWeight: 900 }}>
        🧪 Simulation Stations
      </h2>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 'var(--space-md)', flex: 1, overflow: 'hidden' }}>
        {/* Station Navigation Sidebar — Unlocked */}
        <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {[
            { id: 0, title: 'Station 1: Base-10', icon: '🧱' },
            { id: 1, title: 'Station 2: Column', icon: '📝' },
            { id: 2, title: 'Station 3: Inverse', icon: '🔄' }
          ].map((st) => {
            const isCompleted = simStationsComplete[st.id];
            const isActive = activeStation === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStationChange(st.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(12px, 2.2vh, 20px) clamp(14px, 2.4vh, 24px)',
                  borderRadius: '20px',
                  border: isActive ? '3px solid var(--color-simulate)' : '2px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 20, 60, 0.45)',
                  color: isActive ? '#FFFFFF' : '#e2e8f0',
                  fontWeight: 900,
                  fontSize: 'clamp(14px, 2.2vh, 18px)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 0 24px rgba(56, 189, 248, 0.45)' : 'none',
                  fontFamily: "'Fredoka One', Nunito, sans-serif"
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: 'clamp(22px, 3.5vh, 28px)' }}>{st.icon}</span>
                  <span>{st.title}</span>
                </div>
                <span style={{ fontSize: 'clamp(15px, 2.4vh, 19px)' }}>{isCompleted ? '✅' : '🔓'}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleCompletePhase}
            className="btn-gold"
            style={{ marginTop: 'auto', width: '100%', padding: '14px 20px', fontSize: 'clamp(15px, 2.3vh, 19px)', fontWeight: 900 }}
          >
            Go to Practice Phase! ➔
          </button>
        </div>

        {/* Station Content */}
        <div className="glass-panel glass-panel--inset" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 'var(--space-sm)' }}>
          {activeStation === 0 && (
            <Base10Station
              audioEnabled={audioEnabled}
              onCompleteStation={handleCompleteStationInternal}
            />
          )}
          {activeStation === 1 && (
            <ColumnStation
              audioEnabled={audioEnabled}
              onCompleteStation={handleCompleteStationInternal}
            />
          )}
          {activeStation === 2 && (
            <InverseStation
              audioEnabled={audioEnabled}
              onCompleteStation={handleCompleteStationInternal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
