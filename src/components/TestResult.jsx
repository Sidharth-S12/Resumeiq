import SkillRoadmap from './SkillRoadmap'

export default function TestResult({ questions, answers, jobRole, onRestart }) {
  const total   = questions.length
  const correct = questions.filter((q, i) => answers[i] === q.correct).length
  const score   = Math.round((correct / total) * 100)

  // Group by topic
  const topicMap = {}
  questions.forEach((q, i) => {
    if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, correct: 0 }
    topicMap[q.topic].total++
    if (answers[i] === q.correct) topicMap[q.topic].correct++
  })

  const strongTopics = Object.entries(topicMap).filter(([, v]) => v.correct === v.total).map(([k]) => k)
  const weakTopics   = Object.entries(topicMap).filter(([, v]) => v.correct < v.total).map(([k]) => k)
  const weakSkills   = weakTopics.slice(0, 5)

  const grade = score >= 80 ? { label: 'Excellent! 🏆', color: '#4ade80', desc: 'You are well prepared for this role!' }
              : score >= 60 ? { label: 'Good 👍',       color: 'var(--cyan)', desc: 'A little more prep and you\'ll nail it!' }
              : score >= 40 ? { label: 'Fair 📚',        color: 'var(--yellow)', desc: 'Focus on the weak topics below.' }
              :               { label: 'Needs Work 💪',  color: '#f87171', desc: 'Don\'t worry — practice makes perfect!' }

  const circumference = 220
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div className="hero-tag" style={{ marginBottom: 12 }}>✦ Test Complete</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Your <span style={{ background: 'linear-gradient(90deg, var(--cyan), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interview Results</span>
        </h1>
        <p style={{ color: 'var(--muted)' }}>Here's how you performed for <strong style={{ color: 'var(--text)' }}>{jobRole}</strong></p>
      </div>

      {/* Score card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--cyan), var(--blue))' }}/>
        <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>

          {/* Ring */}
          <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="testGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3bf0e4"/>
                  <stop offset="100%" stopColor="#4e8cff"/>
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="35" fill="none" stroke="var(--surface2)" strokeWidth="10"/>
              <circle cx="60" cy="60" r="35" fill="none"
                stroke="url(#testGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1.2s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: grade.color }}>{score}%</div>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: grade.color }}>{grade.label}</div>
            <div style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: 12 }}>{grade.desc}</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>{correct}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 700 }}>CORRECT</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171' }}>{total - correct}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 700 }}>WRONG</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--cyan)' }}>{total}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 700 }}>TOTAL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* Strong topics */}
        <div className="result-card score">
          <div style={{ height: 3, background: 'linear-gradient(90deg, #4ade80, var(--cyan))', position: 'absolute', top: 0, left: 0, right: 0 }}/>
          <div className="result-label" style={{ marginBottom: 12 }}>
            <div className="dot" style={{ background: '#4ade80' }}/>✅ Strong Topics
          </div>
          {strongTopics.length === 0 ? (
            <p style={{ fontSize: '0.83rem', color: 'var(--muted)' }}>Keep practicing to build strong areas!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {strongTopics.map(t => (
                <div key={t} style={{
                  padding: '8px 14px', borderRadius: 10,
                  background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
                  fontSize: '0.85rem', fontWeight: 600, color: '#4ade80',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>✓</span> {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weak topics */}
        <div className="result-card match">
          <div style={{ height: 3, background: 'linear-gradient(90deg, #f87171, var(--orange))', position: 'absolute', top: 0, left: 0, right: 0 }}/>
          <div className="result-label" style={{ marginBottom: 12 }}>
            <div className="dot" style={{ background: '#f87171' }}/>❌ Needs Improvement
          </div>
          {weakTopics.length === 0 ? (
            <p style={{ fontSize: '0.83rem', color: '#4ade80', fontWeight: 600 }}>Perfect score on all topics! 🎉</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {weakTopics.map(t => (
                <div key={t} style={{
                  padding: '8px 14px', borderRadius: 10,
                  background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                  fontSize: '0.85rem', fontWeight: 600, color: '#f87171',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>✗</span> {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question review */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--purple), var(--pink))' }}/>
        <div style={{ padding: 28 }}>
          <div className="result-label" style={{ marginBottom: 16 }}>
            <div className="dot" style={{ background: 'var(--purple)' }}/>📝 Question Review
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correct
              return (
                <div key={i} style={{
                  padding: '16px', borderRadius: 12,
                  background: isCorrect ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)',
                  border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: isCorrect ? '#4ade80' : '#f87171',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', color: '#fff', fontWeight: 800,
                    }}>{i + 1}</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</div>
                  </div>
                  <div style={{ paddingLeft: 34, fontSize: '0.8rem' }}>
                    <span style={{ color: isCorrect ? '#4ade80' : '#f87171', fontWeight: 700 }}>
                      Your answer: {answers[i] || 'Not answered'}
                    </span>
                    {!isCorrect && (
                      <span style={{ color: '#4ade80', fontWeight: 700, marginLeft: 12 }}>
                        Correct: {q.correct}
                      </span>
                    )}
                    <div style={{ color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{q.explanation}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Skill Roadmap for weak areas */}
      {weakSkills.length > 0 && (
        <div style={{ display: 'grid' }}>
          <SkillRoadmap missingSkills={weakSkills} jobRole={jobRole} />
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button onClick={onRestart} className="btn-analyze"
          style={{ background: 'linear-gradient(135deg, var(--cyan), var(--blue))', boxShadow: '0 8px 24px rgba(59,240,228,0.25)' }}>
          🔄 Take Another Test
        </button>
      </div>

      <footer className="footer" style={{ marginTop: 60 }}>
        Built with ❤️ · Powered by <span>Groq AI</span> + Firebase · ResumeIQ
      </footer>
    </div>
  )
}