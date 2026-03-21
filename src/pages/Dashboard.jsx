import { useState, useEffect } from 'react'
import { getUserAnalyses } from '../saveAnalysis'
import { sendAnalysisEmail } from '../sendEmail'

export default function Dashboard({ user }) {
  const [analyses, setAnalyses]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [sending, setSending]       = useState({})
  const [sentMap, setSentMap]       = useState({})
  const [expanded, setExpanded]     = useState(null)
  const [activeTab, setActiveTab]   = useState('overview')

  useEffect(() => {
    if (user) loadData()
  }, [user])

  async function loadData() {
    setLoading(true)
    try {
      const data = await getUserAnalyses(user.uid)
      setAnalyses(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  async function handleSendEmail(analysis) {
    setSending(s => ({ ...s, [analysis.id]: true }))
    try {
      await sendAnalysisEmail({
        toEmail: user.email,
        toName:  user.displayName?.split(' ')[0] || 'there',
        jobRole: analysis.jobRole,
        results: analysis.results,
      })
      setSentMap(s => ({ ...s, [analysis.id]: true }))
    } catch (e) {
      alert('Failed to send email. Please check your EmailJS setup.')
      console.error(e)
    }
    setSending(s => ({ ...s, [analysis.id]: false }))
  }

  // ── Stats calculations ──
  const avgScore   = analyses.length ? Math.round(analyses.reduce((a, b) => a + (b.results?.score || 0), 0) / analyses.length) : 0
  const avgMatch   = analyses.length ? Math.round(analyses.reduce((a, b) => a + (b.results?.match || 0), 0) / analyses.length) : 0
  const bestScore  = analyses.length ? Math.max(...analyses.map(a => a.results?.score || 0)) : 0
  const bestMatch  = analyses.length ? Math.max(...analyses.map(a => a.results?.match || 0)) : 0

  // Top missing skills across all analyses
  const skillCount = {}
  analyses.forEach(a => a.results?.missingSkills?.forEach(s => { skillCount[s] = (skillCount[s] || 0) + 1 }))
  const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 6)

  // Score trend (last 6)
  const trend = analyses.slice(0, 6).reverse()

  if (!user) return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 780, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔐</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Sign in to view your Dashboard</div>
      <div style={{ color: 'var(--muted)' }}>Your analysis history and progress charts will appear here</div>
    </div>
  )

  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="hero-tag" style={{ marginBottom: 12 }}>✦ Your Progress</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          Welcome back, <strong style={{ color: 'var(--text)' }}>{user.displayName?.split(' ')[0]}</strong>! Here's your resume journey.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
          Loading your data...
        </div>
      ) : analyses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div className="card-bar"/>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No analyses yet!</div>
          <div style={{ color: 'var(--muted)' }}>Go to the Analyzer page, upload your resume and run your first analysis to see your dashboard.</div>
        </div>
      ) : (
        <>
          {/* ── STAT CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Analyses', value: analyses.length, icon: '📄', color: 'var(--purple)' },
              { label: 'Avg Resume Score', value: `${avgScore}`, icon: '⭐', color: 'var(--pink)' },
              { label: 'Avg Job Match', value: `${avgMatch}%`, icon: '🎯', color: 'var(--cyan)' },
              { label: 'Best Score', value: `${bestScore}`, icon: '🏆', color: 'var(--yellow)' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '20px 18px',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stat.color }}/>
                <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── TABS ── */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
            {[
              { id: 'overview',  label: '📊 Overview'  },
              { id: 'history',   label: '📋 History'   },
              { id: 'skills',    label: '🛠️ Skills Gap' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 16px', fontSize: '0.88rem', fontWeight: 700,
                color: activeTab === tab.id ? 'var(--pink)' : 'var(--muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--pink)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Score trend chart */}
              <div className="card" style={{ padding: 24 }}>
                <div className="card-bar"/>
                <div style={{ fontWeight: 700, marginBottom: 4, marginTop: 4 }}>📈 Score Trend</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 20 }}>Last {trend.length} analyses</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                  {trend.map((a, i) => {
                    const h = Math.max(8, (a.results?.score || 0) * 1.2)
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 700 }}>{a.results?.score}</div>
                        <div style={{
                          width: '100%', height: h, borderRadius: '6px 6px 0 0',
                          background: `linear-gradient(180deg, var(--purple), var(--pink))`,
                          transition: 'height 0.5s ease',
                          minHeight: 8,
                        }}/>
                        <div style={{ fontSize: '0.6rem', color: 'var(--muted)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                          {a.jobRole?.split(' ').pop()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Match trend chart */}
              <div className="card" style={{ padding: 24 }}>
                <div className="card-bar"/>
                <div style={{ fontWeight: 700, marginBottom: 4, marginTop: 4 }}>🎯 Job Match Trend</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 20 }}>Last {trend.length} analyses</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                  {trend.map((a, i) => {
                    const h = Math.max(8, (a.results?.match || 0) * 1.2)
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 700 }}>{a.results?.match}%</div>
                        <div style={{
                          width: '100%', height: h, borderRadius: '6px 6px 0 0',
                          background: 'linear-gradient(180deg, var(--cyan), var(--blue))',
                          minHeight: 8,
                        }}/>
                        <div style={{ fontSize: '0.6rem', color: 'var(--muted)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                          {a.jobRole?.split(' ').pop()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Best performance */}
              <div className="card" style={{ padding: 24 }}>
                <div className="card-bar"/>
                <div style={{ fontWeight: 700, marginBottom: 16, marginTop: 4 }}>🏆 Best Performance</div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--purple), var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{bestScore}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>BEST SCORE</div>
                  </div>
                  <div style={{ width: 1, background: 'var(--border)' }}/>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--cyan), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{bestMatch}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>BEST MATCH</div>
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="card" style={{ padding: 24 }}>
                <div className="card-bar"/>
                <div style={{ fontWeight: 700, marginBottom: 16, marginTop: 4 }}>🕐 Recent Activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {analyses.slice(0, 3).map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{a.jobRole}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{a.fileName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--purple)' }}>{a.results?.score}/100</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pink)' }}>{a.results?.match}% match</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {analyses.map((analysis, i) => (
                <div key={analysis.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 16, overflow: 'hidden',
                  borderColor: expanded === analysis.id ? 'rgba(155,93,255,0.4)' : 'var(--border)',
                }}>
                  <div style={{ height: 3, background: 'linear-gradient(90deg, var(--purple), var(--pink))' }}/>

                  {/* Row */}
                  <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1rem', color: '#fff',
                    }}>{analysis.results?.score}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{analysis.jobRole}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>{analysis.fileName}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, background: 'rgba(59,240,228,0.1)', border: '1px solid rgba(59,240,228,0.3)', color: 'var(--cyan)' }}>
                        {analysis.results?.match}% match
                      </span>

                      {/* Email button */}
                      <button
                        onClick={() => handleSendEmail(analysis)}
                        disabled={sending[analysis.id] || sentMap[analysis.id]}
                        style={{
                          padding: '6px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                          background: sentMap[analysis.id]
                            ? 'rgba(74,222,128,0.15)'
                            : 'rgba(155,93,255,0.12)',
                          color: sentMap[analysis.id] ? '#4ade80' : 'var(--purple)',
                          fontSize: '0.78rem', fontWeight: 700,
                          border: `1px solid ${sentMap[analysis.id] ? 'rgba(74,222,128,0.3)' : 'rgba(155,93,255,0.3)'}`,
                          transition: 'all 0.2s',
                        }}>
                        {sending[analysis.id] ? '⏳ Sending...' : sentMap[analysis.id] ? '✅ Sent!' : '📧 Email'}
                      </button>

                      {/* Expand button */}
                      <button
                        onClick={() => setExpanded(expanded === analysis.id ? null : analysis.id)}
                        style={{ padding: '6px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                        {expanded === analysis.id ? '▲ Less' : '▼ More'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expanded === analysis.id && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>

                        {/* Strengths */}
                        <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>✅ Strengths</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {analysis.results?.strengths?.map(s => (
                              <span key={s} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Missing skills */}
                        <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,140,66,0.06)', border: '1px solid rgba(255,140,66,0.2)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>❌ Missing Skills</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {analysis.results?.missingSkills?.map(s => (
                              <span key={s} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', background: 'rgba(255,140,66,0.1)', color: 'var(--orange)', border: '1px solid rgba(255,140,66,0.2)' }}>{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Rewrites */}
                        <div style={{ gridColumn: 'span 2', padding: '14px', borderRadius: 12, background: 'rgba(59,240,228,0.05)', border: '1px solid rgba(59,240,228,0.15)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>✍️ Rewrite Suggestions</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {analysis.results?.rewrites?.map(r => (
                              <div key={r.section} style={{ fontSize: '0.82rem' }}>
                                <span style={{ fontWeight: 700, color: 'var(--cyan)' }}>{r.section}: </span>
                                <span style={{ color: 'var(--text)' }}>{r.tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── SKILLS GAP TAB ── */}
          {activeTab === 'skills' && (
            <div className="card" style={{ padding: 28 }}>
              <div className="card-bar"/>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, marginTop: 4 }}>🛠️ Most Common Missing Skills</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 24 }}>Skills that appeared most often across all your analyses</div>

              {topSkills.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>No skill data yet. Run a few analyses first!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {topSkills.map(([skill, count], i) => {
                    const pct = Math.round((count / analyses.length) * 100)
                    const colors = ['var(--purple)', 'var(--pink)', 'var(--orange)', 'var(--cyan)', 'var(--blue)', 'var(--yellow)']
                    return (
                      <div key={skill}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{skill}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Missing in {count}/{analyses.length} analyses</span>
                        </div>
                        <div style={{ height: 10, borderRadius: 10, background: 'var(--surface2)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 10, width: `${pct}%`,
                            background: colors[i % colors.length],
                            transition: 'width 0.8s ease',
                          }}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}