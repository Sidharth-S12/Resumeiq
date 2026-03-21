import { useState } from 'react'
import TestResult from '../components/TestResult'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const JOB_ROLES = [
  ['💻 Software Engineer', '📊 Data Analyst', '🤖 Data Scientist', '⚙️ DevOps Engineer', '🔐 Cybersecurity'],
  ['🎨 UI/UX Designer', '✏️ Graphic Designer', '📐 Product Designer', '🎬 Video Editor'],
  ['📣 Digital Marketing', '✍️ Content Writer', '🔍 SEO Specialist', '📱 Social Media Manager'],
  ['💰 Financial Analyst', '📈 Business Analyst', '🧾 Accountant', '🏦 Investment Banker'],
  ['👥 HR Manager', '🗂️ Product Manager', '📋 Project Manager', '🔧 Operations Manager'],
  ['🏥 Nurse', '📚 Teacher', '🤝 Sales Executive', '⚖️ Legal Counsel'],
]

export default function MockTest({ user }) {
  const [selectedJob, setSelectedJob] = useState('')
  const [customJob, setCustomJob]     = useState('')
  const [questions, setQuestions]     = useState([])
  const [current, setCurrent]         = useState(0)
  const [answers, setAnswers]         = useState({})
  const [selected, setSelected]       = useState(null)
  const [confirmed, setConfirmed]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [phase, setPhase]             = useState('select') // select | test | result

  const activeJob = customJob.trim() || selectedJob

  async function generateTest() {
    if (!activeJob) return
    setLoading(true)
    setError('')

    const prompt = `Generate exactly 10 multiple choice interview questions for a "${activeJob}" position.

Questions should cover the most commonly asked topics in real interviews for this role.

Respond ONLY with a valid JSON array (no markdown, no extra text):
[
  {
    "id": 1,
    "topic": "<topic name e.g. 'Data Structures', 'Marketing Strategy'>",
    "question": "<the interview question>",
    "options": ["A. <option>", "B. <option>", "C. <option>", "D. <option>"],
    "correct": "<A or B or C or D>",
    "explanation": "<1-2 sentence explanation of why this is correct>",
    "difficulty": "<Easy / Medium / Hard>"
  }
]

Make questions practical and realistic. Cover different topics across the 10 questions.`

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an expert interview coach. Respond with valid JSON only. No markdown.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.6,
          max_tokens: 2500,
        }),
      })

      const data  = await response.json()
      const raw   = data.choices?.[0]?.message?.content || '[]'
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      if (!parsed.length) throw new Error('No questions generated')

      setQuestions(parsed)
      setAnswers({})
      setCurrent(0)
      setSelected(null)
      setConfirmed(false)
      setPhase('test')
    } catch (e) {
      setError('Failed to generate questions. Please try again.')
    }
    setLoading(false)
  }

  function handleSelect(option) {
    if (confirmed) return
    setSelected(option[0]) // just A, B, C, or D
  }

  function handleConfirm() {
    if (!selected || confirmed) return
    setConfirmed(true)
    setAnswers(prev => ({ ...prev, [current]: selected }))
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      setPhase('result')
    }
  }

  function handleRestart() {
    setPhase('select')
    setQuestions([])
    setAnswers({})
    setCurrent(0)
    setSelected(null)
    setConfirmed(false)
    setSelectedJob('')
    setCustomJob('')
  }

  const q = questions[current]
  const progress = questions.length ? ((current + (confirmed ? 1 : 0)) / questions.length) * 100 : 0

  // ── RESULT PHASE ──
  if (phase === 'result') {
    return <TestResult questions={questions} answers={answers} jobRole={activeJob} onRestart={handleRestart} />
  }

  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Page Header */}
      <div style={{ marginBottom: 36 }}>
        <div className="hero-tag" style={{ marginBottom: 12 }}>✦ Interview Preparation</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Mock{' '}
          <span style={{ background: 'linear-gradient(90deg, var(--cyan), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Interview Test
          </span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          10 AI-generated MCQ questions based on real interview topics for your job role.
        </p>
      </div>

      {/* ── SELECT PHASE ── */}
      {phase === 'select' && (
        <div className="card">
          <div className="card-bar"/>
          <div className="card-body">
            <div className="card-title" style={{ marginBottom: 4 }}>Choose Your Job Role</div>
            <div className="card-sub" style={{ marginBottom: 24 }}>Select the role you're preparing to interview for</div>

            <div className="job-categories" style={{ marginBottom: 16 }}>
              {JOB_ROLES.map((row, i) => (
                <div className="job-row" key={i}>
                  {row.map(job => (
                    <button key={job}
                      className={`job-chip ${selectedJob === job && !customJob ? 'active' : ''}`}
                      onClick={() => { setSelectedJob(job); setCustomJob('') }}>
                      {job}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <input className="custom-job-input" type="text"
              placeholder="Or type a custom job title..."
              value={customJob}
              onChange={e => { setCustomJob(e.target.value); setSelectedJob('') }}
              style={{ marginBottom: 16 }}
            />

            {activeJob && (
              <div className="selected-job-badge" style={{ marginBottom: 20 }}>✦ Selected: {activeJob}</div>
            )}

            {error && <div className="error-box" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

            <button
              onClick={generateTest}
              disabled={!activeJob || loading}
              className="btn-analyze"
              style={{ background: 'linear-gradient(135deg, var(--cyan), var(--blue))', boxShadow: '0 8px 24px rgba(59,240,228,0.25)' }}
            >
              {loading ? '⏳ Generating your test...' : '🧠 Start Mock Interview Test'}
            </button>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
              {[
                { icon: '❓', label: '10 Questions', desc: 'MCQ format' },
                { icon: '🎯', label: 'Real Topics', desc: 'Based on actual interviews' },
                { icon: '📊', label: 'Instant Results', desc: 'Score + improvement tips' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '16px', borderRadius: 14, textAlign: 'center',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TEST PHASE ── */}
      {phase === 'test' && q && (
        <div>
          {/* Progress bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700 }}>
                Question {current + 1} of {questions.length}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DifficultyDot level={q.difficulty} />
                <span style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20, background: 'rgba(59,240,228,0.1)', border: '1px solid rgba(59,240,228,0.25)', color: 'var(--cyan)', fontWeight: 700 }}>
                  {q.topic}
                </span>
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: 'var(--surface2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 6,
                background: 'linear-gradient(90deg, var(--cyan), var(--blue))',
                width: `${((current + 1) / questions.length) * 100}%`,
                transition: 'width 0.4s ease',
              }}/>
            </div>
            {/* Step dots */}
            <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i < current
                    ? (answers[i] === questions[i].correct ? '#4ade80' : '#f87171')
                    : i === current ? 'var(--cyan)' : 'var(--surface2)',
                  border: i === current ? '2px solid var(--cyan)' : '1px solid var(--border)',
                  transition: 'all 0.3s',
                }}/>
              ))}
            </div>
          </div>

          {/* Question card */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, var(--cyan), var(--blue))' }}/>
            <div style={{ padding: 32 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                Q{current + 1}.
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>
                {q.question}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options.map((option, i) => {
                  const letter = option[0]
                  const isSelected = selected === letter
                  const isCorrect  = confirmed && letter === q.correct
                  const isWrong    = confirmed && isSelected && letter !== q.correct

                  let bg     = 'var(--surface2)'
                  let border = 'var(--border)'
                  let color  = 'var(--text)'

                  if (isCorrect)       { bg = 'rgba(74,222,128,0.12)'; border = 'rgba(74,222,128,0.5)'; color = '#4ade80' }
                  else if (isWrong)    { bg = 'rgba(248,113,113,0.12)'; border = 'rgba(248,113,113,0.5)'; color = '#f87171' }
                  else if (isSelected) { bg = 'rgba(59,240,228,0.1)'; border = 'rgba(59,240,228,0.5)'; color = 'var(--cyan)' }

                  return (
                    <button key={i} onClick={() => handleSelect(option)}
                      style={{
                        padding: '14px 18px', borderRadius: 12, textAlign: 'left',
                        border: `1px solid ${border}`, background: bg, color,
                        fontSize: '0.9rem', fontWeight: isSelected || isCorrect ? 700 : 500,
                        cursor: confirmed ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isCorrect ? '#4ade80' : isWrong ? '#f87171' : isSelected ? 'var(--cyan)' : 'var(--border)',
                        color: isCorrect || isWrong || isSelected ? '#fff' : 'var(--muted)',
                        fontSize: '0.78rem', fontWeight: 800,
                      }}>{letter}</span>
                      {option.substring(3)}
                      {isCorrect && <span style={{ marginLeft: 'auto' }}>✓</span>}
                      {isWrong   && <span style={{ marginLeft: 'auto' }}>✗</span>}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {confirmed && (
                <div style={{
                  marginTop: 16, padding: '14px 16px', borderRadius: 12,
                  background: answers[current] === q.correct ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                  border: `1px solid ${answers[current] === q.correct ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', marginBottom: 4, color: answers[current] === q.correct ? '#4ade80' : '#f87171' }}>
                    {answers[current] === q.correct ? '✅ Correct!' : `❌ Incorrect — Correct answer: ${q.correct}`}
                  </div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text)', lineHeight: 1.5 }}>{q.explanation}</div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {!confirmed ? (
              <button onClick={handleConfirm} disabled={!selected}
                className="btn-analyze"
                style={{
                  background: selected ? 'linear-gradient(135deg, var(--cyan), var(--blue))' : 'var(--surface2)',
                  boxShadow: selected ? '0 8px 24px rgba(59,240,228,0.25)' : 'none',
                  color: selected ? '#fff' : 'var(--muted)',
                }}>
                Confirm Answer
              </button>
            ) : (
              <button onClick={handleNext} className="btn-analyze"
                style={{ background: 'linear-gradient(135deg, var(--cyan), var(--blue))', boxShadow: '0 8px 24px rgba(59,240,228,0.25)' }}>
                {current < questions.length - 1 ? 'Next Question →' : '🏁 See My Results'}
              </button>
            )}
          </div>
        </div>
      )}

      <footer className="footer" style={{ marginTop: 60 }}>
        Built with ❤️ · Powered by <span>Groq AI</span> + Firebase · ResumeIQ
      </footer>
    </div>
  )
}

function DifficultyDot({ level }) {
  const colors = { Easy: '#4ade80', Medium: '#ffe14d', Hard: '#f87171' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: colors[level] || '#ffe14d' }}/>
      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>{level}</span>
    </div>
  )
}