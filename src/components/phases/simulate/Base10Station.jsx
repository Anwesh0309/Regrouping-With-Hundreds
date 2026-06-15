import { useState, useEffect } from 'react';
import Base10Block from '../../shared/Base10Block';
import { onesRegroupCelebration, regroupCelebration } from '../../../utils/narration';
import { useAudio } from '../../../hooks/useAudio';

export default function Base10Station({ audioEnabled, onCompleteStation }) {
  const { narrate } = useAudio(audioEnabled);
  const problems = [
    { type: 'add', opA: 158, opB: 274, ans: 432 },
    { type: 'add', opA: 247, opB: 165, ans: 412 },
    { type: 'sub', opA: 521, opB: 284, ans: 237 },
  ];

  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const problem = problems[currentProblemIdx];

  // State of blocks in the active sandbox
  const [blocks, setBlocks] = useState({ h: 0, t: 0, o: 0 });
  const [combined, setCombined] = useState(false);
  const [crossedOut, setCrossedOut] = useState({ h: 0, t: 0, o: 0 });
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Load problem — declared before useEffect so it's in scope
  const resetProblem = () => {
    setCombined(false);
    setFeedback('');
    setIsSuccess(false);
    setCrossedOut({ h: 0, t: 0, o: 0 });
    
    if (problem.type === 'add') {
      setBlocks({
        h: Math.floor(problem.opA / 100) + Math.floor(problem.opB / 100),
        t: Math.floor((problem.opA % 100) / 10) + Math.floor((problem.opB % 100) / 10),
        o: (problem.opA % 10) + (problem.opB % 10)
      });
    } else {
      setBlocks({
        h: Math.floor(problem.opA / 100),
        t: Math.floor((problem.opA % 100) / 10),
        o: problem.opA % 10
      });
      setCombined(true);
    }
  };

  // Load problem
  useEffect(() => {
    resetProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProblemIdx]);

  const handleCombine = () => {
    setCombined(true);
    setFeedback('Now merge and regroup if a column has more than 9 blocks!');
  };

  const handleRegroupOnes = () => {
    if (blocks.o >= 10) {
      setBlocks(prev => ({
        ...prev,
        o: prev.o - 10,
        t: prev.t + 1
      }));
      narrate(onesRegroupCelebration(), true, `base10-ones-regroup-p${currentProblemIdx}`);
      setFeedback('Regrouped 10 Ones into 1 Ten rod!');
    }
  };

  const handleRegroupTens = () => {
    if (blocks.t >= 10) {
      setBlocks(prev => ({
        ...prev,
        t: prev.t - 10,
        h: prev.h + 1
      }));
      narrate(regroupCelebration(), true, `base10-tens-regroup-p${currentProblemIdx}`);
      setFeedback('Regrouped 10 Tens into 1 Hundreds flat!');
    }
  };

  const handleBorrowTen = () => {
    if (blocks.t >= 1) {
      setBlocks(prev => ({
        ...prev,
        t: prev.t - 1,
        o: prev.o + 10
      }));
      setFeedback('Borrowed 1 Ten! Split it into 10 Ones cubes.');
    } else {
      setFeedback('Not enough Tens to borrow! Borrow a Hundred first.');
    }
  };

  const handleBorrowHundred = () => {
    if (blocks.h >= 1) {
      setBlocks(prev => ({
        ...prev,
        h: prev.h - 1,
        t: prev.t + 10
      }));
      setFeedback('Borrowed 1 Hundred! Split it into 10 Tens rods.');
    } else {
      setFeedback('No Hundreds left to borrow!');
    }
  };

  const handleToggleCrossOut = (col, index) => {
    if (problem.type === 'sub') {
      setCrossedOut(prev => {
        const currentCount = prev[col];
        if (index >= currentCount) {
          return { ...prev, [col]: index + 1 };
        } else {
          return { ...prev, [col]: index };
        }
      });
    }
  };

  const handleSubmit = () => {
    if (problem.type === 'add') {
      if (blocks.o > 9 || blocks.t > 9) {
        setFeedback('Oops! You still have 10 or more blocks in a column. Regroup them first!');
        return;
      }
      const total = blocks.h * 100 + blocks.t * 10 + blocks.o;
      if (total === problem.ans) {
        setIsSuccess(true);
        setFeedback('Correct! Well done! 🎉');
      } else {
        setFeedback('Calculated sum does not match correct answer. Try again.');
      }
    } else {
      const crossedH = crossedOut.h;
      const crossedT = crossedOut.t;
      const crossedO = crossedOut.o;

      const subH = Math.floor(problem.opB / 100);
      const subT = Math.floor((problem.opB % 100) / 10);
      const subO = problem.opB % 10;

      const remainingH = blocks.h - crossedH;
      const remainingT = blocks.t - crossedT;
      const remainingO = blocks.o - crossedO;

      // Validate no negatives
      if (remainingH < 0 || remainingT < 0 || remainingO < 0) {
        setFeedback('You crossed out more blocks than you have in a column!');
        return;
      }

      const remainingTotal = remainingH * 100 + remainingT * 10 + remainingO;

      if (remainingTotal === problem.ans) {
        setIsSuccess(true);
        setFeedback('Perfect! You subtracted correctly! 🎉');
      } else if (crossedH === subH && crossedT === subT && crossedO === subO) {
        setFeedback('Right blocks crossed out, but the remaining count is off. Check your borrowing!');
      } else {
        setFeedback(`Not quite. Cross out blocks that equal ${problem.opB} (${subH} Hundreds, ${subT} Tens, ${subO} Ones). Use Borrow buttons if needed, then cross out!`);
      }
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIdx < problems.length - 1) {
      setCurrentProblemIdx(prev => prev + 1);
    } else {
      onCompleteStation();
    }
  };

  const renderAddendsPreCombine = () => {
    const aH = Math.floor(problem.opA / 100);
    const aT = Math.floor((problem.opA % 100) / 10);
    const aO = problem.opA % 10;

    const bH = Math.floor(problem.opB / 100);
    const bT = Math.floor((problem.opB % 100) / 10);
    const bO = problem.opB % 10;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {/* Row 1 */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#60a5fa', fontSize: '14px', fontFamily: "'Fredoka One', Nunito, sans-serif" }}>Addend A: {problem.opA}</h4>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {Array.from({ length: aH }).map((_, i) => <Base10Block key={`a-h-${i}`} type="hundreds" size={26} />)}
            {Array.from({ length: aT }).map((_, i) => <Base10Block key={`a-t-${i}`} type="tens" size={26} />)}
            {Array.from({ length: aO }).map((_, i) => <Base10Block key={`a-o-${i}`} type="ones" size={26} />)}
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#60a5fa', fontSize: '14px', fontFamily: "'Fredoka One', Nunito, sans-serif" }}>Addend B: {problem.opB}</h4>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {Array.from({ length: bH }).map((_, i) => <Base10Block key={`b-h-${i}`} type="hundreds" size={26} />)}
            {Array.from({ length: bT }).map((_, i) => <Base10Block key={`b-t-${i}`} type="tens" size={26} />)}
            {Array.from({ length: bO }).map((_, i) => <Base10Block key={`b-o-${i}`} type="ones" size={26} />)}
          </div>
        </div>

        <button
          onClick={handleCombine}
          className="btn-gold"
          style={{
            padding: '10px 24px',
            fontSize: '15px',
            alignSelf: 'center'
          }}
        >
          Combine Blocks 📥
        </button>
      </div>
    );
  };

  const renderSandbox = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {/* Workspace columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr 1fr',
          gap: '8px',
          backgroundColor: 'rgba(13, 11, 38, 0.4)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '8px',
          height: 'clamp(130px, 22vh, 180px)'
        }}>
          {/* Hundreds Column */}
          <div style={{ borderRight: '1.5px dashed rgba(255, 255, 255, 0.12)', paddingRight: '4px', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ margin: '0 0 4px 0', color: '#60a5fa', textAlign: 'center', fontSize: '13px', fontFamily: "'Fredoka One', sans-serif" }}>Hundreds ({blocks.h})</h5>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', overflowY: 'auto', flex: 1, padding: '2px' }}>
              {Array.from({ length: blocks.h }).map((_, i) => {
                const isCrossed = i < crossedOut.h;
                return (
                  <Base10Block
                    key={`sb-h-${i}`}
                    type="hundreds"
                    size={28}
                    crossedOut={isCrossed}
                    onClick={() => handleToggleCrossOut('h', i)}
                  />
                );
              })}
            </div>
          </div>

          {/* Tens Column */}
          <div style={{ borderRight: '1.5px dashed rgba(255, 255, 255, 0.12)', paddingRight: '4px', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ margin: '0 0 4px 0', color: '#f97316', textAlign: 'center', fontSize: '13px', fontFamily: "'Fredoka One', sans-serif" }}>Tens ({blocks.t})</h5>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', overflowY: 'auto', flex: 1, padding: '2px' }}>
              {Array.from({ length: blocks.t }).map((_, i) => {
                const isCrossed = i < crossedOut.t;
                return (
                  <Base10Block
                    key={`sb-t-${i}`}
                    type="tens"
                    size={28}
                    crossedOut={isCrossed}
                    onClick={() => handleToggleCrossOut('t', i)}
                  />
                );
              })}
            </div>
          </div>

          {/* Ones Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ margin: '0 0 4px 0', color: '#4ade80', textAlign: 'center', fontSize: '13px', fontFamily: "'Fredoka One', sans-serif" }}>Ones ({blocks.o})</h5>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', overflowY: 'auto', flex: 1, padding: '2px' }}>
              {Array.from({ length: blocks.o }).map((_, i) => {
                const isCrossed = i < crossedOut.o;
                return (
                  <Base10Block
                    key={`sb-o-${i}`}
                    type="ones"
                    size={28}
                    crossedOut={isCrossed}
                    onClick={() => handleToggleCrossOut('o', i)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {problem.type === 'add' ? (
            <>
              {blocks.o >= 10 && (
                <button
                  onClick={handleRegroupOnes}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: "'Nunito', sans-serif",
                    transition: 'transform 0.15s',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  ⚡ Regroup 10 Ones
                </button>
              )}
              {blocks.t >= 10 && (
                <button
                  onClick={handleRegroupTens}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: "'Nunito', sans-serif",
                    transition: 'transform 0.15s',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                  }}
                >
                  ⚡ Regroup 10 Tens
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleBorrowTen}
                disabled={blocks.t < 1}
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: blocks.t < 1 ? 'not-allowed' : 'pointer',
                  opacity: blocks.t < 1 ? 0.5 : 1,
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: blocks.t < 1 ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.25)'
                }}
              >
                ✂️ Borrow Ten
              </button>
              <button
                onClick={handleBorrowHundred}
                disabled={blocks.h < 1}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: blocks.h < 1 ? 'not-allowed' : 'pointer',
                  opacity: blocks.h < 1 ? 0.5 : 1,
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: blocks.h < 1 ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.25)'
                }}
              >
                ✂️ Borrow Hundred
              </button>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSuccess}
            className="btn-gold"
            style={{
              padding: '8px 16px',
              fontSize: '13px'
            }}
          >
            Submit Answer ✓
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h3 className="text-learning-objective" style={{ margin: 0, fontSize: 'clamp(16px, 2.5vh, 22px)' }}>
            Station A: Base-10 Blocks
          </h3>
          <span className="text-body" style={{ fontSize: 'clamp(11px, 1.6vh, 14px)', color: 'var(--color-text-subtle)' }}>
            Problem {currentProblemIdx + 1} of {problems.length}
          </span>
        </div>

        <p className="text-body" style={{ margin: '0 0 var(--space-xs) 0', fontSize: 'var(--fs-body-text)' }}>
          Solve: <span className="text-gold">{problem.type === 'add' ? `${problem.opA} + ${problem.opB}` : `${problem.opA} – ${problem.opB}`}</span>
        </p>

        {problem.type === 'sub' && (
          <p className="text-body" style={{ margin: '0 0 var(--space-xs) 0', fontSize: '13px', color: '#94a3b8', lineHeight: 1.4 }}>
            💡 Use <strong style={{ color: '#f59e0b' }}>Borrow Ten</strong> or <strong style={{ color: '#3b82f6' }}>Borrow Hundred</strong> if needed, then <strong>click blocks to cross them out</strong> to subtract.
          </p>
        )}

        {/* Main workspace */}
        {!combined ? renderAddendsPreCombine() : renderSandbox()}
      </div>

      <div>
        {/* Feedback Banner */}
        {feedback && (
          <div style={{
            backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
            color: isSuccess ? '#34d399' : '#cbd5e1',
            padding: '8px 12px',
            borderRadius: '10px',
            marginTop: '8px',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '13px'
          }}>
            {feedback}
          </div>
        )}

        {isSuccess && (
          <button
            onClick={handleNextProblem}
            className="btn-gold"
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              marginTop: '8px',
              marginLeft: 'auto',
              display: 'block'
            }}
          >
            {currentProblemIdx < problems.length - 1 ? 'Next Problem ➔' : 'Complete Station A! 🎉'}
          </button>
        )}
      </div>
    </div>
  );
}
