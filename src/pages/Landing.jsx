import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🔍', title: 'Resume Analyzer',
    desc: 'Upload your resume and get an instant AI-powered score, job match percentage, strengths and detailed feedback.',
    color: 'var(--purple)', bg: 'rgba(155,93,255,0.08)', border: 'rgba(155,93,255,0.2)',
  },
  {
    icon: '📝', title: 'Resume Builder',
    desc: 'Build a professional resume from scratch with 4 beautiful templates and download as PDF instantly.',
    color: 'var(--pink)', bg: 'rgba(255,78,205,0.08)', border: 'rgba(255,78,205,0.2)',
  },
  {
    icon: '🧠', title: 'Mock Interview Test',
    desc: '10 AI-generated MCQ questions based on real interview topics. Get your score and areas to improve.',
    color: 'var(--cyan)', bg: 'rgba(59,240,228,0.08)', border: 'rgba(59,240,228,0.2)',
  },
  {
    icon: '🎙️', title: 'Interview Q&A Practice',
    desc: 'Answer real interview questions and get instant AI feedback — score, model answer and pro tips.',
    color: 'var(--blue)', bg: 'rgba(78,140,255,0.08)', border: 'rgba(78,140,255,0.2)',
  },
  {
    icon: '🧭', title: 'Career Path Generator',
    desc: 'Tell us your dream role and get a complete month-by-month roadmap with courses, projects and tools.',
    color: 'var(--orange)', bg: 'rgba(255,140,66,0.08)', border: 'rgba(255,140,66,0.2)',
  },
  {
    icon: '🎯', title: 'Skill Roadmap',
    desc: 'Get personalized learning resources for every missing skill — verified free courses from YouTube, freeCodeCamp and more.',
    color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)',
  },
  {
    icon: '💬', title: 'AI Career Assistant',
    desc: 'Chat with your personal AI career coach anytime — get resume tips, skill suggestions and career advice instantly.',
    color: 'var(--yellow)', bg: 'rgba(255,225,77,0.08)', border: 'rgba(255,225,77,0.2)',
  },
  {
    icon: '📊', title: 'Progress Dashboard',
    desc: 'Track your resume score over time, see your most common skill gaps and monitor your career growth.',
    color: 'var(--pink)', bg: 'rgba(255,78,205,0.08)', border: 'rgba(255,78,205,0.2)',
  },
]

const STEPS = [
  {
    num: '01', icon: '📄',
    title: 'Upload Your Resume',
    desc: 'Upload your existing resume as a PDF or build one from scratch using our Resume Builder with 4 professional templates.',
    color: 'var(--purple)',
  },
  {
    num: '02', icon: '🎯',
    title: 'Select Your Job Role',
    desc: 'Pick from 20+ job roles across Tech, Marketing, Finance, Design, HR and more — or type your own custom role.',
    color: 'var(--pink)',
  },
  {
    num: '03', icon: '🚀',
    title: 'Get Your AI Report',
    desc: 'Receive a detailed report with your resume score, job match %, missing skills, rewrite suggestions and a full learning roadmap.',
    color: 'var(--cyan)',
  },
]

const STATS = [
  { num: '8+',    label: 'AI Features',        icon: '✦' },
  { num: '20+',   label: 'Job Roles Supported', icon: '💼' },
  { num: '100%',  label: 'Free to Use',         icon: '🎉' },
  { num: '30s',   label: 'Analysis Time',       icon: '⚡' },
]

export default function Landing({ user }) {
  return (
    <div style={{ position: 'relative', zIndex: 2, overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 60px',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(13,13,20,0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--purple), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: '0 0 16px rgba(155,93,255,0.4)',
          }}>✦</div>
          <span style={{
            fontSize: '1.4rem', fontWeight: 800,
            background: 'linear-gradient(90deg, var(--purple), var(--pink), var(--orange))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>ResumeIQ</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '10px 24px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(155,93,255,0.3)',
              }}>Go to App →</button>
            </Link>
          ) : (
            <>
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '9px 20px', borderRadius: 10,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
                }}>Sign In</button>
              </Link>
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '10px 24px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                  color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(155,93,255,0.3)',
                }}>Get Started Free →</button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '100px 24px 80px', maxWidth: 900, margin: '0 auto' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 20px', borderRadius: 20, marginBottom: 32,
          border: '1px solid rgba(155,93,255,0.3)',
          background: 'rgba(155,93,255,0.08)',
          fontSize: '0.82rem', fontWeight: 700, color: 'var(--purple)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--purple)', boxShadow: '0 0 8px var(--purple)', display: 'inline-block' }}/>
          AI-Powered Career Platform · 100% Free
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 900, lineHeight: 1.0,
          letterSpacing: '-0.04em',
          marginBottom: 28,
        }}>
          Land Your
          <span style={{
            display: 'block',
            background: 'linear-gradient(90deg, var(--pink), var(--orange), var(--yellow))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Dream Job</span>
          Faster.
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          color: 'var(--muted)', lineHeight: 1.7,
          maxWidth: 600, margin: '0 auto 48px',
        }}>
          ResumeIQ analyzes your resume, prepares you for interviews, builds your career roadmap — all powered by AI, completely free.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
          <Link to={user ? '/' : '/auth'} style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 40px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, var(--purple), var(--pink), var(--orange))',
              color: '#fff', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(155,93,255,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(155,93,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(155,93,255,0.4)' }}
            >
              ✦ {user ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
          </Link>
          <a href="#features" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 40px', borderRadius: 16,
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text)', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(155,93,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              See Features ↓
            </button>
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 48,
          flexWrap: 'wrap',
          padding: '32px 48px',
          borderRadius: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.4rem', fontWeight: 900,
                background: [
                  'linear-gradient(135deg, var(--purple), var(--pink))',
                  'linear-gradient(135deg, var(--pink), var(--orange))',
                  'linear-gradient(135deg, var(--cyan), var(--blue))',
                  'linear-gradient(135deg, var(--orange), var(--yellow))',
                ][i],
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.num}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(59,240,228,0.3)', background: 'rgba(59,240,228,0.06)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--cyan)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            ✦ Simple Process
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
            How It{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--cyan), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            Get from resume upload to job-ready in 3 simple steps
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              position: 'relative',
              padding: '32px 28px',
              borderRadius: 24,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${step.color}40` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: step.color }}/>

              {/* Step number */}
              <div style={{
                fontSize: '3.5rem', fontWeight: 900, lineHeight: 1,
                color: 'rgba(255,255,255,0.04)',
                position: 'absolute', top: 16, right: 20,
                fontFamily: 'monospace',
              }}>{step.num}</div>

              <div style={{
                width: 56, height: 56, borderRadius: 16, marginBottom: 20,
                background: `${step.color}15`,
                border: `1px solid ${step.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
              }}>{step.icon}</div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10, color: step.color }}>{step.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', right: -16, top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10, fontSize: '1.2rem', color: 'var(--muted)',
                }}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(255,140,66,0.3)', background: 'rgba(255,140,66,0.06)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--orange)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            ✦ Everything You Need
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
            8 Powerful{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--orange), var(--yellow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Features</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            Everything you need to go from job seeker to job getter
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              padding: '24px 20px',
              borderRadius: 20,
              background: 'var(--surface)',
              border: `1px solid var(--border)`,
              transition: 'all 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.border; e.currentTarget.style.background = f.bg; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 16,
                background: f.bg, border: `1px solid ${f.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: f.color, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          padding: '60px 48px', borderRadius: 32, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(155,93,255,0.15), rgba(255,78,205,0.1), rgba(255,140,66,0.08))',
          border: '1px solid rgba(155,93,255,0.2)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,93,255,0.15), transparent)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,78,205,0.1), transparent)', pointerEvents: 'none' }}/>

          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Ready to Land Your
            <span style={{ background: 'linear-gradient(90deg, var(--pink), var(--orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Dream Job?</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Join thousands of job seekers using ResumeIQ to supercharge their careers. It's completely free — no credit card needed!
          </p>

          <Link to={user ? '/' : '/auth'} style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '18px 48px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, var(--purple), var(--pink), var(--orange))',
              color: '#fff', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(155,93,255,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ✦ {user ? 'Go to App' : 'Start for Free — No Sign Up Needed'}
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '40px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, var(--purple), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(90deg, var(--purple), var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeIQ</span>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Analyzer', to: '/' },
            { label: 'Resume Builder', to: '/builder' },
            { label: 'Mock Test', to: '/test' },
            { label: 'Career Path', to: '/career' },
            { label: 'Interview Practice', to: '/interview' },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{ textDecoration: 'none', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >{l.label}</Link>
          ))}
        </div>
      </footer>

    </div>
  )
}