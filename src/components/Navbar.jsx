import { Link, useLocation } from 'react-router-dom'
import MobileMenu from './MobileMenu'

export default function Navbar({ user, onLogin, onLogout }) {
  const location = useLocation()

  const links = [
    { to: '/',          label: '🔍 Analyzer',      active: 'var(--purple)', bg: 'rgba(155,93,255,0.1)' },
    { to: '/builder',   label: '📝 Resume Builder', active: 'var(--pink)',   bg: 'rgba(255,78,205,0.1)' },
    { to: '/test',      label: '🧠 Mock Test',      active: 'var(--cyan)',   bg: 'rgba(59,240,228,0.1)' },
    { to: '/dashboard', label: '📊 Dashboard',      active: 'var(--yellow)', bg: 'rgba(255,225,77,0.1)' },
    { to: '/career',    label: '🧭 Career Path',    active: 'var(--orange)', bg: 'rgba(255,140,66,0.1)' },
    { to: '/interview', label: '💬 Interview Practice', active: 'var(--green)', bg: 'rgba(72,187,120,0.1)' },
  ]
  

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="logo">
          <div className="logo-icon">✦</div>
          <span className="logo-text">ResumeIQ</span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
        {links.map(link => (
          <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: '0.82rem', fontWeight: 700, padding: '7px 12px', borderRadius: 10,
              color: location.pathname === link.to ? link.active : 'var(--muted)',
              background: location.pathname === link.to ? link.bg : 'transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              {link.label}
            </div>
          </Link>
        ))}
      </nav>

      {/* Desktop Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desktop-nav">
        {user ? (
          <>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--purple)' }}/>
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>
                {user.displayName?.[0] || user.email?.[0] || '?'}
              </div>
            )}
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>
              {user.displayName?.split(' ')[0] || 'User'}
            </span>
            <button onClick={onLogout} style={{
              background: 'rgba(255,78,205,0.1)', border: '1px solid rgba(255,78,205,0.3)',
              color: 'var(--pink)', padding: '7px 14px', borderRadius: 10,
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            }}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, var(--purple), var(--pink))',
              border: 'none', color: '#fff', padding: '9px 20px',
              borderRadius: 10, fontSize: '0.88rem', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(155,93,255,0.3)',
            }}>
              Sign In / Sign Up
            </button>
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <div className="mobile-nav">
        <MobileMenu user={user} onLogin={onLogin} onLogout={onLogout} />
      </div>

      {/* Responsive styles */}
      <style>{`
        .desktop-nav { display: flex; }
        .mobile-nav  { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav  { display: flex !important; }
        }
      `}</style>
    </header>
  )
}