import { useState, useEffect } from 'react';
import ColumnLayout from '../../shared/ColumnLayout';
import { useAudio } from '../../../hooks/useAudio';
import { playFeedback } from '../../../utils/narration';

export default function InverseStation({ audioEnabled, onCompleteStation }) {
  const { narrate } = useAudio(audioEnabled);
  const problems = [
    {
      id: 1,
      type: 'add',
      opA: 472,
      opB: 258,
      ans: 730,
      checkType: 'sub',
      checkOpA: 730,
      checkOpB: 258,
      checkAns: 472,
      missing: 'ans',
      prompt: 'Check your addition (472 + 258 = 730) using subtraction! What should the result of 730 – 258 be?'
    },
    {
      id: 2,
      type: 'sub',
      opA: 825,
      opB: 476,
      ans: 349,
      checkType: 'add',
      checkOpA: 349,
      checkOpB: 476,
      checkAns: 825,
      missing: 'ans',
      prompt: 'Check your subtraction (825 – 476 = 349) using addition! What should the result of 349 + 476 be?'
    },
    {
      id: 3,
      type: 'add',
      opA: 364,
      opB: 275,
      ans: 639,
      checkType: 'sub',
      checkOpA: 639,
      checkOpB: 275,
      checkAns: 364,
      missing: 'ans',
      prompt: 'Check your addition (364 + 275 = 639) using subtraction! What should the result of 639 – 275 be?'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const problem = problems[currentIdx];

  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Reset state when problem index changes — intentional init pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFeedback('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSuccess(false);
  }, [currentIdx]);

  const handleSubmit = () => {
    const val = parseInt(inputValue);
    const expected = problem.checkAns;
    
    if (val === expected) {
      setIsSuccess(true);
      setFeedback(`Perfect! The inverse operation holds true: ${problem.checkOpA} ${problem.checkType === 'add' ? '+' : '–'} ${problem.checkOpB} = ${problem.checkAns}!`);
      narrate(playFeedback(true), true, `inverse-station-done-p${currentIdx}`);
    } else {
      setFeedback('Not quite. If the primary sum is correct, the inverse operation should give back the original start number!');
    }
  };

  const handleNext = () => {
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onCompleteStation();
    }
  };

  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0, color: '#ffffff', fontFamily: "'Fredoka One', Nunito, sans-serif", fontSize: '20px' }}>
          Station C: Algorithm & Inverse Check
        </h3>
        <span style={{ fontWeight: 'bold', color: '#94a3b8', fontSize: '13px' }}>
          Problem {currentIdx + 1} of {problems.length}
        </span>
      </div>

      <p style={{
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#cbd5e1',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 16px',
        borderRadius: '12px',
        lineHeight: '1.4'
      }}>
        {problem.prompt}
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: '12px',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '8px 0'
      }}>
        {/* Left Side: Solved Primary */}
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#60a5fa', fontFamily: "'Fredoka One', Nunito, sans-serif", fontSize: '13px' }}>Primary Sum</h4>
          <ColumnLayout
            operandA={problem.opA}
            operandB={problem.opB}
            mode={problem.type}
            showAnswer={true}
            answer={problem.ans}
            missingDigits={{ h: false, t: false, o: false }}
          />
        </div>

        {/* Arrow symbol */}
        <div style={{ fontSize: 'clamp(20px, 3vh, 32px)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}>🔄</div>

        {/* Right Side: Inverse Check */}
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-wonder)', fontFamily: "'Fredoka One', Nunito, sans-serif", fontSize: '13px' }}>Inverse Check</h4>
          <ColumnLayout
            operandA={problem.checkOpA}
            operandB={problem.checkOpB}
            mode={problem.checkType}
            showAnswer={isSuccess}
            answer={problem.checkAns}
            userDigits={{
              h: isSuccess ? '' : '?',
              t: isSuccess ? '' : '?',
              o: isSuccess ? '' : '?'
            }}
            missingDigits={{ h: false, t: false, o: false }}
          />
        </div>
      </div>

      <div style={{
        maxWidth: '280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ''))}
            disabled={isSuccess}
            placeholder="Check answer"
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: '#ffffff',
              outline: 'none',
              textAlign: 'center'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isSuccess}
            className="btn-gold"
            style={{
              padding: '8px 16px',
              fontSize: '13px'
            }}
          >
            Check
          </button>
        </div>

        {feedback && (
          <div style={{
            backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: isSuccess ? '#34d399' : '#f87171',
            padding: '8px',
            borderRadius: '10px',
            width: '100%',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 'bold'
          }}>
            {feedback}
          </div>
        )}
      </div>

      {isSuccess && (
        <button
          onClick={handleNext}
          className="btn-gold"
          style={{
            padding: '10px 24px',
            fontSize: '14px',
            marginTop: '8px',
            marginLeft: 'auto',
            display: 'block'
          }}
        >
          {currentIdx < problems.length - 1 ? 'Next Problem ➔' : 'Complete Station C! 🎉'}
        </button>
      )}
    </div>
  );
}
