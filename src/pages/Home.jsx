import { useState, useRef } from 'react'
import SkillRoadmap from '../components/SkillRoadmap'
import { extractTextFromPDF } from '../pdfWorker'
import { analyzeResume } from '../analyzeResume'
import { saveAnalysis, getUserAnalyses } from '../saveAnalysis'

const JOB_ROLES = [
  ['💻 Software Engineer', '📊 Data Analyst', '🤖 Data Scientist', '⚙️ DevOps Engineer', '🔐 Cybersecurity'],
  ['🎨 UI/UX Designer', '✏️ Graphic Designer', '📐 Product Designer', '🎬 Video Editor'],
  ['📣 Digital Marketing', '✍️ Content Writer', '🔍 SEO Specialist', '📱 Social Media Manager'],
  ['💰 Financial Analyst', '📈 Business Analyst', '🧾 Accountant', '🏦 Investment Banker'],
  ['👥 HR Manager', '🗂️ Product Manager', '📋 Project Manager', '🔧 Operations Manager'],
  ['🏥 Nurse', '📚 Teacher', '🤝 Sales Executive', '⚖️ Legal Counsel'],
]

export default function Home({ user }) {
  const [selectedJob, setSelectedJob]   = useState('')
  const [customJob, setCustomJob]       = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [dragover, setDragover]         = useState(false)
  const [analyzing, setAnalyzing]       = useState(false)
  const [analysisStep, setAnalysisStep] = useState('')
  const [results, setResults]           = useState(null)
  const [error, setError]               = useState('')
  const [history, setHistory]           = useState([])
  const [showHistory, setShowHistory]   = useState(false)
  const fileInputRef = useRef()
  const resultsRef   = useRef()

  const activeJob = customJob.trim() || selectedJob

  async function loadHistory(uid) {
    try {
      const data = await getUserAnalyses(uid)
      setHistory(data)
    } catch (e) { console.log('History error:', e) }
  }

  function handleFile(file) {
    if (!file) return
    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
      setError('Please upload a PDF, DOC or DOCX file.')
      return
    }
    setError('')
    setUploadedFile(file)
  }

  function removeFile() {
    setUploadedFile(null)
    fileInputRef.current.value = ''
  }

  function onDrop(e) {
    e.preventDefault(); setDragover(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function runAnalyze() {
    if (!user) { setError('Please sign in first!'); return }
    if (!activeJob || !uploadedFile) return
    setAnalyzing(true); setError(''); setResults(null)
    try {
      setAnalysisStep('📄 Reading your resume...')
      const resumeText = await extractTextFromPDF(uploadedFile)
      if (!resumeText || resumeText.length < 50)
        throw new Error('Could not read text from your resume. Make sure it is a text-based PDF.')

      setAnalysisStep('🤖 AI is analyzing your resume...')
      const analysisResult = await analyzeResume(resumeText, activeJob)

      setAnalysisStep('💾 Saving your results...')
      await saveAnalysis(user.uid, activeJob, uploadedFile.name, analysisResult)

      setResults(analysisResult)
      loadHistory(user.uid)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setAnalyzing(false); setAnalysisStep('')
    }
  }

  const circumference = 220
  const scoreOffset   = results ? circumference - (results.score / 100) * circumference : circumference

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">✦ AI-Powered Resume Analysis</div>
        <h1>Your Resume,<span className="gradient-text">Supercharged.</span></h1>
        <p>Upload your resume, pick your dream job — get instant AI feedback on score, match %, missing skills, and rewrites.</p>
        <div className="stats">
          <div className="stat"><div className="stat-num">98%</div><div className="stat-label">Accuracy Rate</div></div>
          <div className="stat-divider"/>
          <div className="stat"><div className="stat-num">2x</div><div className="stat-label">Interview Chances</div></div>
          <div className="stat-divider"/>
          <div className="stat"><div className="stat-num">30s</div><div className="stat-label">Analysis Time</div></div>
        </div>
      </section>

      {/* SIGN IN PROMPT */}
      {!user && (
        <div className="main-card" style={{ marginBottom: 0 }}>
          <div className="card">
            <div className="card-bar"/>
            <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔐</div>
              <div className="card-title" style={{ marginBottom: 8 }}>Sign in to Analyze Your Resume</div>
              <div className="card-sub">Your results will be saved to your account</div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY PANEL */}
      {showHistory && user && (
        <div className="history-panel">
          <div className="history-header">
            <h3>📋 Your Analysis History</h3>
            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
          </div>
          {history.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px' }}>No analyses yet!</p>
          ) : history.map(item => (
            <div key={item.id} className="history-item"
              onClick={() => { setResults(item.results); setShowHistory(false); setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.jobRole}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>{item.fileName}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--purple)', fontWeight: 700 }}>Score: {item.results?.score}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--pink)', fontWeight: 700 }}>Match: {item.results?.match}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MAIN CARD */}
      {user && (
        <div className="main-card">
          <div className="card">
            <div className="card-bar"/>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div className="card-title">Analyze Your Resume</div>
                <button onClick={() => { setShowHistory(!showHistory); loadHistory(user.uid) }}
                  style={{ background: 'rgba(155,93,255,0.1)', border: '1px solid rgba(155,93,255,0.3)', color: 'var(--purple)', padding: '7px 14px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  📋 History ({history.length})
                </button>
              </div>
              <div className="card-sub">Hello {user.displayName?.split(' ')[0]}! 👋 Ready to supercharge your resume?</div>

              {/* STEP 1 */}
              <div className="step-block">
                <div className="step-num s1">1</div>
                <div className="step-content">
                  <span className="step-label">Select Job Role</span>
                  <div className="job-categories">
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
                  />
                  {activeJob && <div className="selected-job-badge">✦ Selected: {activeJob}</div>}
                </div>
              </div>

              <div className="step-divider"/>

              {/* STEP 2 */}
              <div className="step-block">
                <div className="step-num s2">2</div>
                <div className="step-content">
                  <span className="step-label">Upload Your Resume</span>
                  {!uploadedFile ? (
                    <div className={`upload-zone ${dragover ? 'dragover' : ''}`}
                      onDragOver={e => { e.preventDefault(); setDragover(true) }}
                      onDragLeave={() => setDragover(false)}
                      onDrop={onDrop}>
                      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => handleFile(e.target.files[0])}/>
                      <div className="upload-icon">📄</div>
                      <div className="upload-title">Drop your resume here</div>
                      <div className="upload-sub">or <span>click to browse</span> · PDF, DOC, DOCX</div>
                    </div>
                  ) : (
                    <div className="file-selected">
                      <div className="file-icon">📋</div>
                      <div>
                        <div className="file-name">{uploadedFile.name}</div>
                        <div className="file-size">{(uploadedFile.size / 1024).toFixed(0)} KB</div>
                      </div>
                      <button className="file-remove" onClick={removeFile}>✕</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="step-divider"/>

              {/* STEP 3 */}
              <div className="step-block">
                <div className="step-num s3">3</div>
                <div className="step-content">
                  <span className="step-label">Run AI Analysis</span>
                  {error && <div className="error-box">⚠️ {error}</div>}
                  {analyzing && <div className="analyzing-box">⏳ {analysisStep}</div>}
                  <button className="btn-analyze"
                    disabled={!activeJob || !uploadedFile || analyzing}
                    onClick={runAnalyze}>
                    {analyzing ? analysisStep || '⏳ Analyzing...' : '✦ Analyze My Resume ✦'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {results && (
        <div className="results-section" ref={resultsRef}>
          <div className="results-title">
            <div className="hero-tag" style={{ marginBottom: 12 }}>✦ Analysis Complete</div>
            <h2>Your <span>Resume Report</span></h2>
          </div>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9b5dff"/>
                <stop offset="100%" stopColor="#ff4ecd"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="results-grid">
            <div className="result-card score">
              <div className="result-label"><div className="dot"/>Resume Score</div>
              <div className="score-ring-wrap">
                <div className="score-ring">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--surface2)" strokeWidth="8"/>
                    <circle cx="40" cy="40" r="35" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={circumference} strokeDashoffset={scoreOffset}
                      style={{ transition: 'stroke-dashoffset 1s ease' }}/>
                  </svg>
                  <div className="score-num">{results.score}</div>
                </div>
                <div>
                  <div className="score-big">{results.scoreLabel}</div>
                  <div className="score-desc-text">{results.scoreDesc}</div>
                </div>
              </div>
            </div>
            <div className="result-card match">
              <div className="result-label"><div className="dot"/>Job Match</div>
              <div className="match-num">{results.match}%</div>
              <div className="match-bar-bg">
                <div className="match-bar-fill" style={{ width: `${results.match}%` }}/>
              </div>
              <div className="match-sub">{results.matchDesc}</div>
            </div>
            {results.strengths && (
              <div className="result-card score" style={{ gridColumn: 'span 2' }}>
                <div className="result-label"><div className="dot"/>✅ Your Strengths</div>
                <div className="skills-list">
                  {results.strengths.map(s => (
                    <div key={s} className="skill-tag" style={{ background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.25)', color: '#4ade80' }}>{s}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="result-card skills">
              <div className="result-label"><div className="dot"/>Missing Skills</div>
              <div className="skills-list">
                {results.missingSkills?.map(s => <div key={s} className="skill-tag">{s}</div>)}
              </div>
            </div>
 <div className="result-card rewrite">
              <div className="result-label"><div className="dot"/>Rewrite Suggestions</div>
              <div className="rewrite-list">
                {results.rewrites?.map(r => (
                  <div key={r.section} className="rewrite-item">
                    <span className="rewrite-section">{r.section}</span>
                    {r.tip}
                  </div>
                ))}
              </div>
            </div>

            {/* SKILL ROADMAP */}
            <SkillRoadmap
              missingSkills={results.missingSkills}
              jobRole={activeJob}
            />

          </div>
        </div>
      )}
    </>
  )
}