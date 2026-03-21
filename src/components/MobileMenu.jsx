import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function MobileMenu({ user, onLogin, onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: '/',          label: '🔍 Analyzer',       color: 'var(--purple)' },
    { to: '/builder',   label: '📝 Resume Builder',  color: 'var(--pink)'   },
    { to: '/test',      label: '🧠 Mock Test',       color: 'var(--cyan)'   },
    { to: '/dashboard', label: '📊 Dashboard',       color: 'var(--yellow)' },
    { to: '/career',    label: '🧭 Career Path',     color: 'var(--orange)' },
    { to: '/interview', label: '🎙️ Interview Practice', color: 'var(--pink)' },
  ]

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', gap: 4,
          transition: 'all 0.2s',
        }}
      >
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 20, height: 2, borderRadius: 2,
            background: 'var(--text)',
            transition: 'all 0.3s',
            transform: open
              ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
              : i === 1 ? 'opacity: 0'
              : 'rotate(-45deg) translate(4px, -4px)'
              : 'none',
            opacity: open && i === 1 ? 0 : 1,
          }}/>
        ))}
      </button>

      {/* Overlay */}
    {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            width: '100vw', height: '100vh',
          }}
        />
      )}

      {/* Slide-in menu */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 280, zIndex: 100,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        padding: '24px',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex', flexDirection: 'column', gap: 8,
        boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--purple), var(--pink))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem',
            }}>✦</div>
            <span style={{
              fontWeight: 800, fontSize: '1.1rem',
              background: 'linear-gradient(90deg, var(--purple), var(--pink))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>ResumeIQ</span>
          </div>
          <button onClick={() => setOpen(false)} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
            color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 700,
          }}>✕</button>
        </div>

        {/* User info */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px', borderRadius: 14,
            background: 'rgba(155,93,255,0.08)',
            border: '1px solid rgba(155,93,255,0.2)',
            marginBottom: 8,
          }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid var(--purple)' }}/>
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>
                {user.displayName?.[0] || user.email?.[0] || '?'}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user.displayName || 'User'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{user.email}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '13px 16px', borderRadius: 12,
                background: location.pathname === link.to ? `${link.color}18` : 'transparent',
                border: `1px solid ${location.pathname === link.to ? `${link.color}40` : 'transparent'}`,
                color: location.pathname === link.to ? link.color : 'var(--text)',
                fontWeight: 700, fontSize: '0.92rem',
                transition: 'all 0.2s',
              }}>
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {user ? (
            <button onClick={onLogout} style={{
              width: '100%', padding: '13px', borderRadius: 12,
              border: '1px solid rgba(255,78,205,0.3)',
              background: 'rgba(255,78,205,0.08)',
              color: 'var(--pink)', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
            }}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(155,93,255,0.3)',
              }}>
                Sign In / Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}