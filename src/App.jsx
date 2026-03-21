import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from './firebase'
import Navbar from './components/Navbar'
import ChatBot from './components/ChatBot'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Home from './pages/Home'
import ResumeBuilder from './pages/ResumeBuilder'
import MockTest from './pages/MockTest'
import Dashboard from './pages/Dashboard'
import CareerPath from './pages/CareerPath'
import InterviewPractice from './pages/InterviewPractice'
import './App.css'

// ── Inner app with access to useLocation ──
function AppContent({ user, handleLogin, handleLogout }) {
  const location = useLocation()
  const isLanding = location.pathname === '/landing' || (location.pathname === '/' && !user)

  return (
    <>
      {/* Show Navbar on all pages except landing and auth */}
      {!isLanding && location.pathname !== '/auth' && (
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      )}

      <Routes>
        {/* Landing page — shown to non-logged users at / */}
        <Route path="/" element={
          user ? <Home user={user} /> : <Landing user={user} />
        }/>

        {/* Dedicated landing route */}
        <Route path="/landing" element={<Landing user={user} />} />

        {/* Auth page */}
        <Route path="/auth" element={
          user ? <Navigate to="/" replace /> : <Auth onLogin={handleLogin} />
        }/>

        {/* Protected pages */}
        <Route path="/analyzer"  element={user ? <Home user={user} />             : <Navigate to="/auth" replace />} />
        <Route path="/builder"   element={user ? <ResumeBuilder user={user} />    : <Navigate to="/auth" replace />} />
        <Route path="/test"      element={user ? <MockTest user={user} />          : <Navigate to="/auth" replace />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} />         : <Navigate to="/auth" replace />} />
        <Route path="/career"    element={user ? <CareerPath user={user} />        : <Navigate to="/auth" replace />} />
        <Route path="/interview" element={user ? <InterviewPractice user={user} /> : <Navigate to="/auth" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ChatBot — hide on landing and auth */}
      {!isLanding && location.pathname !== '/auth' && user && <ChatBot />}

      {/* Mobile warning — hide on landing */}
      {!isLanding && (
        <div className="mobile-warning" style={{
          display: 'none', position: 'fixed', inset: 0, zIndex: 9999,
          background: 'var(--bg)', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32, textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🖥️</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>Best on Desktop</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.95rem' }}>
            ResumeIQ is optimized for desktop use.<br/>
            Please open this site on your laptop or PC!
          </p>
          <div style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, var(--purple), var(--pink))', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
            💻 Open on Desktop
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 16 }}>Mobile version coming soon! 🚀</p>
        </div>
      )}
    </>
  )
}

// ── 404 Page ──
function NotFound() {
  return (
    <div style={{
      position: 'relative', zIndex: 2,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', textAlign: 'center', padding: '40px 24px',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: 16 }}>😕</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>404</h1>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 32, maxWidth: 400 }}>
        Oops! The page you're looking for doesn't exist. Let's get you back on track!
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 28px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, var(--purple), var(--pink))',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(155,93,255,0.3)',
          }}>← Go Home</button>
        </a>
        <a href="/landing" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 28px', borderRadius: 12,
            border: '1px solid var(--border)', background: 'var(--surface)',
            color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
          }}>View Features</button>
        </a>
      </div>
    </div>
  )
}

// ── Main App ──
export default function App() {
  const [user, setUser]               = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u && !u.emailVerified && u.providerData[0]?.providerId === 'password') {
        await signOut(auth)
        setUser(null)
      } else {
        setUser(u)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  async function handleLogin() {
    try { await signInWithPopup(auth, provider) }
    catch (e) { console.error('Login failed:', e) }
  }

  async function handleLogout() {
    await signOut(auth)
    setUser(null)
  }

  if (authLoading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontSize: '1.2rem', color: 'var(--muted)',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'linear-gradient(135deg, var(--purple), var(--pink))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', boxShadow: '0 0 24px rgba(155,93,255,0.4)',
        animation: 'pulse 1.5s ease infinite',
      }}>✦</div>
      Loading ResumeIQ...
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }`}</style>
    </div>
  )

  return (
    <BrowserRouter>
      <div className="bg-orbs">
        <div className="orb orb-1"/><div className="orb orb-2"/>
        <div className="orb orb-3"/><div className="orb orb-4"/>
      </div>
      <AppContent user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
    </BrowserRouter>
  )
}