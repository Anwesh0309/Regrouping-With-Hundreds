import { useState, useEffect } from 'react';
import ColumnLayout from '../../shared/ColumnLayout';
import { useAudio } from '../../../hooks/useAudio';
import { playFeedback } from '../../../utils/narration';

export default function ColumnStation({ audioEnabled, onCompleteStation }) {
  const { narrate } = useAudio(audioEnabled);
  const problems = [
    { type: 'add', opA: 486, opB: 248, ans: 734 },
    { type: 'sub', opA: 631, opB: 275, ans: 356 },
    { type: 'add', opA: 359, opB: 268, ans: 627 },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const problem = problems[currentIdx];

  // Guided step states
  const [step, setStep] = useState('');
  const [userDigits, setUserDigits] = useState({ h: '', t: '', o: '' });
  const [carryDigits, setCarryDigits] = useState({ h: 0, t: 0 });
  const [borrowedFrom, setBorrowedFrom] = useState({ h: false, t: false });
  const [borrowedTo, setBorrowedTo] = useState({ t: false, o: false });

  const [prompt, setPrompt] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState('');
  const [highlightCol, setHighlightCol] = useState(null);

  // resetProblem declared before useEffect to avoid hoisting issues
  const resetProblem = () => {
    setUserDigits({ h: '', t: '', o: '' });
    setCarryDigits({ h: 0, t: 0 });
    setBorrowedFrom({ h: false, t: false });
    setBorrowedTo({ t: false, o: false });
    setFeedback('');
    setInputVal('');

    if (problem.type === 'add') {
      setStep('ones_add');
      setPrompt('Step 1: Add the Ones. What is 6 + 8?');
      setHighlightCol('o');
    } else {
      setStep('ones_check');
      setPrompt('Step 1: Look at the Ones. Can we subtract 5 from 1?');
      setHighlightCol('o');
    }
  };

  useEffect(() => {
    resetProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  const handleNextProblem = () => {
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onCompleteStation();
    }
  };

  const handleAction = (ans) => {
    setFeedback('');
    
    // ADDITION FLOW
    if (problem.type === 'add') {
      if (step === 'ones_add') {
        const sum = (problem.opA % 10) + (problem.opB % 10);
        if (parseInt(ans) === sum % 10) {
          setUserDigits(prev => ({ ...prev, o: ans }));
          setStep('ones_carry');
          setPrompt(`Correct! 6 + 8 = ${sum}. That is 1 Ten and ${sum % 10} Ones. Let's carry 1 Ten to the Tens column.`);
          setInputVal('');
        } else {
          setFeedback('Not quite! Try adding the ones digits again.');
        }
      }
      else if (step === 'ones_carry') {
        setCarryDigits(prev => ({ ...prev, t: 1 }));
        setStep('tens_add');
        setPrompt('Now, add the Tens column including the carried 1: 8 + 4 + 1. What is the sum?');
        setHighlightCol('t');
      }
      else if (step === 'tens_add') {
        const carryIn = carryDigits.t;
        const digitA = Math.floor((problem.opA % 100) / 10);
        const digitB = Math.floor((problem.opB % 100) / 10);
        const sum = digitA + digitB + carryIn;
        if (parseInt(ans) === sum % 10) {
          setUserDigits(prev => ({ ...prev, t: ans }));
          setStep('tens_carry');
          setPrompt(`Nice! The sum is ${sum}. That is 1 Hundred and ${sum % 10} Tens. Let's carry 1 Hundred to the Hundreds column.`);
          setInputVal('');
        } else {
          setFeedback('Remember to add the carried 1 as well! Try again.');
        }
      }
      else if (step === 'tens_carry') {
        setCarryDigits(prev => ({ ...prev, h: 1 }));
        setStep('hundreds_add');
        setPrompt('Finally, add the Hundreds column including the carried 1: 4 + 2 + 1. What is the sum?');
        setHighlightCol('h');
      }
      else if (step === 'hundreds_add') {
        const carryIn = carryDigits.h;
        const digitA = Math.floor(problem.opA / 100);
        const digitB = Math.floor(problem.opB / 100);
        const sum = digitA + digitB + carryIn;
        if (parseInt(ans) === sum) {
          setUserDigits(prev => ({ ...prev, h: ans.toString() }));
          setStep('done');
          setPrompt(`Perfect! The final answer is ${problem.ans}.`);
          setHighlightCol(null);
          narrate(playFeedback(true), true, `column-station-done-p${currentIdx}`);
        } else {
          setFeedback('Add the Hundreds digits plus the carry of 1. Try again.');
        }
      }
    } 
    // SUBTRACTION FLOW
    else {
      if (step === 'ones_check') {
        const isNo = ans.toLowerCase().trim() === 'no';
        if (isNo) {
          setStep('ones_borrow');
          setPrompt('Correct! We cannot subtract 5 from 1. Tap the "Borrow" button to take 1 Ten from the Tens column.');
        } else {
          setFeedback('Wait, 1 is smaller than 5! We cannot subtract unless we borrow.');
        }
      }
      else if (step === 'ones_borrow') {
        setBorrowedFrom(prev => ({ ...prev, t: true }));
        setBorrowedTo(prev => ({ ...prev, o: true }));
        setStep('ones_sub');
        setPrompt('The Tens column becomes 2. The Ones column gains 10, making it 11. Now, what is 11 – 5?');
      }
      else if (step === 'ones_sub') {
        if (parseInt(ans) === 6) {
          setUserDigits(prev => ({ ...prev, o: '6' }));
          setStep('tens_check');
          setPrompt('Awesome! Next, look at the Tens column. We only have 2 Tens left. Can we subtract 7 from 2?');
          setHighlightCol('t');
          setInputVal('');
        } else {
          setFeedback('Subtract 5 from 11. Try again.');
        }
      }
      else if (step === 'tens_check') {
        const isNo = ans.toLowerCase().trim() === 'no';
        if (isNo) {
          setStep('tens_borrow');
          setPrompt('Correct! We cannot subtract 7 from 2. Tap the "Borrow" button to borrow 1 Hundred from the Hundreds column.');
        } else {
          setFeedback('2 is smaller than 7! We must borrow from the Hundreds column.');
        }
      }
      else if (step === 'tens_borrow') {
        setBorrowedFrom(prev => ({ ...prev, h: true }));
        setBorrowedTo(prev => ({ ...prev, t: true }));
        setStep('tens_sub');
        setPrompt('The Hundreds column becomes 5. The Tens column gains 10, making it 12. Now, what is 12 – 7?');
      }
      else if (step === 'tens_sub') {
        if (parseInt(ans) === 5) {
          setUserDigits(prev => ({ ...prev, t: '5' }));
          setStep('hundreds_sub');
          setPrompt('Great! Finally, subtract the Hundreds: we have 5 Hundreds left. What is 5 – 2?');
          setHighlightCol('h');
          setInputVal('');
        } else {
          setFeedback('Subtract 7 from 12. Try again.');
        }
      }
      else if (step === 'hundreds_sub') {
        if (parseInt(ans) === 3) {
          setUserDigits(prev => ({ ...prev, h: '3' }));
          setStep('done');
          setPrompt(`Excellent! The final answer is ${problem.ans}.`);
          setHighlightCol(null);
          narrate(playFeedback(true), true, `column-station-done-p${currentIdx}`);
        } else {
          setFeedback('Subtract 2 from 5. Try again.');
        }
      }
    }
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
          <h3 style={{ margin: 0, color: '#ffffff', fontFamily: "'Fredoka One', Nunito, sans-serif", fontSize: 'clamp(16px, 2.5vh, 22px)' }}>
            Station B: Guided Column Method
          </h3>
          <span style={{ fontWeight: 'bold', color: '#94a3b8', fontSize: 'clamp(11px, 1.6vh, 14px)' }}>
            Problem {currentIdx + 1} of {problems.length}
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '4px'
        }}>
          {/* Column Layout */}
          <ColumnLayout
            operandA={problem.opA}
            operandB={problem.opB}
            mode={problem.type}
            userDigits={userDigits}
            carryDigits={carryDigits}
            borrowedFrom={borrowedFrom}
            borrowedTo={borrowedTo}
            highlightCol={highlightCol}
            missingDigits={{ h: false, t: false, o: false }}
          />

          {/* Guided prompt panel */}
          <div style={{
            flex: 1,
            minWidth: '220px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            padding: '12px',
            borderRadius: '16px',
            borderLeft: '4px solid var(--color-simulate)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <p style={{
              fontSize: 'clamp(12px, 1.8vh, 15px)',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 10px 0',
              lineHeight: '1.4'
            }}>
              {prompt}
            </p>

            {/* Interactive fields depending on step */}
            {step === 'ones_check' || step === 'tens_check' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleAction('no')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#ef4444',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  No ❌
                </button>
                <button
                  onClick={() => handleAction('yes')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#10b981',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Yes ✓
                </button>
              </div>
            ) : step === 'ones_carry' || step === 'tens_carry' ? (
              <button
                onClick={() => handleAction('carry')}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  fontSize: '13px'
                }}
              >
                Carry 1 Ten ➔
              </button>
            ) : step === 'ones_borrow' || step === 'tens_borrow' ? (
              <button
                onClick={() => handleAction('borrow')}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  fontSize: '13px'
                }}
              >
                Borrow ➔
              </button>
            ) : step === 'done' ? (
              <div style={{
                color: '#34d399',
                fontSize: '15px',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '6px',
                textShadow: '0 0 10px rgba(52, 211, 153, 0.2)'
              }}>
                Amazing work! 🎉
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAction(inputVal);
                  }}
                  style={{
                    width: '60px',
                    padding: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                  placeholder="?"
                />
                <button
                  onClick={() => handleAction(inputVal)}
                  className="btn-gold"
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px'
                  }}
                >
                  Submit
                </button>
              </div>
            )}

            {feedback && (
              <div style={{
                color: '#f87171',
                fontSize: '12px',
                fontWeight: 'bold',
                marginTop: '6px'
              }}>
                ⚠️ {feedback}
              </div>
            )}
          </div>
        </div>
      </div>

      {step === 'done' && (
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
          {currentIdx < problems.length - 1 ? 'Next Problem ➔' : 'Complete Station B! 🎉'}
        </button>
      )}
    </div>
  );
}
