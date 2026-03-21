// ── TEMPLATE 1: Classic (Dark Navy Header) ──
export function ClassicTemplate({ data }) {
  const { personal, summary, experience, education, skills, projects } = data
  return (
    <div id="resume-preview" style={{ background: '#fff', color: '#1a1a1a', fontFamily: "'Georgia', serif", fontSize: '0.85rem', lineHeight: 1.6, minHeight: 600, borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
      {/* Header */}
      <div style={{ background: '#1a1a2e', color: '#fff', padding: '28px 36px' }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>{personal.name || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <span>📞 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
          {personal.portfolio && <span>🌐 {personal.portfolio}</span>}
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '28px 36px' }}>
        {summary && <ClassicSection title="Professional Summary"><p style={{ margin: 0, color: '#333', textAlign: 'justify' }}>{summary}</p></ClassicSection>}
        {experience?.some(e => e.company || e.role) && (
          <ClassicSection title="Work Experience">
            {experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e' }}>{exp.role}</div>
                    <div style={{ color: '#555', fontSize: '0.82rem', fontStyle: 'italic' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#fff', background: '#1a1a2e', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? ' – Present' : ''}
                  </div>
                </div>
                {exp.description && <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>{exp.description.split('\n').filter(Boolean).map((line, j) => <li key={j} style={{ color: '#333', marginBottom: 3, fontSize: '0.83rem' }}>{line.replace(/^[•\-]\s*/, '')}</li>)}</ul>}
              </div>
            ))}
          </ClassicSection>
        )}
        {education?.some(e => e.school || e.degree) && (
          <ClassicSection title="Education">
            {education.filter(e => e.school || e.degree).map((edu, i) => (
              <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div style={{ color: '#555', fontSize: '0.82rem', fontStyle: 'italic' }}>{edu.school}</div>
                  {edu.grade && <div style={{ fontSize: '0.78rem', color: '#666' }}>Grade: {edu.grade}</div>}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fff', background: '#1a1a2e', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{edu.year}</div>
              </div>
            ))}
          </ClassicSection>
        )}
        {skills?.length > 0 && (
          <ClassicSection title="Technical Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills.map((s, i) => <span key={i} style={{ padding: '4px 12px', borderRadius: 4, background: '#f0f0f8', color: '#1a1a2e', fontSize: '0.78rem', fontWeight: 600, border: '1px solid #ddd', fontFamily: 'monospace' }}>{s}</span>)}
            </div>
          </ClassicSection>
        )}
        {projects?.some(p => p.name) && (
          <ClassicSection title="Projects">
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{proj.name}</div>
                  {proj.link && <span style={{ fontSize: '0.75rem', color: '#4e8cff' }}>🔗 {proj.link}</span>}
                </div>
                {proj.tech && <div style={{ fontSize: '0.78rem', color: '#666', fontStyle: 'italic' }}>Tech: {proj.tech}</div>}
                {proj.description && <p style={{ margin: '4px 0 0', color: '#333', fontSize: '0.83rem' }}>{proj.description}</p>}
              </div>
            ))}
          </ClassicSection>
        )}
      </div>
    </div>
  )
}

function ClassicSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <h2 style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a1a2e', margin: 0, whiteSpace: 'nowrap' }}>{title}</h2>
        <div style={{ flex: 1, height: 2, background: '#1a1a2e', opacity: 0.15 }}/>
      </div>
      {children}
    </div>
  )
}

// ── TEMPLATE 2: Modern (Sidebar Layout) ──
export function ModernTemplate({ data }) {
  const { personal, summary, experience, education, skills, projects } = data
  return (
    <div id="resume-preview" style={{ background: '#fff', color: '#1a1a1a', fontFamily: "'Arial', sans-serif", fontSize: '0.85rem', lineHeight: 1.6, minHeight: 600, borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', display: 'grid', gridTemplateColumns: '200px 1fr' }}>
      {/* Sidebar */}
      <div style={{ background: '#2d6a4f', color: '#fff', padding: '28px 20px' }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 16px', border: '3px solid rgba(255,255,255,0.4)' }}>
          {personal.name?.[0] || '?'}
        </div>
        <h1 style={{ fontSize: '1rem', fontWeight: 800, textAlign: 'center', margin: '0 0 20px', color: '#fff', lineHeight: 1.3 }}>{personal.name || 'Your Name'}</h1>
        <SideSection title="Contact">
          {personal.email    && <div style={sideItemStyle}>✉ {personal.email}</div>}
          {personal.phone    && <div style={sideItemStyle}>📞 {personal.phone}</div>}
          {personal.location && <div style={sideItemStyle}>📍 {personal.location}</div>}
          {personal.linkedin && <div style={sideItemStyle}>🔗 {personal.linkedin}</div>}
        </SideSection>
        {skills?.length > 0 && (
          <SideSection title="Skills">
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: '0.78rem', marginBottom: 2, color: '#fff' }}>{s}</div>
                <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${70 + (i % 3) * 10}%`, background: '#95d5b2', borderRadius: 4 }}/>
                </div>
              </div>
            ))}
          </SideSection>
        )}
      </div>
      {/* Main content */}
      <div style={{ padding: '28px 28px' }}>
        {summary && <ModernSection title="About Me" color="#2d6a4f"><p style={{ margin: 0, color: '#444' }}>{summary}</p></ModernSection>}
        {experience?.some(e => e.company || e.role) && (
          <ModernSection title="Experience" color="#2d6a4f">
            {experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} style={{ marginBottom: 16, paddingLeft: 12, borderLeft: '3px solid #2d6a4f' }}>
                <div style={{ fontWeight: 700, color: '#2d6a4f' }}>{exp.role}</div>
                <div style={{ fontSize: '0.82rem', color: '#666' }}>{exp.company} {exp.startDate && `| ${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ' – Present'}`}</div>
                {exp.description && <ul style={{ margin: '6px 0 0 14px', padding: 0 }}>{exp.description.split('\n').filter(Boolean).map((line, j) => <li key={j} style={{ fontSize: '0.82rem', color: '#444', marginBottom: 2 }}>{line.replace(/^[•\-]\s*/, '')}</li>)}</ul>}
              </div>
            ))}
          </ModernSection>
        )}
        {education?.some(e => e.school || e.degree) && (
          <ModernSection title="Education" color="#2d6a4f">
            {education.filter(e => e.school || e.degree).map((edu, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: '3px solid #2d6a4f' }}>
                <div style={{ fontWeight: 700, color: '#2d6a4f' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ fontSize: '0.82rem', color: '#666' }}>{edu.school} {edu.year && `| ${edu.year}`}</div>
                {edu.grade && <div style={{ fontSize: '0.78rem', color: '#888' }}>Grade: {edu.grade}</div>}
              </div>
            ))}
          </ModernSection>
        )}
        {projects?.some(p => p.name) && (
          <ModernSection title="Projects" color="#2d6a4f">
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: '3px solid #2d6a4f' }}>
                <div style={{ fontWeight: 700, color: '#2d6a4f' }}>{proj.name}</div>
                {proj.tech && <div style={{ fontSize: '0.78rem', color: '#888', fontStyle: 'italic' }}>Tech: {proj.tech}</div>}
                {proj.description && <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#444' }}>{proj.description}</p>}
              </div>
            ))}
          </ModernSection>
        )}
      </div>
    </div>
  )
}

const sideItemStyle = { fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginBottom: 6, wordBreak: 'break-word' }

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#95d5b2', marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 4 }}>{title}</div>
      {children}
    </div>
  )
}

function ModernSection({ title, color, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 18, height: 3, background: color, borderRadius: 2, display: 'inline-block' }}/>
        {title}
      </h2>
      {children}
    </div>
  )
}

// ── TEMPLATE 3: Minimal (Clean Black & White) ──
export function MinimalTemplate({ data }) {
  const { personal, summary, experience, education, skills, projects } = data
  return (
    <div id="resume-preview" style={{ background: '#fff', color: '#111', fontFamily: "'Helvetica Neue', sans-serif", fontSize: '0.85rem', lineHeight: 1.7, minHeight: 600, borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#111' }}>{personal.name || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 6, fontSize: '0.78rem', color: '#666' }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.portfolio && <span>{personal.portfolio}</span>}
        </div>
        <div style={{ height: 2, background: '#111', marginTop: 16 }}/>
      </div>
      {summary && <MinSection title="Summary"><p style={{ margin: 0, color: '#333' }}>{summary}</p></MinSection>}
      {experience?.some(e => e.company || e.role) && (
        <MinSection title="Experience">
          {experience.filter(e => e.company || e.role).map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700 }}>{exp.role} — {exp.company}</div>
                <div style={{ fontSize: '0.78rem', color: '#888' }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? ' – Present' : ''}</div>
              </div>
              {exp.location && <div style={{ fontSize: '0.8rem', color: '#777' }}>{exp.location}</div>}
              {exp.description && <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>{exp.description.split('\n').filter(Boolean).map((line, j) => <li key={j} style={{ color: '#444', marginBottom: 2, fontSize: '0.82rem' }}>{line.replace(/^[•\-]\s*/, '')}</li>)}</ul>}
            </div>
          ))}
        </MinSection>
      )}
      {education?.some(e => e.school || e.degree) && (
        <MinSection title="Education">
          {education.filter(e => e.school || e.degree).map((edu, i) => (
            <div key={i} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 700 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                <span style={{ color: '#666' }}> — {edu.school}</span>
                {edu.grade && <span style={{ color: '#888', fontSize: '0.8rem' }}> · {edu.grade}</span>}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#888' }}>{edu.year}</span>
            </div>
          ))}
        </MinSection>
      )}
      {skills?.length > 0 && (
        <MinSection title="Skills">
          <p style={{ margin: 0, color: '#333' }}>{skills.join(' · ')}</p>
        </MinSection>
      )}
      {projects?.some(p => p.name) && (
        <MinSection title="Projects">
          {projects.filter(p => p.name).map((proj, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <span style={{ fontWeight: 700 }}>{proj.name}</span>
              {proj.tech && <span style={{ color: '#888', fontSize: '0.8rem' }}> · {proj.tech}</span>}
              {proj.link && <span style={{ color: '#4e8cff', fontSize: '0.78rem' }}> · {proj.link}</span>}
              {proj.description && <p style={{ margin: '3px 0 0', color: '#444', fontSize: '0.82rem' }}>{proj.description}</p>}
            </div>
          ))}
        </MinSection>
      )}
    </div>
  )
}

function MinSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111', margin: '0 0 10px', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>{title}</h2>
      {children}
    </div>
  )
}

// ── TEMPLATE 4: Bold (Colorful Gradient Header) ──
export function BoldTemplate({ data }) {
  const { personal, summary, experience, education, skills, projects } = data
  return (
    <div id="resume-preview" style={{ background: '#fff', color: '#1a1a1a', fontFamily: "'Arial', sans-serif", fontSize: '0.85rem', lineHeight: 1.6, minHeight: 600, borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
      {/* Gradient Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777, #ea580c)', padding: '32px 36px', color: '#fff' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.02em' }}>{personal.name || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)' }}>
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <span>📞 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
          {personal.portfolio && <span>🌐 {personal.portfolio}</span>}
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '28px 36px' }}>
        {summary && <BoldSection title="Profile" accent="#7c3aed"><p style={{ margin: 0, color: '#444' }}>{summary}</p></BoldSection>}
        {experience?.some(e => e.company || e.role) && (
          <BoldSection title="Experience" accent="#db2777">
            {experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#db2777', fontSize: '0.92rem' }}>{exp.role}</div>
                    <div style={{ color: '#555', fontSize: '0.82rem' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: '#fff', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? ' – Present' : ''}
                  </div>
                </div>
                {exp.description && <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>{exp.description.split('\n').filter(Boolean).map((line, j) => <li key={j} style={{ color: '#333', marginBottom: 2, fontSize: '0.83rem' }}>{line.replace(/^[•\-]\s*/, '')}</li>)}</ul>}
              </div>
            ))}
          </BoldSection>
        )}
        {education?.some(e => e.school || e.degree) && (
          <BoldSection title="Education" accent="#ea580c">
            {education.filter(e => e.school || e.degree).map((edu, i) => (
              <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#ea580c' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div style={{ color: '#555', fontSize: '0.82rem' }}>{edu.school}</div>
                  {edu.grade && <div style={{ fontSize: '0.78rem', color: '#888' }}>Grade: {edu.grade}</div>}
                </div>
                <div style={{ fontSize: '0.75rem', background: '#ea580c', color: '#fff', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{edu.year}</div>
              </div>
            ))}
          </BoldSection>
        )}
        {skills?.length > 0 && (
          <BoldSection title="Skills" accent="#7c3aed">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills.map((s, i) => {
                const colors = ['#7c3aed','#db2777','#ea580c','#0ea5e9','#059669']
                return <span key={i} style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, background: `${colors[i % colors.length]}18`, border: `1px solid ${colors[i % colors.length]}40`, color: colors[i % colors.length] }}>{s}</span>
              })}
            </div>
          </BoldSection>
        )}
        {projects?.some(p => p.name) && (
          <BoldSection title="Projects" accent="#0ea5e9">
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 800, color: '#0ea5e9' }}>{proj.name}</div>
                {proj.tech && <div style={{ fontSize: '0.78rem', color: '#888', fontStyle: 'italic' }}>Tech: {proj.tech}</div>}
                {proj.description && <p style={{ margin: '4px 0 0', color: '#444', fontSize: '0.83rem' }}>{proj.description}</p>}
              </div>
            ))}
          </BoldSection>
        )}
      </div>
    </div>
  )
}

function BoldSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 4, height: 18, background: accent, borderRadius: 2 }}/>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

// ── TEMPLATE PICKER COMPONENT ──
export const TEMPLATES = [
  { id: 'classic', name: 'Classic',  desc: 'Navy header, professional', emoji: '🏛️', component: ClassicTemplate },
  { id: 'modern',  name: 'Modern',   desc: 'Sidebar layout, green',     emoji: '✨', component: ModernTemplate  },
  { id: 'minimal', name: 'Minimal',  desc: 'Clean, black & white',      emoji: '⬜', component: MinimalTemplate },
  { id: 'bold',    name: 'Bold',     desc: 'Gradient header, colorful', emoji: '🎨', component: BoldTemplate    },
]

export function TemplatePicker({ selected, onSelect }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
        Choose Template
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{
            padding: '10px 8px', borderRadius: 12, border: `2px solid ${selected === t.id ? 'var(--pink)' : 'var(--border)'}`,
            background: selected === t.id ? 'rgba(255,78,205,0.08)' : 'var(--surface2)',
            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{t.emoji}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: selected === t.id ? 'var(--pink)' : 'var(--text)' }}>{t.name}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}