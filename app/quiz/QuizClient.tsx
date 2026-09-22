'use client';

/**
 * app/quiz/QuizClient.tsx
 * Client Component for Quiz Assessment.
 * Mirrors templates/quiz.html 1:1:
 *  - EliteBackBtn to hub
 *  - Page header with eyebrow + title + subtitle
 *  - Question cards with custom radio controls
 *  - Big background question numbers (01, 02, etc.)
 *  - Initialize Evaluation button with animated arrow
 *  - Instant evaluation marking correct/wrong options & displaying score
 *  - Fallback UI if no quizzes are active
 */

import { useState } from 'react';
import EliteBackBtn from '../components/EliteBackBtn';
import type { QuizRow } from '@/lib/supabase-db';

interface QuizClientProps {
  quizzes: QuizRow[];
}

export default function QuizClient({ quizzes }: QuizClientProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (quizId: number, option: string) => {
    if (evaluated) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: option }));
  };

  const handleEvaluate = () => {
    let currentScore = 0;
    quizzes.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_option) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setEvaluated(true);

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="industrial-grid" style={{ minHeight: '100vh' }}>
      {/* Elite Back Hub Button */}
      <EliteBackBtn href="/#quiz-section" label="Back to Hub" />

      {/* Page Header */}
      <section className="page-header" style={{ padding: '140px 0 60px', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <span className="eyebrow eyebrow-center">Assessment Matrix</span>
          <h1 className="font-mixed">
            Verify your <span className="serif-italic">knowledge.</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.05rem', color: '#4A5568', maxWidth: 600, margin: '1.5rem auto 0' }}>
            Answer the institutional queries below to evaluate your proficiency in operational methodologies and Quality Concepts.
          </p>
        </div>
      </section>

      {/* Main Quiz Interface */}
      <div className="quiz-wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 5% 120px' }}>
        {quizzes && quizzes.length > 0 ? (
          <form id="quizForm" onSubmit={(e) => e.preventDefault()}>
            {quizzes.map((q, idx) => {
              const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
              const userAnswer = selectedAnswers[q.id];

              const getOptionClass = (opt: string) => {
                const base = 'option-item';
                if (!evaluated) return base;

                // After evaluation:
                if (opt === q.correct_option) {
                  return `${base} correct-answer`;
                }
                if (userAnswer === opt && opt !== q.correct_option) {
                  return `${base} wrong-answer`;
                }
                return base;
              };

              return (
                <div key={q.id} className="question-card" data-correct={q.correct_option}>
                  <div className="q-number-bg">{numStr}</div>
                  <h3 className="question-title">
                    Q{idx + 1}. {q.question}
                  </h3>

                  <div className="options-list">
                    {/* Option A */}
                    <label
                      className={getOptionClass('A')}
                      onClick={() => handleSelect(q.id, 'A')}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value="A"
                        checked={userAnswer === 'A'}
                        disabled={evaluated}
                        onChange={() => {}}
                      />
                      <div className="custom-radio" />
                      <span>A) {q.option_a}</span>
                    </label>

                    {/* Option B */}
                    <label
                      className={getOptionClass('B')}
                      onClick={() => handleSelect(q.id, 'B')}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value="B"
                        checked={userAnswer === 'B'}
                        disabled={evaluated}
                        onChange={() => {}}
                      />
                      <div className="custom-radio" />
                      <span>B) {q.option_b}</span>
                    </label>

                    {/* Option C */}
                    <label
                      className={getOptionClass('C')}
                      onClick={() => handleSelect(q.id, 'C')}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value="C"
                        checked={userAnswer === 'C'}
                        disabled={evaluated}
                        onChange={() => {}}
                      />
                      <div className="custom-radio" />
                      <span>C) {q.option_c}</span>
                    </label>

                    {/* Option D */}
                    <label
                      className={getOptionClass('D')}
                      onClick={() => handleSelect(q.id, 'D')}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value="D"
                        checked={userAnswer === 'D'}
                        disabled={evaluated}
                        onChange={() => {}}
                      />
                      <div className="custom-radio" />
                      <span>D) {q.option_d}</span>
                    </label>
                  </div>
                </div>
              );
            })}

            {!evaluated ? (
              <div className="submit-wrapper">
                <button
                  type="button"
                  className="btn-submit"
                  id="submitBtn"
                  onClick={handleEvaluate}
                >
                  Initialize Evaluation
                  <div className="btn-arrow">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            ) : null}
          </form>
        ) : (
          /* Fallback UI */
          <div className="fallback-ui">
            <svg
              className="fallback-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <h2 className="font-mixed" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              System <span className="serif-italic">Updating.</span>
            </h2>
            <p style={{ color: '#4A5568', fontSize: '1.1rem' }}>
              No assessment modules are currently active. Content will synchronize here once the administrator initializes the testing matrix.
            </p>
          </div>
        )}

        {evaluated && (
          <div className="result-container" id="resultContainer" style={{ display: 'block' }}>
            <span id="scoreText">
              You scored {score} out of {quizzes.length}!
            </span>
            <div className="result-subtitle">Evaluation Completed Successfully</div>
          </div>
        )}
      </div>

      {/* Minimal Footer */}
      <footer style={{ backgroundColor: 'var(--text-dark)', color: 'white', padding: '4rem 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
        <div className="container">
          &copy; 2026 QCFI Raurkela Chapter. All Rights Reserved. Engineered for Excellence.
        </div>
      </footer>
    </div>
  );
}
