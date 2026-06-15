import { useState, useEffect } from 'react';
import { QUESTION_BANK } from '../../data/questionBank';
import { shuffleArray } from '../../utils/shuffle';
import { calcXP, calcStars } from '../../utils/scoring';
import { checkBadges } from '../../utils/badgeEngine';
import ColumnLayout from '../shared/ColumnLayout';
import FeedbackOverlay from '../shared/FeedbackOverlay';
import Mascot from '../shared/Mascot';
import { playFeedback, hintNarration } from '../../utils/narration';
import { useAudio } from '../../hooks/useAudio';
import { cleanupAudio } from '../../utils/audioManager';

export default function PlayPhase({ audioEnabled, gameState, setGameState, onCompletePhase }) {
  const { narrate } = useAudio(audioEnabled);

  const [mode, setMode] = useState('map'); // 'map' | 'arena' | 'summary'
  const [activeWorld, setActiveWorld] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [userDigits, setUserDigits] = useState({ h: '', t: '', o: '' });
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);

  const worldNames = [
    'Addition — No Regroup',
    'Addition — Regroup Ones',
    'Addition — Regroup Tens',
    'Addition — Double Regroup',
    'Subtraction — No Borrow',
    'Subtraction — Borrow Tens',
    'Subtraction — Double Borrow',
    'Subtraction — Borrow Hundreds',
    'Word Problems',
    'Mixed & Inverse',
  ];

  const currentQuestion = questions[currentQIdx];

  // Narrate question when it loads
  useEffect(() => {
    if (currentQuestion && audioEnabled && mode === 'arena') {
      narrate([{ text: currentQuestion.questionText, style: 'question' }], true, `play-q-${currentQuestion.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQIdx, mode]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const enterWorld = (worldId) => {
    cleanupAudio();
    const filtered = QUESTION_BANK.filter((q) => q.world === worldId);
    // Shuffle questions, pick up to 10
    const selected = shuffleArray(filtered).slice(0, 10).map((q) => {
      // Skip shuffling for true_false and mixed_challenge (only 2 options, order matters for UI)
      if (!q.options || q.options.length <= 2) return q;
      // Shuffle the options array so correct answer isn't always in position B or C
      return { ...q, options: shuffleArray(q.options) };
    });
    setQuestions(selected);
    setCurrentQIdx(0);
    setActiveWorld(worldId);
    setCorrectCount(0);
    setXpGained(0);
    setHintsUsed(0);
    setShowHint(false);
    setUserDigits({ h: '', t: '', o: '' });
    setQuestionResults([]);
    setTimeout(() => setMode('arena'), 50);
  };

  const handleUseHint = () => {
    if (!currentQuestion) return;
    setShowHint(true);
    setHintsUsed((prev) => prev + 1);
    narrate(hintNarration(hintsUsed + 1), true, `play-hint-${currentQuestion.id}`);
  };

  const handleMCQSubmit  = (option) => validateAnswer(option);
  const handleColumnSubmit = () => {
    const ansNum = parseInt(`${userDigits.h || '0'}${userDigits.t || '0'}${userDigits.o || '0'}`);
    validateAnswer(ansNum);
  };

  const validateAnswer = (rawVal) => {
    if (!currentQuestion) return;

    let isCorrect = false;
    if (currentQuestion.type === 'true_false') {
      // options "True"/"False", correctAnswer is 1 (True) or 0 (False)
      const userNorm = rawVal === 'True' ? 1 : rawVal === 'False' ? 0 : Number(rawVal);
      isCorrect = userNorm === Number(currentQuestion.correctAnswer);
    } else if (currentQuestion.type === 'mixed_challenge') {
      // options "+" / "–", correctStr holds the right answer
      isCorrect = rawVal === currentQuestion.correctStr;
    } else {
      isCorrect = Number(rawVal) === Number(currentQuestion.correctAnswer);
    }

    // Record result for summary scoreboard
    setQuestionResults((prev) => [
      ...prev,
      {
        idx: currentQIdx,
        questionText: currentQuestion.questionText,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: rawVal,
        correct: isCorrect,
      },
    ]);

    if (isCorrect) {
      const xp = calcXP(1, hintsUsed, gameState.streak + 1);
      setXpGained((prev) => prev + xp);
      setCorrectCount((prev) => prev + 1);
      const newStreak = gameState.streak + 1;
      setGameState((prev) => {
        const next = {
          ...prev,
          xp: prev.xp + xp,
          streak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
        };
        const nb = checkBadges(next);
        if (nb.length) next.badges = [...next.badges, ...nb];
        return next;
      });
      narrate(playFeedback(true, currentQuestion.regroupType === 'double', newStreak >= 5), true, `play-fb-${currentQuestion.id}-ok`);
      setFeedbackCorrect(true);
      const displayCorrect = currentQuestion.type === 'true_false'
        ? (currentQuestion.correctAnswer === 1 ? 'True' : 'False')
        : currentQuestion.type === 'mixed_challenge'
          ? currentQuestion.correctStr
          : currentQuestion.correctAnswer;
      setFeedbackMsg(`Correct! The answer is ${displayCorrect}.`);
    } else {
      // TEST MODE — wrong answer: show popup with correct answer, then move on
      setGameState((prev) => ({ ...prev, streak: 0 }));
      const displayCorrect = currentQuestion.type === 'true_false'
        ? (currentQuestion.correctAnswer === 1 ? 'True' : 'False')
        : currentQuestion.type === 'mixed_challenge'
          ? currentQuestion.correctStr
          : currentQuestion.correctAnswer;
      setFeedbackCorrect(false);
      setFeedbackMsg(`The correct answer is ${displayCorrect}.`);
    }

    setFeedbackVisible(true);
  };

  // Both correct AND incorrect popups advance to next question (test mode)
  const handleOverlayContinue = () => {
    cleanupAudio();
    setFeedbackVisible(false);
    setShowHint(false);
    setHintsUsed(0);
    setUserDigits({ h: '', t: '', o: '' });
    setTimeout(() => {
      if (currentQIdx < questions.length - 1) {
        setCurrentQIdx((prev) => prev + 1);
      } else {
        handleFinishWorld();
      }
    }, 50);
  };

  const handleFinishWorld = () => {
    const stars = calcStars(correctCount);
    setGameState((prev) => {
      const updatedScores = [...prev.worldScores];
      updatedScores[activeWorld] = Math.max(updatedScores[activeWorld] ?? 0, correctCount);
      const updatedStars = [...prev.worldStars];
      updatedStars[activeWorld] = Math.max(updatedStars[activeWorld] ?? 0, stars);
      const next = { ...prev, worldScores: updatedScores, worldStars: updatedStars };
      const nb = checkBadges(next);
      if (nb.length) next.badges = [...next.badges, ...nb];
      return next;
    });
    setMode('summary');
  };

  // Reflect button only shows when ALL 10 worlds have been played at least once
  const allWorldsComplete = gameState.worldScores.every((s) => s !== null);

  /* ── WORLD MAP ────────────────────────────────────────── */
  const renderWorldMap = () => {
    const totalStars = gameState.worldStars.reduce((sum, s) => sum + (s || 0), 0);

    return (
      <div style={{ padding: '0 var(--space-xs)' }}>
        <h3 style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", color: '#fff', fontSize: 'var(--fs-section-heading)', margin: '0 0 var(--space-xs) 0', textAlign: 'center' }}>
          Adventure Map
        </h3>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'space-around', background: 'rgba(30,20,60,0.4)', border: '2px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '16px', marginBottom: 'var(--space-xs)', fontWeight: 900, color: '#fff', fontSize: 'clamp(12px,1.8vh,15px)', fontFamily: "'Fredoka One', Nunito, sans-serif" }}>
          <span>✨ XP: {gameState.xp}</span>
          <span>⭐ Stars: {totalStars}</span>
          <span>🔥 Streak: {gameState.streak}</span>
        </div>

        {/* World grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(6px,1.2vh,10px)', margin: 'var(--space-xs) 0' }}>
          {Array.from({ length: 10 }).map((_, wId) => {
            const stars = gameState.worldStars[wId] || 0;
            const isUnlocked = wId === 0 || (gameState.worldStars[wId - 1] !== null && gameState.worldStars[wId - 1] >= 1);
            return (
              <button
                key={wId}
                disabled={!isUnlocked}
                onClick={() => enterWorld(wId)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: 'clamp(6px,1.4vh,10px) 4px', borderRadius: '16px',
                  border: isUnlocked ? '2px solid var(--color-play)' : '2px dashed rgba(255,255,255,0.1)',
                  backgroundColor: isUnlocked ? 'rgba(74,222,128,0.14)' : 'rgba(30,20,60,0.25)',
                  color: isUnlocked ? '#fff' : '#94a3b8',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: isUnlocked ? '0 0 10px rgba(74,222,128,0.18)' : 'none',
                }}
                onMouseEnter={(e) => { if (isUnlocked) { e.currentTarget.style.transform = 'scale(1.04) translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(74,222,128,0.4)'; }}}
                onMouseLeave={(e) => { if (isUnlocked) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 10px rgba(74,222,128,0.18)'; }}}
              >
                <div style={{ width: 'clamp(26px,4vh,36px)', height: 'clamp(26px,4vh,36px)', borderRadius: '50%', backgroundColor: isUnlocked ? 'var(--color-play)' : 'rgba(255,255,255,0.1)', color: '#0c0424', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: 'clamp(11px,1.6vh,14px)', marginBottom: '4px', fontFamily: "'Fredoka One', Nunito, sans-serif" }}>
                  {wId + 1}
                </div>
                <div style={{ fontSize: 'clamp(9px,1.2vh,11px)', fontWeight: 900, lineHeight: 1.2, textAlign: 'center', color: isUnlocked ? '#fff' : '#cbd5e1', fontFamily: "'Fredoka One', Nunito, sans-serif", overflow: 'hidden', maxWidth: '100%', padding: '0 2px' }}>
                  {worldNames[wId].split(' — ')[1] || worldNames[wId]}
                </div>
                <div style={{ fontSize: 'clamp(10px,1.4vh,13px)', marginTop: '3px' }}>
                  {isUnlocked ? ('⭐'.repeat(stars) || '⏳') : '🔒'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue to Reflect — only shown after ALL 10 worlds played */}
        {allWorldsComplete ? (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-xs)' }}>
            <button
              onClick={onCompletePhase}
              className="btn-gold"
              style={{ padding: '12px 32px', fontSize: '16px', borderRadius: '50px' }}
            >
              Continue to Reflection ➔
            </button>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '8px', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            Complete all 10 worlds to unlock Reflection
          </p>
        )}
      </div>
    );
  };

  /* ── PLAY ARENA ───────────────────────────────────────── */
  const renderPlayArena = () => {
    if (!currentQuestion) return null;

    const isMCQ       = currentQuestion.options && currentQuestion.options.length > 0;
    const isTrueFalse = currentQuestion.type === 'true_false';
    const isMixed     = currentQuestion.type === 'mixed_challenge';
    const isBigTwo    = isTrueFalse || isMixed; // 2-option full-width buttons
    const hintText    = hintsUsed === 0 ? currentQuestion.hint1 : (currentQuestion.hint2 || currentQuestion.hint1);

    // For true/false questions show 2 big buttons instead of the normal MCQ grid
    const renderAnswerArea = () => {
      if (isTrueFalse) {
        return (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '4px 0' }}>
            {['True', 'False'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleMCQSubmit(opt)}
                style={{
                  padding: '14px 40px',
                  fontSize: 'clamp(16px,2.2vh,22px)',
                  fontWeight: 900,
                  borderRadius: '18px',
                  border: `3px solid ${opt === 'True' ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'}`,
                  backgroundColor: opt === 'True' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: "'Fredoka One', Nunito, sans-serif",
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.opacity = '1'; }}
              >
                {opt === 'True' ? '✅ True' : '❌ False'}
              </button>
            ))}
          </div>
        );
      }

      if (isMixed) {
        return (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '4px 0' }}>
            {['+', '–'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleMCQSubmit(opt)}
                style={{
                  padding: '14px 48px',
                  fontSize: 'clamp(22px,3vh,30px)',
                  fontWeight: 900,
                  borderRadius: '18px',
                  border: `3px solid ${opt === '+' ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'}`,
                  backgroundColor: opt === '+' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: "'Fredoka One', Nunito, sans-serif",
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.opacity = '1'; }}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      }

      if (isMCQ) {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleMCQSubmit(option)}
                style={{ padding: 'clamp(8px,1.6vh,14px) 6px', fontSize: 'clamp(15px,2vh,19px)', fontWeight: 900, borderRadius: '14px', border: '2px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(30,20,60,0.5)', color: '#fff', cursor: 'pointer', transition: 'all 0.18s ease', fontFamily: "'Fredoka One', Nunito, sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-play)'; e.currentTarget.style.backgroundColor = 'rgba(74,222,128,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.backgroundColor = 'rgba(30,20,60,0.5)'; e.currentTarget.style.transform = 'none'; }}
              >
                {option}
              </button>
            ))}
          </div>
        );
      }

      // Column input
      return (
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleColumnSubmit} className="btn-gold" style={{ padding: '10px 28px', fontSize: '15px' }}>
            Submit Answer ✓
          </button>
        </div>
      );
    };

    return (
      <div style={{ padding: '0 var(--space-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>

        {/* Arena header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
          <button onClick={() => { cleanupAudio(); setMode('map'); }} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '13px', borderRadius: '14px' }}>
            ◀ Map
          </button>
          <span style={{ fontWeight: 900, color: '#cbd5e1', fontSize: '14px', fontFamily: "'Fredoka One', Nunito, sans-serif" }}>
            Q {currentQIdx + 1} / {questions.length}
          </span>
          <div style={{ display: 'flex', gap: '10px', fontFamily: "'Fredoka One', Nunito, sans-serif", fontSize: '14px' }}>
            <span style={{ color: 'var(--color-story)' }}>🔥 {gameState.streak}</span>
            <span style={{ color: 'var(--color-play)' }}>✨ {xpGained} XP</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((currentQIdx) / questions.length) * 100}%`, background: 'var(--color-play)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
        </div>

        {/* Question text */}
        <p style={{ fontSize: 'clamp(14px,2vh,18px)', fontWeight: 900, color: '#fff', margin: 0, textAlign: 'center', lineHeight: 1.4, fontFamily: "'Fredoka One', Nunito, sans-serif" }}>
          {currentQuestion.questionText}
        </p>

        {/* Column diagram — only for column-type questions, not true/false or mixed */}
        {!isBigTwo && currentQuestion.operandA !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ColumnLayout
              operandA={currentQuestion.operandA}
              operandB={currentQuestion.operandB}
              mode={currentQuestion.operation}
              userDigits={isMCQ ? { h: '', t: '', o: '' } : userDigits}
              onDigitInput={isMCQ ? null : (col, val) => setUserDigits((prev) => ({ ...prev, [col]: val }))}
              missingDigits={isMCQ ? { h: false, t: false, o: false } : { h: !userDigits.h, t: !userDigits.t, o: !userDigits.o }}
            />
          </div>
        )}

        {/* Answer area */}
        {renderAnswerArea()}

        {/* Hint */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleUseHint}
            style={{ backgroundColor: 'rgba(99,102,241,0.18)', border: '1.5px solid rgba(99,102,241,0.4)', color: '#c7d2fe', padding: '6px 16px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', fontSize: '13px', fontFamily: "'Fredoka One', Nunito, sans-serif", transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.32)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.18)'}
          >
            💡 Hint
          </button>
          {showHint && (
            <div style={{ backgroundColor: 'rgba(250,204,21,0.08)', borderLeft: '3px solid var(--color-gold)', borderRadius: '10px', padding: '8px 12px', maxWidth: '420px', margin: '6px auto 0', fontSize: '13px', color: '#fff', fontWeight: 700, lineHeight: 1.4, textAlign: 'left' }}>
              <strong style={{ color: 'var(--color-gold)' }}>Hint: </strong>{hintText}
            </div>
          )}
        </div>

        {/* Feedback popup — SINGLE continue button for both correct & incorrect (test mode) */}
        <FeedbackOverlay
          visible={feedbackVisible}
          isCorrect={feedbackCorrect}
          message={feedbackMsg}
          explanation={!feedbackCorrect ? currentQuestion.explanation : ''}
          onContinue={handleOverlayContinue}
          onRetry={handleOverlayContinue}  // same handler — always advance
        />
      </div>
    );
  };

  /* ── WORLD SUMMARY ────────────────────────────────────── */
  const renderWorldSummary = () => {
    const starsEarned = calcStars(correctCount);
    return (
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <Mascot mood={starsEarned >= 1 ? 'celebrating' : 'thinking'} />
        <h3 style={{ fontFamily: "'Fredoka One', Nunito, sans-serif", color: '#fff', fontSize: 'var(--fs-section-heading)', margin: '8px 0 4px' }}>
          World Complete!
        </h3>
        <p style={{ fontSize: 'var(--fs-important-numbers)', color: 'var(--color-simulate)', fontWeight: 900, margin: '0 0 8px', fontFamily: "'Fredoka One', Nunito, sans-serif" }}>
          {correctCount} / {questions.length}
        </p>
        <div style={{ fontSize: 'clamp(32px,5vh,48px)', margin: '8px 0' }}>
          {starsEarned >= 1 ? '⭐'.repeat(starsEarned) : '😢'}
        </div>

        {/* Per-question results */}
        <div style={{ maxWidth: '480px', margin: '0 auto 12px', textAlign: 'left' }}>
          {questionResults.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', marginBottom: '3px', backgroundColor: r.correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', fontSize: '12px', fontWeight: 700 }}>
              <span>{r.correct ? '✅' : '❌'}</span>
              <span style={{ flex: 1, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Q{r.idx + 1}: {r.questionText.substring(0, 38)}…
              </span>
              <span style={{ color: r.correct ? '#4ade80' : '#f87171', whiteSpace: 'nowrap' }}>
                ✓ {r.correctAnswer}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { cleanupAudio(); setMode('map'); }} className="btn-secondary" style={{ padding: '10px 22px', fontSize: '15px' }}>
            ➔ Adventure Map
          </button>
          <button onClick={() => enterWorld(activeWorld)} className="btn-gold" style={{ padding: '10px 22px', fontSize: '15px' }}>
            Retry 🔄
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card phase-screen phase-screen--narrow" style={{ width: '100%' }}>
      <div className="phase-band phase-band--play" />
      {mode === 'map'     && renderWorldMap()}
      {mode === 'arena'   && renderPlayArena()}
      {mode === 'summary' && renderWorldSummary()}
    </div>
  );
}
