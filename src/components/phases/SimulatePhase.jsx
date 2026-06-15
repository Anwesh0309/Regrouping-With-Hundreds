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

  const allComplete = simStationsComplete.every(Boolean);

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
    <div className="glass-card phase-screen phase-screen--wide" style={{ padding: 'var(--space-md)' }}>
      <div className="phase-band phase-band--simulate" style={{ marginBottom: 'var(--space-xs)' }} />

      <h2 className="text-section-heading" style={{ marginBottom: 'var(--space-xs)' }}>
        Simulation Stations
      </h2>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 'var(--space-md)', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: '0 0 230px', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {[
            { id: 0, title: 'A: Base-10 Sandbox', icon: '🧱' },
            { id: 1, title: 'B: Guided Column', icon: '📝' },
            { id: 2, title: 'C: Inverse Check', icon: '🔄' }
          ].map((st) => {
            const isCompleted = simStationsComplete[st.id];
            const isActive = activeStation === st.id;
            return (
              <button
                key={st.id}
                onClick={() => handleStationChange(st.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(8px, 1.8vh, 16px) clamp(12px, 2vh, 20px)',
                  borderRadius: '20px',
                  border: isActive ? '3px solid var(--color-simulate)' : '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(30, 20, 60, 0.35)',
                  color: isActive ? '#FFFFFF' : '#cbd5e1',
                  fontWeight: 900,
                  fontSize: 'clamp(11px, 1.8vh, 15px)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
                  fontFamily: "'Fredoka One', Nunito, sans-serif"
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: 'clamp(18px, 3vh, 24px)' }}>{st.icon}</span>
                  <span>{st.title.split(': ')[0]}</span>
                </div>
                <span style={{ fontSize: 'clamp(14px, 2.2vh, 18px)' }}>{isCompleted ? '✅' : '⏳'}</span>
              </button>
            );
          })}

          {allComplete && (
            <button
              onClick={handleCompletePhase}
              className="btn-gold"
              style={{ marginTop: 'var(--space-xs)', width: '100%', padding: '10px 16px', fontSize: 'var(--fs-button-text)' }}
            >
              Go to Play Phase! ➔
            </button>
          )}
        </div>

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
