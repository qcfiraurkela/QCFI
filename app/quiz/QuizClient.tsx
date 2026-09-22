'use client';

/**
 * app/quiz/QuizClient.tsx
 * Client Component for Quiz Assessment.
 * Impeccable alignment with shared Navbar & Footer.
 */

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Shared Navbar */}
      <Navbar />

      {/* Elite Back Hub Button */}
      <EliteBackBtn href="/#quiz-section" label="Back to Hub" />

      {/* Page Sub-Header */}
      <section className="page-header-sub">
        <div className="container">
          <span className="eyebrow eyebrow-center">[ Assessment Matrix ]</span>
          <h1 className="font-mixed">
            Verify your <span className="serif-italic">knowledge.</span>
          </h1>
          <p className="text-body" style={{ marginTop: '1.25rem', maxWidth: 620, marginInline: 'auto' }}>
            Answer the institutional queries below to evaluate your proficiency in operational methodologies and Quality Concepts.
          </p>
        </div>
      </section>

      {/* Main Quiz Interface */}
      <div className="container" style={{ maxWidth: 880, margin: '0 auto', padding: '60px 24px 100px', flex: 1 }}>
        {quizzes && quizzes.length > 0 ? (
          <form id="quizForm" onSubmit={(e) => e.preventDefault()}>
            {quizzes.map((q, idx) => {
              const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
              const userAnswer = selectedAnswers[q.id];

              const getOptionClass = (opt: string) => {
                const base = 'option-item';
                if (!evaluated) return base;
                if (opt === q.correct_option) return `${base} correct-answer`;
                if (userAnswer === opt && opt !== q.correct_option) return `${base} wrong-answer`;
                return base;
              };

              return (
                <div key={q.id} className="question-card">
                  <div className="q-number-bg">{numStr}</div>
                  <h3 className="question-title">
                    Q{idx + 1}. {q.question}
                  </h3>

                  <div className="options-list">
                    <label className={getOptionClass('A')} onClick={() => handleSelect(q.id, 'A')}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value="A"
                        checked={userAnswer === 'A'}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <span className="custom-radio" />
                      <span>{q.option_a}</span>
                    </label>

                    <label className={getOptionClass('B')} onClick={() => handleSelect(q.id, 'B')}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value="B"
                        checked={userAnswer === 'B'}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <span className="custom-radio" />
                      <span>{q.option_b}</span>
                    </label>

                    <label className={getOptionClass('C')} onClick={() => handleSelect(q.id, 'C')}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value="C"
                        checked={userAnswer === 'C'}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <span className="custom-radio" />
                      <span>{q.option_c}</span>
                    </label>

                    <label className={getOptionClass('D')} onClick={() => handleSelect(q.id, 'D')}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value="D"
                        checked={userAnswer === 'D'}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <span className="custom-radio" />
                      <span>{q.option_d}</span>
                    </label>
                  </div>
                </div>
              );
            })}

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                type="button"
                className="elite-btn"
                onClick={handleEvaluate}
                disabled={evaluated}
                style={{ opacity: evaluated ? 0.7 : 1, cursor: evaluated ? 'default' : 'pointer' }}
              >
                {evaluated ? 'Evaluation Complete' : 'Initialize Evaluation'}
                <div className="btn-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {evaluated && (
              <div
                style={{
                  marginTop: '3rem',
                  padding: '2.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 20,
                  border: '1px solid var(--border-light)',
                  textAlign: 'center',
                  animation: 'panelFadeIn 0.5s ease forwards',
                }}
              >
                <span className="eyebrow">[ Assessment Score ]</span>
                <h2 className="font-mixed" style={{ fontSize: '2.4rem', margin: '0.5rem 0 1rem' }}>
                  {score} <span className="serif-italic">/ {quizzes.length} Correct</span>
                </h2>
                <p className="text-body">
                  {score === quizzes.length
                    ? 'Outstanding proficiency in Quality Circle & TQM methodologies!'
                    : 'Good attempt. Review the correct answers highlighted above in green to improve.'}
                </p>
              </div>
            )}
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4A5568' }}>
            <p className="text-body">No quiz assessments currently active. Check back later.</p>
          </div>
        )}
      </div>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}