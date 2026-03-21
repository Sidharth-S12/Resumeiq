import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

export default function Auth({ onLogin }) {
  const [mode, setMode]         = useState('signin')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const features = [
    { icon: '🔍', title: 'Resume Analyzer',    desc: 'AI-powered resume score & feedback' },
    { icon: '📝', title: 'Resume Builder',      desc: 'Build professional resumes in minutes' },
    { icon: '🧠', title: 'Mock Interview Test', desc: '10 MCQ questions based on real interviews' },
    { icon: '🧭', title: 'Career Path',         desc: 'Month-by-month personalized roadmap' },
    { icon: '🎯', title: 'Skill Roadmap',       desc: 'Free verified learning resources' },
    { icon: '💬', title: 'AI Career Assistant', desc: 'Chat with your personal career coach' },
  ]

  function resetForm() {
    setError(''); setSuccess('')
    setName(''); setEmail(''); setPassword(''); setConfirm('')
  }

  function switchMode(m) { setMode(m); resetForm() }

  async function handleGoogle() {
    setLoading(true); setError('')
    try { await onLogin(); navigate('/') }
    catch (e) { setError('Google sign in failed. Please try again.') }
    setLoading(false)
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!name.trim())         return setError('Please enter your name.')
    if (password.length < 6)  return setError('Password must be at least 6 characters.')
    if (password !== confirm)  return setError('Passwords do not match.')
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name.trim() })
      await sendEmailVerification(result.user)
      setSuccess('Account created! Please check your email to verify your account before signing in.')
      switchMode('signin')
    } catch (e) { setError(friendlyError(e.code)) }
    setLoading(false)
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (!result.user.emailVerified) {
        await auth.signOut()
        setError('Please verify your email before signing in. Check your inbox for the verification link.')
        setLoading(false)
        return
      }
      navigate('/')
    } catch (e) { setError(friendlyError(e.code)) }
    setLoading(false)
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!email) return setError('Please enter your email address.')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess('Password reset email sent! Check your inbox and follow the link to reset your password.')
    } catch (e) { setError(friendlyError(e.code)) }
    setLoading(false)
  }

  function friendlyError(code) {
    const errors = {
      'auth/email-already-in-use':   'This email is already registered. Try signing in instead.',
      'auth/invalid-email':          'Please enter a valid email address.',
      'auth/weak-password':          'Password must be at least 6 characters.',
      'auth/user-not-found':         'No account found with this email.',
      'auth/wrong-password':         'Incorrect password. Try again or reset your password.',
      'auth/too-many-requests':      'Too many failed attempts. Please try again later.',
      'auth/invalid-credential':     'Invalid email or password. Please try again.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    }
    return errors[code] || 'Something went wrong. Please try again.'
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative', zIndex: 2,
      display: 'flex',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* ── LEFT SIDE — Branding (hidden on mobile) ── */}
      <div className="auth-left" style={{
        flex: 1, padding: '48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderRight: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)',
        minWidth: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--purple), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', boxShadow: '0 0 24px rgba(155,93,255,0.4)',
          }}>✦</div>
          <span style={{
            fontSize: '1.8rem', fontWeight: 800,
            background: 'linear-gradient(90deg, var(--purple), var(--pink), var(--orange))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>ResumeIQ</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
          Your AI-Powered
          <span style={{ display: 'block', background: 'linear-gradient(90deg, var(--pink), var(--orange), var(--yellow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Career Partner
          </span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 40, maxWidth: 400 }}>
          From resume building to interview prep — ResumeIQ gives you everything you need to land your dream job.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {features.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
          {[{ num: '100%', label: 'Free to use' }, { num: 'AI', label: 'Powered' }, { num: '6+', label: 'Features' }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--cyan), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT SIDE — Auth Form ── */}
      <div className="auth-right" style={{
        flex: 1, minWidth: 0, width: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        overflowY: 'auto', padding: '40px 24px',
      }}>
        {/* Mobile logo — only shown on mobile */}
        <div className="auth-mobile-logo" style={{
          display: 'none',
          alignItems: 'center', gap: 10,
          marginBottom: 32, alignSelf: 'flex-start',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--purple), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✦</div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, var(--purple), var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeIQ</span>
        </div>

        <div style={{ width: '100%', maxWidth: 400, boxSizing: 'border-box' }}>

          {/* Mode tabs */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 14, padding: 4, border: '1px solid var(--border)', marginBottom: 28 }}>
              {['signin', 'signup'].map(m => (
                <button key={m} onClick={() => switchMode(m)} style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  background: mode === m ? 'linear-gradient(135deg, var(--purple), var(--pink))' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--muted)',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  boxShadow: mode === m ? '0 4px 12px rgba(155,93,255,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
              {mode === 'signin' ? 'Welcome back! 👋' : mode === 'signup' ? 'Get started free! 🚀' : 'Reset Password 🔑'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              {mode === 'signin' ? 'Sign in to your ResumeIQ account.'
               : mode === 'signup' ? 'Create your free account today.'
               : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {/* Messages */}
          {error   && <div className="error-box" style={{ marginBottom: 14 }}>⚠️ {error}</div>}
          {success && <div style={{ padding: '12px 14px', borderRadius: 12, marginBottom: 14, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', fontSize: '0.83rem', fontWeight: 500 }}>✅ {success}</div>}

          {/* Google button */}
          {mode !== 'forgot' && (
            <>
              <button onClick={handleGoogle} disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: 14,
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'all 0.2s', marginBottom: 18,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap', flexWrap: 'nowrap',
                boxSizing: 'border-box',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
              </div>
            </>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Full Name"       type="text"     value={name}     onChange={setName}     placeholder="Sidharth S" />
              <Field label="Email"           type="email"    value={email}    onChange={setEmail}    placeholder="you@gmail.com" />
              <Field label="Password"        type={showPass ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="Min 6 characters"
                suffix={<button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtnStyle}>{showPass ? '🙈' : '👁️'}</button>} />
              <Field label="Confirm Password" type={showPass ? 'text' : 'password'} value={confirm} onChange={setConfirm} placeholder="Repeat password" />
              <button type="submit" disabled={loading} className="btn-analyze" style={{ marginTop: 4 }}>
                {loading ? '⏳ Creating account...' : '🚀 Create Account'}
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
                📧 A verification email will be sent. Please verify before signing in.
              </p>
            </form>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Email"    type="email"    value={email}    onChange={setEmail}    placeholder="you@gmail.com" />
              <Field label="Password" type={showPass ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="Your password"
                suffix={<button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtnStyle}>{showPass ? '🙈' : '👁️'}</button>} />
              <div style={{ textAlign: 'right', marginTop: -4 }}>
                <button type="button" onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', color: 'var(--purple)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-analyze" style={{ marginTop: 4 }}>
                {loading ? '⏳ Signing in...' : '🔓 Sign In'}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@gmail.com" />
              <button type="submit" disabled={loading} className="btn-analyze"
                style={{ background: 'linear-gradient(135deg, var(--cyan), var(--blue))', boxShadow: '0 8px 24px rgba(59,240,228,0.25)' }}>
                {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
              </button>
              <button type="button" onClick={() => switchMode('signin')}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
                ← Back to Sign In
              </button>
            </form>
          )}

          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginTop: 20 }}>
            ResumeIQ is completely free to use. 🎉<br/>
            Your data is secured by Firebase & Google.
          </p>
        </div>
      </div>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        .auth-left { display: flex; }
        .auth-right { flex: 1; }
        .auth-mobile-logo { display: none !important; }

        @media (max-width: 768px) {
          .auth-left { display: none !important; }
          .auth-mobile-logo { display: flex !important; }
          .auth-right {
            padding: 32px 20px !important;
            justify-content: flex-start !important;
            padding-top: 44px !important;
          }
        }
      `}</style>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder, suffix }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type} value={value} required
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', padding: suffix ? '10px 44px 10px 14px' : '10px 14px',
            borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--surface2)', color: '#ffffff',
            fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.2s', boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(155,93,255,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {suffix && <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>{suffix}</div>}
      </div>
    </div>
  )
}

const eyeBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: '0.9rem', padding: 2, lineHeight: 1,
}