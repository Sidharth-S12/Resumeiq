import { useState } from 'react'
import SkillRoadmap from '../components/SkillRoadmap'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const POPULAR_GOALS = [
  { icon: '📊', title: 'Data Analyst',        desc: 'Excel, SQL, Python, Power BI' },
  { icon: '💻', title: 'Software Engineer',   desc: 'DSA, React, Node.js, System Design' },
  { icon: '🤖', title: 'Data Scientist',      desc: 'ML, Python, TensorFlow, Statistics' },
  { icon: '🎨', title: 'UI/UX Designer',      desc: 'Figma, Research, Prototyping' },
  { icon: '☁️', title: 'Cloud Engineer',      desc: 'AWS, Docker, Kubernetes, DevOps' },
  { icon: '📣', title: 'Digital Marketer',    desc: 'SEO, Ads, Analytics, Content' },
  { icon: '🔐', title: 'Cybersecurity Analyst', desc: 'Networking, Ethical Hacking, SIEM' },
  { icon: '📈', title: 'Product Manager',     desc: 'Roadmapping, Agile, Analytics' },
]

const TIMELINES = [
  { id: '3', label: '3 Months', desc: 'Intensive — daily 2-3 hrs', color: 'var(--pink)' },
  { id: '6', label: '6 Months', desc: 'Balanced — daily 1-2 hrs',  color: 'var(--cyan)' },
  { id: '12', label: '12 Months', desc: 'Relaxed — daily 1 hr',    color: 'var(--purple)' },
]

export default function CareerPath({ user }) {
  const [goal, setGoal]           = useState('')
  const [customGoal, setCustomGoal] = useState('')
  const [timeline, setTimeline]   = useState('6')
  const [currentLevel, setCurrentLevel] = useState('beginner')
  const [roadmap, setRoadmap]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [activeMonth, setActiveMonth] = useState(0)

  const activeGoal = customGoal.trim() || goal

  async function generateCareerPath() {
    if (!activeGoal) return
    setLoading(true)
    setError('')
    setRoadmap(null)

    const prompt = `Create a detailed ${timeline}-month career roadmap for someone who wants to become a "${activeGoal}". Their current level is: ${currentLevel}.

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "title": "<Career Goal Title>",
  "overview": "<2 sentence overview of this career path>",
  "finalOutcome": "<What they will be able to do after ${timeline} months>",
  "avgSalary": "<Average salary range for this role in India>",
  "jobDemand": "<High / Medium / Low>",
  "topCompanies": ["company1", "company2", "company3"],
  "months": [
    {
      "month": <month number>,
      "title": "<phase title e.g. 'Foundation & Basics'>",
      "focus": "<main focus of this month>",
      "skills": ["skill1", "skill2", "skill3"],
      "courses": [
        {
          "name": "<course name>",
          "platform": "<YouTube / Coursera / freeCodeCamp / Udemy>",
          "free": <true/false>,
          "duration": "<e.g. 10 hours>"
        }
      ],
      "tools": ["tool1", "tool2"],
      "project": {
        "name": "<project name>",
        "description": "<what to build>",
        "skills": ["skill used"]
      },
      "weeklyPlan": "<brief weekly breakdown for this month>",
      "milestone": "<what they should be able to do by end of month>"
    }
  ],
  "interviewTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "portfolioTips": "<2-3 tips for building a portfolio for this role>",
  "jobSearchTips": "<2-3 tips for landing first job in this role>",
  "certifications": [
    { "name": "<cert name>", "provider": "<provider>", "free": <true/false> }
  ]
}

Make it practical, realistic and specific to ${activeGoal}. Include ${timeline} months in the months array.`

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
            { role: 'system', content: 'You are an expert career coach. Respond with valid JSON only. No markdown.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.5,
          max_tokens: 3000,
        }),
      })

      const data  = await response.json()
      const raw   = data.choices?.[0]?.message?.content || '{}'
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setRoadmap(parsed)
      setActiveMonth(0)
    } catch (e) {
      setError('Failed to generate roadmap. Please try again.')
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div className="hero-tag" style={{ marginBottom: 12 }}>✦ Career Planning</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Career Path{' '}
          <span style={{ background: 'linear-gradient(90deg, var(--orange), var(--yellow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Generator
          </span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          Tell us your dream role — get a complete month-by-month roadmap with courses, projects and tools!
        </p>
      </div>

      {/* ── INPUT SECTION ── */}
      {!roadmap && (
        <div className="card">
          <div className="card-bar" style={{ background: 'linear-gradient(90deg, var(--orange), var(--yellow), var(--cyan))' }}/>
          <div className="card-body">

            {/* Goal selection */}
            <div className="card-title" style={{ marginBottom: 4 }}>What do you want to become?</div>
            <div className="card-sub" style={{ marginBottom: 20 }}>Pick a popular role or type your own</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
              {POPULAR_GOALS.map(g => (
                <button key={g.title} onClick={() => { setGoal(g.title); setCustomGoal('') }}
                  style={{
                    padding: '14px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                    border: `2px solid ${goal === g.title && !customGoal ? 'var(--orange)' : 'var(--border)'}`,
                    background: goal === g.title && !customGoal ? 'rgba(255,140,66,0.1)' : 'var(--surface2)',
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{g.icon}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: goal === g.title && !customGoal ? 'var(--orange)' : 'var(--text)' }}>{g.title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>{g.desc}</div>
                </button>
              ))}
            </div>

            <input
              className="custom-job-input"
              type="text"
              placeholder="Or type your own goal e.g. 'Blockchain Developer', 'Game Designer'..."
              value={customGoal}
              onChange={e => { setCustomGoal(e.target.value); setGoal('') }}
              style={{ marginBottom: 24 }}
            />

            {/* Timeline */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                📅 Select Timeline
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {TIMELINES.map(t => (
                  <button key={t.id} onClick={() => setTimeline(t.id)}
                    style={{
                      padding: '16px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                      border: `2px solid ${timeline === t.id ? t.color : 'var(--border)'}`,
                      background: timeline === t.id ? `${t.color}15` : 'var(--surface2)',
                      transition: 'all 0.2s',
                    }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: timeline === t.id ? t.color : 'var(--text)' }}>{t.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current level */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                🎯 Your Current Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { id: 'beginner',     label: '🌱 Beginner',     desc: 'Just starting out' },
                  { id: 'intermediate', label: '📈 Intermediate', desc: 'Some experience' },
                  { id: 'advanced',     label: '🚀 Advanced',     desc: 'Looking to switch' },
                ].map(l => (
                  <button key={l.id} onClick={() => setCurrentLevel(l.id)}
                    style={{
                      padding: '14px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                      border: `2px solid ${currentLevel === l.id ? 'var(--purple)' : 'var(--border)'}`,
                      background: currentLevel === l.id ? 'rgba(155,93,255,0.1)' : 'var(--surface2)',
                      transition: 'all 0.2s',
                    }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: currentLevel === l.id ? 'var(--purple)' : 'var(--text)' }}>{l.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {activeGoal && (
              <div className="selected-job-badge" style={{ marginBottom: 16 }}>
                ✦ Goal: {activeGoal} · {timeline} months · {currentLevel}
              </div>
            )}

            {error && <div className="error-box" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

            <button
              onClick={generateCareerPath}
              disabled={!activeGoal || loading}
              className="btn-analyze"
              style={{ background: 'linear-gradient(135deg, var(--orange), var(--yellow))', color: '#1a1a1a', boxShadow: '0 8px 24px rgba(255,140,66,0.3)' }}
            >
              {loading ? '⏳ Building your roadmap...' : '🧭 Generate My Career Roadmap'}
            </button>

          </div>
        </div>
      )}

      {/* ── ROADMAP RESULTS ── */}
      {roadmap && (
        <div>

          {/* Overview card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, var(--orange), var(--yellow), var(--cyan))' }}/>
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <div className="hero-tag" style={{ marginBottom: 10 }}>✦ Your Roadmap is Ready!</div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>{roadmap.title}</h2>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{roadmap.overview}</p>
                </div>
                <button onClick={() => { setRoadmap(null); setGoal(''); setCustomGoal('') }}
                  style={{ padding: '10px 18px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--muted)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  🔄 New Goal
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Timeline',    value: `${timeline} Months`, color: 'var(--orange)' },
                  { label: 'Avg Salary',  value: roadmap.avgSalary || 'Competitive', color: 'var(--cyan)' },
                  { label: 'Job Demand',  value: roadmap.jobDemand || 'High', color: '#4ade80' },
                  { label: 'Your Level',  value: currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1), color: 'var(--purple)' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px', borderRadius: 12, background: 'var(--surface2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Final outcome */}
              {roadmap.finalOutcome && (
                <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.25)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎯 Goal After {timeline} Months</span>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>{roadmap.finalOutcome}</p>
                </div>
              )}

              {/* Top companies */}
              {roadmap.topCompanies?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>🏢 Top Hiring Companies</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {roadmap.topCompanies.map(c => (
                      <span key={c} style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text)' }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Month tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {roadmap.months?.map((m, i) => (
              <button key={i} onClick={() => setActiveMonth(i)}
                style={{
                  padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: activeMonth === i ? 'linear-gradient(135deg, var(--orange), var(--yellow))' : 'var(--surface2)',
                  color: activeMonth === i ? '#1a1a1a' : 'var(--muted)',
                  fontWeight: 800, fontSize: '0.85rem',
                  boxShadow: activeMonth === i ? '0 4px 16px rgba(255,140,66,0.3)' : 'none',
                  transition: 'all 0.2s',
                  border: activeMonth === i ? 'none' : '1px solid var(--border)',
                }}>
                Month {m.month}
              </button>
            ))}
          </div>

          {/* Active month detail */}
          {roadmap.months?.[activeMonth] && (() => {
            const m = roadmap.months[activeMonth]
            return (
              <div>
                {/* Month header */}
                <div className="card" style={{ marginBottom: 16 }}>
                  <div style={{ height: 3, background: 'linear-gradient(90deg, var(--orange), var(--yellow))' }}/>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--orange), var(--yellow))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a',
                      }}>M{m.month}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{m.title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 2 }}>{m.focus}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                      {/* Skills */}
                      <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(155,93,255,0.06)', border: '1px solid rgba(155,93,255,0.2)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>🛠️ Skills to Learn</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {m.skills?.map(s => (
                            <span key={s} style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, background: 'rgba(155,93,255,0.1)', border: '1px solid rgba(155,93,255,0.25)', color: 'var(--purple)' }}>{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Tools */}
                      <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(59,240,228,0.06)', border: '1px solid rgba(59,240,228,0.2)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>⚙️ Tools to Use</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {m.tools?.map(t => (
                            <span key={t} style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, background: 'rgba(59,240,228,0.1)', border: '1px solid rgba(59,240,228,0.25)', color: 'var(--cyan)' }}>{t}</span>
                          ))}
                        </div>
                      </div>

                      {/* Courses */}
                      <div style={{ gridColumn: 'span 2', padding: '14px', borderRadius: 12, background: 'rgba(255,140,66,0.06)', border: '1px solid rgba(255,140,66,0.2)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>📚 Courses This Month</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {m.courses?.map((c, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 1 }}>{c.platform} · {c.duration}</div>
                              </div>
                              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800, background: c.free ? 'rgba(74,222,128,0.1)' : 'rgba(255,140,66,0.1)', border: `1px solid ${c.free ? 'rgba(74,222,128,0.3)' : 'rgba(255,140,66,0.3)'}`, color: c.free ? '#4ade80' : 'var(--orange)', whiteSpace: 'nowrap' }}>
                                {c.free ? 'FREE' : 'PAID'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Project */}
                      {m.project && (
                        <div style={{ gridColumn: 'span 2', padding: '14px', borderRadius: 12, background: 'rgba(255,78,205,0.06)', border: '1px solid rgba(255,78,205,0.2)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>🚀 Project to Build</div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 4 }}>{m.project.name}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 8 }}>{m.project.description}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {m.project.skills?.map(s => (
                              <span key={s} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,78,205,0.1)', border: '1px solid rgba(255,78,205,0.25)', color: 'var(--pink)' }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Weekly plan */}
                      {m.weeklyPlan && (
                        <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(78,140,255,0.06)', border: '1px solid rgba(78,140,255,0.2)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>📅 Weekly Plan</div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5 }}>{m.weeklyPlan}</p>
                        </div>
                      )}

                      {/* Milestone */}
                      {m.milestone && (
                        <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>🏁 Month Milestone</div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5 }}>{m.milestone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  {activeMonth > 0 && (
                    <button onClick={() => setActiveMonth(activeMonth - 1)}
                      style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontWeight: 700, cursor: 'pointer' }}>
                      ← Month {m.month - 1}
                    </button>
                  )}
                  {activeMonth < roadmap.months.length - 1 && (
                    <button onClick={() => setActiveMonth(activeMonth + 1)}
                      style={{ padding: '12px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, var(--orange), var(--yellow))', color: '#1a1a1a', fontWeight: 800, cursor: 'pointer', marginLeft: 'auto' }}>
                      Month {m.month + 1} →
                    </button>
                  )}
                </div>
              </div>
            )
          })()}

          {/* Bottom cards — Interview + Portfolio + Certs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* Interview topics */}
            {roadmap.interviewTopics?.length > 0 && (
              <div className="result-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: 3, background: 'linear-gradient(90deg, var(--cyan), var(--blue))', position: 'absolute', top: 0, left: 0, right: 0 }}/>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🧠 Interview Topics to Focus</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {roadmap.interviewTopics.map(t => (
                    <span key={t} style={{ padding: '5px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, background: 'rgba(59,240,228,0.08)', border: '1px solid rgba(59,240,228,0.25)', color: 'var(--cyan)' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {roadmap.certifications?.length > 0 && (
              <div className="result-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: 3, background: 'linear-gradient(90deg, var(--yellow), var(--orange))', position: 'absolute', top: 0, left: 0, right: 0 }}/>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🏆 Recommended Certifications</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {roadmap.certifications.map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{c.provider}</div>
                      </div>
                      <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800, background: c.free ? 'rgba(74,222,128,0.1)' : 'rgba(255,140,66,0.1)', color: c.free ? '#4ade80' : 'var(--orange)', border: `1px solid ${c.free ? 'rgba(74,222,128,0.3)' : 'rgba(255,140,66,0.3)'}` }}>
                        {c.free ? 'FREE' : 'PAID'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio tips */}
            {roadmap.portfolioTips && (
              <div className="result-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: 3, background: 'linear-gradient(90deg, var(--purple), var(--pink))', position: 'absolute', top: 0, left: 0, right: 0 }}/>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>💼 Portfolio Tips</div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6 }}>{roadmap.portfolioTips}</p>
              </div>
            )}

            {/* Job search tips */}
            {roadmap.jobSearchTips && (
              <div className="result-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: 3, background: 'linear-gradient(90deg, #4ade80, var(--cyan))', position: 'absolute', top: 0, left: 0, right: 0 }}/>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>🔍 Job Search Tips</div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6 }}>{roadmap.jobSearchTips}</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}