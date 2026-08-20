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

  /* ── WORLD MAP SCREEN (Exact screenshot design match) ───────────────────────── */
  const WORLDS = [
    { id: 0, name: 'Apple Orchard',  icon: '🍎', qRange: 'Questions 1–10' },
    { id: 1, name: 'Sticker Studio', icon: '⭐', qRange: 'Questions 11–20' },
    { id: 2, name: 'Toy Town',       icon: '🧸', qRange: 'Questions 21–30' },
    { id: 3, name: 'Puppy Park',      icon: '🐶', qRange: 'Questions 31–40' },
    { id: 4, name: 'Pencil Palace',  icon: '✏️', qRange: 'Questions 41–50' },
    { id: 5, name: 'Group Galaxy',   icon: '🚀', qRange: 'Questions 51–60' },
    { id: 6, name: 'Basket Bay',     icon: '🧺', qRange: 'Questions 61–70' },
    { id: 7, name: 'Number Nest',    icon: '🔢', qRange: 'Questions 71–80' },
    { id: 8, name: 'Rainbow Groups', icon: '🌈', qRange: 'Questions 81–90' },
    { id: 9, name: 'Division Castle', icon: '🏰', qRange: 'Questions 91–100' },
  ];

  const renderWorldMap = () => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        padding: '0 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* Title */}
        <h3 style={{
          fontFamily: "'Fredoka One', Nunito, sans-serif",
          color: '#ffffff',
          fontSize: 'clamp(24px, 4vh, 36px)',
          fontWeight: 900,
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <span>🎮</span>
          <span>Practice — Choose Your World!</span>
        </h3>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          color: '#c4b5fd',
          fontSize: 'clamp(13px, 1.8vh, 16px)',
          fontWeight: 700,
          margin: '6px 0 0 0',
          textAlign: 'center',
        }}>
          Answer questions in each world. Earn stars and XP!
        </p>

        {/* 2x5 World Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 'clamp(8px, 1.4vh, 14px)',
          width: '100%',
          maxWidth: '1150px',
          margin: 'clamp(14px, 2.2vh, 26px) 0 0 0',
          boxSizing: 'border-box',
        }}>
          {WORLDS.map((w) => {
            const isUnlocked = w.id === 0 || (gameState.worldStars[w.id - 1] !== null && gameState.worldStars[w.id - 1] >= 1);
            return (
              <div
                key={w.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: isUnlocked ? '16px 8px 14px 8px' : '22px 8px',
                  borderRadius: '20px',
                  backgroundColor: isUnlocked ? 'rgba(236, 72, 153, 0.16)' : 'rgba(255, 255, 255, 0.05)',
                  border: isUnlocked ? '2px solid rgba(244, 114, 182, 0.75)' : '1.5px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: isUnlocked ? '0 0 24px rgba(236, 72, 153, 0.35)' : 'none',
                  boxSizing: 'border-box',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                  minHeight: 'clamp(125px, 19vh, 160px)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                {/* Lock icon for locked worlds in top-right corner */}
                {!isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    🔒
                  </div>
                )}

                {/* World Icon */}
                <div style={{
                  fontSize: isUnlocked ? 'clamp(28px, 4vh, 36px)' : 'clamp(24px, 3.4vh, 30px)',
                  marginBottom: '6px',
                  filter: isUnlocked ? 'drop-shadow(0 4px 10px rgba(236,72,153,0.4))' : 'grayscale(0.2) opacity(0.55)',
                  lineHeight: 1,
                }}>
                  {w.icon}
                </div>

                {/* World Name */}
                <div style={{
                  fontFamily: "'Fredoka One', Nunito, sans-serif",
                  fontSize: 'clamp(13px, 1.8vh, 16px)',
                  fontWeight: 900,
                  color: isUnlocked ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  marginBottom: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}>
                  {w.name}
                </div>

                {/* Questions Range */}
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 'clamp(11px, 1.4vh, 12px)',
                  fontWeight: 800,
                  color: isUnlocked ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.35)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  {w.qRange}
                </div>

                {/* Unlocked PRACTICE button */}
                {isUnlocked && (
                  <button
                    type="button"
                    onClick={() => enterWorld(w.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      marginTop: '10px',
                      padding: '6px 18px',
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontFamily: "'Fredoka One', Nunito, sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(11px, 1.5vh, 13px)',
                      boxShadow: '0 4px 14px rgba(236, 72, 153, 0.5)',
                      cursor: 'pointer',
                      letterSpacing: '0.04em',
                      transition: 'transform 0.15s ease, boxShadow 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.75)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(236, 72, 153, 0.5)';
                    }}
                  >
                    ▶ PRACTICE
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue to Reflect — only shown after ALL 10 worlds played */}
        {allWorldsComplete && (
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <button
              onClick={onCompletePhase}
              className="btn-gold"
              style={{ padding: '12px 36px', fontSize: '17px', borderRadius: '50px', fontWeight: 900 }}
            >
              Continue to Reflection ➔
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ── PLAY ARENA (Exact screenshot design match) ─────────────────────── */
  const renderPlayArena = () => {
    if (!currentQuestion) return null;

    const currentWorldObj = WORLDS[activeWorld] || WORLDS[0];
    const isMCQ           = currentQuestion.options && currentQuestion.options.length > 0;
    const isTrueFalse     = currentQuestion.type === 'true_false';
    const isMixed         = currentQuestion.type === 'mixed_challenge';
    const hintText        = hintsUsed === 0 ? currentQuestion.hint1 : (currentQuestion.hint2 || currentQuestion.hint1);

    // Format equation / question display text inside cyan box
    const getEquationDisplay = () => {
      if (currentQuestion.operandA !== undefined && currentQuestion.operandB !== undefined) {
        const opSymbol = currentQuestion.operation === 'sub' ? '−' : '+';
        return `${currentQuestion.operandA} ${opSymbol} ${currentQuestion.operandB}`;
      }
      return currentQuestion.questionText || 'Solve the problem';
    };

    // Format top tag label
    const getTagLabel = () => {
      if (currentQuestion.regroupType === 'double') return '+ DOUBLE REGROUP';
      if (currentQuestion.operation === 'sub') return '− SUBTRACTION';
      if (currentQuestion.type === 'missing_addend') return '? MISSING DIGITS';
      return '+ REGROUPING';
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%',
        width: '100%',
        padding: '0 var(--space-xs)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>

        {/* Top Header: World Badge & Stats */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '680px',
          flexShrink: 0,
        }}>
          {/* Back to Map button + World Name Badge */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: '6px',
          }}>
            <button
              onClick={() => { cleanupAudio(); setMode('map'); }}
              style={{
                position: 'absolute',
                left: 0,
                padding: '6px 14px',
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontFamily: "'Fredoka One', Nunito, sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              ◀ Map
            </button>

            {/* World Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 22px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
              color: '#ffffff',
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              fontSize: '14px',
              fontWeight: 900,
              boxShadow: '0 4px 14px rgba(236,72,153,0.45)',
            }}>
              <span>⭐</span>
              <span>{currentWorldObj.name}</span>
            </div>
          </div>

          {/* Stats row: Stars, Hearts, Streak */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '0 8px',
            margin: '4px 0 6px 0',
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: '15px',
            fontWeight: 900,
            color: '#ffffff',
          }}>
            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#fbbf24' }}>⭐</span>
              <span>{gameState.worldStars[activeWorld] || 0}</span>
            </div>

            {/* Hearts (3 lives) */}
            <div style={{ display: 'flex', gap: '6px', fontSize: '17px' }}>
              ❤️ ❤️ ❤️
            </div>

            {/* Streak */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#f97316' }}>🔥</span>
              <span>{gameState.streak}x</span>
            </div>
          </div>

          {/* Progress labels & track */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0 4px',
            color: '#94a3b8',
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '4px',
          }}>
            <span>Question {currentQIdx + 1}/{questions.length}</span>
            <span>{Math.round((currentQIdx / questions.length) * 100)}%</span>
          </div>

          {/* Progress Bar Track */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(currentQIdx / questions.length) * 100}%`,
              background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
              borderRadius: '10px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Main Question Card (Glass Container) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '680px',
          backgroundColor: 'rgba(30, 20, 60, 0.45)',
          border: '1.5px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: 'clamp(18px, 2.5vh, 28px)',
          gap: 'clamp(16px, 2.2vh, 24px)',
          boxSizing: 'border-box',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
          flexShrink: 0,
        }}>
          {/* Equation Header Box with Overhanging Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}>
            {/* Tag Badge */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              color: '#0f172a',
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(11px, 1.5vh, 13px)',
              padding: '6px 14px',
              borderRadius: '50px',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 12px rgba(245,158,11,0.35)',
              marginRight: '-14px',
              zIndex: 2,
              whiteSpace: 'nowrap',
            }}>
              {getTagLabel()}
            </div>

            {/* Cyan Equation Display Box */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: '2px solid #06b6d4',
              borderRadius: '20px',
              padding: '12px 36px 12px 44px',
              boxShadow: '0 0 24px rgba(6, 182, 212, 0.35)',
              textAlign: 'center',
            }}>
              <span style={{
                fontFamily: "'Fredoka One', Nunito, sans-serif",
                fontSize: 'clamp(22px, 3.5vh, 32px)',
                fontWeight: 900,
                color: '#38bdf8',
                letterSpacing: '0.04em',
              }}>
                {getEquationDisplay()}
              </span>
            </div>
          </div>

          {/* Question Text (Full sentence) */}
          <p style={{
            fontFamily: "'Fredoka One', Nunito, sans-serif",
            fontSize: 'clamp(14px, 2.2vh, 18px)',
            fontWeight: 800,
            color: '#ffffff',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.35,
            opacity: 0.95,
          }}>
            {currentQuestion.questionText}
          </p>

          {/* Options Grid (2x2 Grid) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTrueFalse || isMixed ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
            gap: '12px',
            width: '100%',
            maxWidth: '540px',
          }}>
            {isTrueFalse ? (
              ['True', 'False'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleMCQSubmit(opt)}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: opt === 'True' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                    border: `2px solid ${opt === 'True' ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'}`,
                    color: '#ffffff',
                    fontFamily: "'Fredoka One', Nunito, sans-serif",
                    fontSize: 'clamp(16px, 2.2vh, 20px)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt === 'True' ? '✅ True' : '❌ False'}
                </button>
              ))
            ) : isMixed ? (
              ['+', '–'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleMCQSubmit(opt)}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(35, 25, 75, 0.6)',
                    border: '1.5px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontFamily: "'Fredoka One', Nunito, sans-serif",
                    fontSize: 'clamp(24px, 3.5vh, 32px)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              ))
            ) : isMCQ ? (
              currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMCQSubmit(option)}
                  style={{
                    padding: 'clamp(12px, 1.8vh, 16px) 10px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(35, 25, 75, 0.6)',
                    border: '1.5px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontFamily: "'Fredoka One', Nunito, sans-serif",
                    fontSize: 'clamp(15px, 2.2vh, 19px)',
                    fontWeight: 900,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, backgroundColor 0.15s ease, borderColor 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(35, 25, 75, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {option}
                </button>
              ))
            ) : (
              <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                <button onClick={handleColumnSubmit} className="btn-gold" style={{ padding: '10px 28px', fontSize: '15px' }}>
                  Submit Answer ✓
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hint button */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <button
            onClick={handleUseHint}
            style={{
              backgroundColor: 'rgba(99,102,241,0.22)',
              border: '2px solid rgba(99,102,241,0.5)',
              color: '#c7d2fe',
              padding: '8px 22px',
              borderRadius: '50px',
              fontWeight: 900,
              cursor: 'pointer',
              fontSize: 'clamp(14px, 2vh, 16px)',
              fontFamily: "'Fredoka One', Nunito, sans-serif",
              transition: 'all 0.2s',
            }}
          >
            💡 Hint
          </button>
          {showHint && (
            <div style={{
              backgroundColor: 'rgba(250,204,21,0.15)',
              borderLeft: '4px solid #fbbf24',
              borderRadius: '14px',
              padding: '10px 18px',
              maxWidth: '520px',
              margin: '8px auto 0',
              fontSize: 'clamp(14px, 2.1vh, 17px)',
              color: '#ffffff',
              fontWeight: 800,
              lineHeight: 1.45,
              textAlign: 'left',
            }}>
              <strong style={{ color: '#fbbf24', fontFamily: "'Fredoka One'" }}>Hint: </strong>{hintText}
            </div>
          )}
        </div>

        {/* Feedback Popup */}
        <FeedbackOverlay
          visible={feedbackVisible}
          isCorrect={feedbackCorrect}
          message={feedbackMsg}
          explanation={!feedbackCorrect ? currentQuestion.explanation : ''}
          onContinue={handleOverlayContinue}
          onRetry={handleOverlayContinue}
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

  if (mode === 'map') {
    return (
      <div style={{
        width: '100%',
        maxWidth: '1180px',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {renderWorldMap()}
      </div>
    );
  }

  if (mode === 'arena') {
    return (
      <div style={{
        width: '100%',
        maxWidth: '850px',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {renderPlayArena()}
      </div>
    );
  }

  return (
    <div className="glass-card phase-screen phase-screen--narrow" style={{ width: '100%' }}>
      <div className="phase-band phase-band--play" />
      {renderWorldSummary()}
    </div>
  );
}
