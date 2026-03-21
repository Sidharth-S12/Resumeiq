import { useState, useRef, useEffect } from 'react'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const JOB_ROLES = [
  ['💻 Software Engineer', '📊 Data Analyst', '🤖 Data Scientist', '⚙️ DevOps Engineer', '🔐 Cybersecurity'],
  ['🎨 UI/UX Designer', '✏️ Graphic Designer', '📐 Product Designer', '🎬 Video Editor'],
  ['📣 Digital Marketing', '✍️ Content Writer', '🔍 SEO Specialist', '📱 Social Media Manager'],
  ['💰 Financial Analyst', '📈 Business Analyst', '🧾 Accountant', '🏦 Investment Banker'],
  ['👥 HR Manager', '🗂️ Product Manager', '📋 Project Manager', '🔧 Operations Manager'],
  ['🏥 Nurse', '📚 Teacher', '🤝 Sales Executive', '⚖️ Legal Counsel'],
]

const TOTAL_QUESTIONS = 5

export default function InterviewPractice({ user }) {
  const [phase, setPhase]           = useState('setup') // setup | interview | result
  const [selectedJob, setSelectedJob] = useState('')
  const [customJob, setCustomJob]   = useState('')
  const [difficulty, setDifficulty] = useState('mixed')
  const [questions, setQuestions]   = useState([])
  const [current, setCurrent]       = useState(0)
  const [answer, setAnswer]         = useState('')
  const [feedback, setFeedback]     = useState(null)
  const [allFeedback, setAllFeedback] = useState([])
  const [loading, setLoading]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const answerRef = useRef()

  const activeJob = customJob.trim() || selectedJob

  useEffect(() => {
    if (phase === 'interview' && answerRef.current) {
      answerRef.current.focus()
    }
  }, [current, phase])

  // ── Generate questions ──
  async function startInterview() {
    if (!activeJob) return
    setLoading(true); setError('')

    const prompt = `Generate exactly ${TOTAL_QUESTIONS} interview questions for a "${activeJob}" position.
Difficulty: ${difficulty}

Respond ONLY with a valid JSON array (no markdown):
[
  {
    "id": 1,
    "question": "<interview question>",
    "type": "<Behavioral / Technical / Situational>",
    "hint": "<brief hint on what a good answer should cover>",
    "difficulty": "<Easy / Medium / Hard>"
  }
]

Make questions realistic and commonly asked in real ${activeJob} interviews. Mix different question types.`

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an expert interview coach. Respond with valid JSON only.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.6, max_tokens: 1500,
        }),
      })
      const data  = await res.json()
      const raw   = data.choices?.[0]?.message?.content || '[]'
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setQuestions(parsed)
      setAllFeedback([])
      setCurrent(0)
      setAnswer('')
      setFeedback(null)
      setPhase('interview')
    } catch (e) {
      setError('Failed to generate questions. Please try again.')
    }
    setLoading(false)
  }

  // ── Submit answer for AI feedback ──
  async function submitAnswer() {
    if (!answer.trim() || submitting) return
    setSubmitting(true)

    const q = questions[current]
    const prompt = `You are an expert interview coach evaluating a candidate's answer for a "${activeJob}" interview.

Question: "${q.question}"
Question Type: ${q.type}
Candidate's Answer: "${answer}"

Evaluate this answer and respond ONLY with valid JSON (no markdown):
{
  "score": <number 1-10>,
  "scoreLabel": "<Poor / Fair / Good / Excellent>",
  "whatWasGood": "<what the candidate did well — be specific>",
  "whatWasMissing": "<what was missing or could be improved>",
  "modelAnswer": "<a strong model answer for this question in 3-4 sentences>",
  "keyPoints": ["point1", "point2", "point3"],
  "tips": "<one actionable tip to improve this answer>"
}`

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an expert interview coach. Respond with valid JSON only.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4, max_tokens: 800,
        }),
      })
      const data  = await res.json()
      const raw   = data.choices?.[0]?.message?.content || '{}'
      const clean = raw.replace(/```json|```/g, '').trim()
      const fb    = JSON.parse(clean)
      setFeedback(fb)
      setAllFeedback(prev => [...prev, { question: q, answer, feedback: fb }])
    } catch (e) {
      setFeedback({ score: 0, scoreLabel: 'Error', whatWasGood: 'Could not evaluate.', whatWasMissing: '', modelAnswer: '', keyPoints: [], tips: '' })
    }
    setSubmitting(false)
  }

  function nextQuestion() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setAnswer('')
      setFeedback(null)
    } else {
      setPhase('result')
    }
  }

  function restart() {
    setPhase('setup')
    setQuestions([])
    setAllFeedback([])
    setCurrent(0)
    setAnswer('')
    setFeedback(null)
    setSelectedJob('')
    setCustomJob('')
  }

  const avgScore = allFeedback.length
    ? Math.round(allFeedback.reduce((a, b) => a + (b.feedback?.score || 0), 0) / allFeedback.length * 10)
    : 0

  const scoreColor = avgScore >= 80 ? '#4ade80' : avgScore >= 60 ? 'var(--cyan)' : avgScore >= 40 ? 'var(--yellow)' : '#f87171'
  const scoreLabel = avgScore >= 80 ? 'Excellent! 🏆' : avgScore >= 60 ? 'Good 👍' : avgScore >= 40 ? 'Fair 📚' : 'Needs Work 💪'

  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div className="hero-tag" style={{ marginBottom: 12 }}>✦ Interview Preparation</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Interview{' '}
          <span style={{ background: 'linear-gradient(90deg, var(--pink), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Q&A Practice
          </span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          Answer real interview questions and get instant AI feedback on every response!
        </p>
      </div>

      {/* ── SETUP PHASE ── */}
      {phase === 'setup' && (
        <div className="card">
          <div className="card-bar" style={{ background: 'linear-gradient(90deg, var(--pink), var(--purple), var(--cyan))' }}/>
          <div className="card-body">
            <div className="card-title" style={{ marginBottom: 4 }}>Set Up Your Practice Session</div>
            <div className="card-sub" style={{ marginBottom: 24 }}>Choose your target role and difficulty</div>

            {/* Job selection */}
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
              style={{ marginBottom: 24 }}
            />

            {/* Difficulty */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                🎯 Difficulty Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { id: 'easy',     label: '🟢 Easy',     desc: 'Basic questions' },
                  { id: 'medium',   label: '🟡 Medium',   desc: 'Common questions' },
                  { id: 'hard',     label: '🔴 Hard',     desc: 'Tough questions' },
                  { id: 'mixed',    label: '🎲 Mixed',    desc: 'All levels' },
                ].map(d => (
                  <button key={d.id} onClick={() => setDifficulty(d.id)} style={{
                    padding: '12px 8px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                    border: `2px solid ${difficulty === d.id ? 'var(--pink)' : 'var(--border)'}`,
                    background: difficulty === d.id ? 'rgba(255,78,205,0.1)' : 'var(--surface2)',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: difficulty === d.id ? 'var(--pink)' : 'var(--text)' }}>{d.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 3 }}>{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {activeJob && (
              <div className="selected-job-badge" style={{ marginBottom: 16 }}>
                ✦ {activeJob} · {difficulty} difficulty · {TOTAL_QUESTIONS} questions
              </div>
            )}

            {error && <div className="error-box" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

            <button onClick={startInterview} disabled={!activeJob || loading} className="btn-analyze"
              style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))', boxShadow: '0 8px 24px rgba(255,78,205,0.3)' }}>
              {loading ? '⏳ Preparing your interview...' : '🎙️ Start Interview Practice'}
            </button>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
              {[
                { icon: '🎙️', label: `${TOTAL_QUESTIONS} Questions`, desc: 'Real interview style' },
                { icon: '🤖', label: 'AI Feedback',   desc: 'Instant evaluation' },
                { icon: '📊', label: 'Score Report',  desc: 'Detailed analysis' },
              ].map(item => (
                <div key={item.label} style={{ padding: 16, borderRadius: 14, textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── INTERVIEW PHASE ── */}
      {phase === 'interview' && questions[current] && (
        <div>
          {/* Progress */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700 }}>
                Question {current + 1} of {questions.length}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,78,205,0.1)', border: '1px solid rgba(255,78,205,0.3)', color: 'var(--pink)' }}>
                  {questions[current].type}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                  {questions[current].difficulty}
                </span>
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: 'var(--surface2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 6,
                background: 'linear-gradient(90deg, var(--pink), var(--purple))',
                width: `${((current + 1) / questions.length) * 100}%`,
                transition: 'width 0.4s ease',
              }}/>
            </div>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'center' }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i < current
                    ? ((allFeedback[i]?.feedback?.score || 0) >= 6 ? '#4ade80' : '#f87171')
                    : i === current ? 'var(--pink)' : 'var(--surface2)',
                  border: i === current ? '2px solid var(--pink)' : '1px solid var(--border)',
                  transition: 'all 0.3s',
                }}/>
              ))}
            </div>
          </div>

          {/* Question card */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, var(--pink), var(--purple))' }}/>
            <div style={{ padding: 28 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                Question {current + 1}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.6, marginBottom: 20 }}>
                {questions[current].question}
              </div>

              {/* Hint */}
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(155,93,255,0.08)', border: '1px solid rgba(155,93,255,0.2)', marginBottom: 20 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💡 Hint: </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{questions[current].hint}</span>
              </div>

              {/* Answer input */}
              {!feedback && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                    Your Answer
                  </label>
                  <textarea
                    ref={answerRef}
                    rows={6}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Type your answer here... Be specific and use examples from your experience. Take your time!"
                    style={{
                      width: '100%', padding: '14px', borderRadius: 12,
                      border: '1px solid var(--border)', background: 'var(--surface2)',
                      color: '#fff', fontSize: '0.9rem', outline: 'none',
                      fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,78,205,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{answer.length} characters</span>
                    <span style={{ fontSize: '0.75rem', color: answer.length > 50 ? '#4ade80' : 'var(--muted)' }}>
                      {answer.length > 50 ? '✓ Good length' : 'Write at least 50 characters'}
                    </span>
                  </div>

                  <button onClick={submitAnswer} disabled={answer.trim().length < 10 || submitting}
                    className="btn-analyze"
                    style={{
                      marginTop: 16,
                      background: answer.trim().length >= 10 ? 'linear-gradient(135deg, var(--pink), var(--purple))' : 'var(--surface2)',
                      boxShadow: answer.trim().length >= 10 ? '0 8px 24px rgba(255,78,205,0.3)' : 'none',
                      color: answer.trim().length >= 10 ? '#fff' : 'var(--muted)',
                    }}>
                    {submitting ? '🤖 AI is evaluating...' : '📤 Submit Answer'}
                  </button>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div style={{ marginTop: 8 }}>
                  {/* Score */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                    borderRadius: 14, marginBottom: 16,
                    background: feedback.score >= 7 ? 'rgba(74,222,128,0.08)' : feedback.score >= 5 ? 'rgba(255,225,77,0.08)' : 'rgba(248,113,113,0.08)',
                    border: `1px solid ${feedback.score >= 7 ? 'rgba(74,222,128,0.3)' : feedback.score >= 5 ? 'rgba(255,225,77,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                      background: feedback.score >= 7 ? 'rgba(74,222,128,0.15)' : feedback.score >= 5 ? 'rgba(255,225,77,0.15)' : 'rgba(248,113,113,0.15)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: feedback.score >= 7 ? '#4ade80' : feedback.score >= 5 ? 'var(--yellow)' : '#f87171' }}>
                        {feedback.score}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 600 }}>/ 10</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 2 }}>{feedback.scoreLabel}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Your answer score</div>
                    </div>
                  </div>

                  {/* Your answer recap */}
                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>📝 Your Answer</div>
                    <p style={{ fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>{answer}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    {/* What was good */}
                    <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>✅ What Was Good</div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5 }}>{feedback.whatWasGood}</p>
                    </div>
                    {/* What was missing */}
                    <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>❌ What Was Missing</div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5 }}>{feedback.whatWasMissing}</p>
                    </div>
                  </div>

                  {/* Key points */}
                  {feedback.keyPoints?.length > 0 && (
                    <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(59,240,228,0.06)', border: '1px solid rgba(59,240,228,0.2)', marginBottom: 12 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>🔑 Key Points to Cover</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {feedback.keyPoints.map(p => (
                          <span key={p} style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, background: 'rgba(59,240,228,0.08)', border: '1px solid rgba(59,240,228,0.25)', color: 'var(--cyan)' }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Model answer */}
                  <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(155,93,255,0.06)', border: '1px solid rgba(155,93,255,0.2)', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>⭐ Model Answer</div>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text)', lineHeight: 1.6 }}>{feedback.modelAnswer}</p>
                  </div>

                  {/* Tip */}
                  {feedback.tips && (
                    <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,225,77,0.06)', border: '1px solid rgba(255,225,77,0.2)', marginBottom: 16 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💡 Pro Tip: </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{feedback.tips}</span>
                    </div>
                  )}

                  <button onClick={nextQuestion} className="btn-analyze"
                    style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))', boxShadow: '0 8px 24px rgba(255,78,205,0.3)' }}>
                    {current < questions.length - 1 ? `Next Question (${current + 2}/${questions.length}) →` : '🏁 See Final Results'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT PHASE ── */}
      {phase === 'result' && (
        <div>
          {/* Overall score */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, var(--pink), var(--purple), var(--cyan))' }}/>
            <div style={{ padding: 32, textAlign: 'center' }}>
              <div className="hero-tag" style={{ marginBottom: 16, display: 'inline-flex' }}>✦ Practice Complete!</div>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: scoreColor, lineHeight: 1, marginBottom: 8 }}>
                {avgScore}%
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: scoreColor, marginBottom: 8 }}>{scoreLabel}</div>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: 24 }}>
                You answered {allFeedback.length} questions for <strong style={{ color: 'var(--text)' }}>{activeJob}</strong>
              </p>

              {/* Score breakdown */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
                {[
                  { label: 'Excellent (8-10)', count: allFeedback.filter(f => f.feedback?.score >= 8).length, color: '#4ade80' },
                  { label: 'Good (6-7)',        count: allFeedback.filter(f => f.feedback?.score >= 6 && f.feedback?.score < 8).length, color: 'var(--cyan)' },
                  { label: 'Fair (4-5)',        count: allFeedback.filter(f => f.feedback?.score >= 4 && f.feedback?.score < 6).length, color: 'var(--yellow)' },
                  { label: 'Poor (1-3)',        count: allFeedback.filter(f => f.feedback?.score < 4).length, color: '#f87171' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question by question review */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, var(--purple), var(--pink))' }}/>
            <div style={{ padding: 28 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>📋 Question Review</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {allFeedback.map((item, i) => (
                  <div key={i} style={{
                    padding: '16px', borderRadius: 14,
                    background: (item.feedback?.score || 0) >= 7 ? 'rgba(74,222,128,0.06)' : (item.feedback?.score || 0) >= 5 ? 'rgba(255,225,77,0.06)' : 'rgba(248,113,113,0.06)',
                    border: `1px solid ${(item.feedback?.score || 0) >= 7 ? 'rgba(74,222,128,0.2)' : (item.feedback?.score || 0) >= 5 ? 'rgba(255,225,77,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: (item.feedback?.score || 0) >= 7 ? 'rgba(74,222,128,0.2)' : (item.feedback?.score || 0) >= 5 ? 'rgba(255,225,77,0.2)' : 'rgba(248,113,113,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.9rem',
                        color: (item.feedback?.score || 0) >= 7 ? '#4ade80' : (item.feedback?.score || 0) >= 5 ? 'var(--yellow)' : '#f87171',
                      }}>{item.feedback?.score}/10</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>{item.question.question}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>Your answer: {item.answer.substring(0, 100)}{item.answer.length > 100 ? '...' : ''}</div>
                      </div>
                    </div>
                    <div style={{ paddingLeft: 48, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                      <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ </span>{item.feedback?.whatWasGood?.substring(0, 80)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={restart} className="btn-analyze"
              style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))', boxShadow: '0 8px 24px rgba(255,78,205,0.3)' }}>
              🔄 Practice Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}