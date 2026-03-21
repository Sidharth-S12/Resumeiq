export default function ResumePreview({ data }) {
  const { personal, summary, experience, education, skills, projects } = data

  return (
    <div id="resume-preview" style={{
      background: '#fff',
      color: '#1a1a1a',
      fontFamily: "'Georgia', serif",
      fontSize: '0.85rem',
      lineHeight: 1.6,
      minHeight: 600,
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>

      {/* ── TOP HEADER BAR ── */}
      <div style={{
        background: '#1a1a2e',
        color: '#fff',
        padding: '28px 36px',
      }}>
        <h1 style={{
          fontSize: '1.9rem', fontWeight: 800,
          margin: '0 0 8px', letterSpacing: '-0.01em',
          color: '#fff',
        }}>
          {personal.name || 'Your Name'}
        </h1>

        {/* Contact row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '6px 20px',
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)',
        }}>
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <span>📞 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
          {personal.portfolio && <span>🌐 {personal.portfolio}</span>}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '28px 36px' }}>

        {/* Summary */}
        {summary && (
          <Section title="Professional Summary" color="#1a1a2e">
            <p style={{ margin: 0, color: '#333', textAlign: 'justify' }}>{summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience?.some(e => e.company || e.role) && (
          <Section title="Work Experience" color="#1a1a2e">
            {experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e' }}>{exp.role}</div>
                    <div style={{ color: '#555', fontSize: '0.82rem', fontStyle: 'italic' }}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.75rem', color: '#fff', whiteSpace: 'nowrap',
                    background: '#1a1a2e', padding: '3px 10px', borderRadius: 20,
                  }}>
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? ' – Present' : ''}
                  </div>
                </div>
                {exp.description && (
                  <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                    {exp.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j} style={{ color: '#333', marginBottom: 3, fontSize: '0.83rem' }}>
                        {line.replace(/^[•\-]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education?.some(e => e.school || e.degree) && (
          <Section title="Education" color="#1a1a2e">
            {education.filter(e => e.school || e.degree).map((edu, i) => (
              <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </div>
                  <div style={{ color: '#555', fontSize: '0.82rem', fontStyle: 'italic' }}>{edu.school}</div>
                  {edu.grade && <div style={{ fontSize: '0.78rem', color: '#666', marginTop: 2 }}>Grade: {edu.grade}</div>}
                </div>
                <div style={{
                  fontSize: '0.75rem', color: '#fff', whiteSpace: 'nowrap',
                  background: '#1a1a2e', padding: '3px 10px', borderRadius: 20,
                }}>
                  {edu.year}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <Section title="Technical Skills" color="#1a1a2e">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills.map((skill, i) => (
                <span key={i} style={{
                  padding: '4px 12px', borderRadius: 4,
                  background: '#f0f0f8', color: '#1a1a2e',
                  fontSize: '0.78rem', fontWeight: 600,
                  border: '1px solid #ddd',
                  fontFamily: 'monospace',
                }}>{skill}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects?.some(p => p.name) && (
          <Section title="Projects" color="#1a1a2e">
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e' }}>{proj.name}</div>
                  {proj.link && (
                    <span style={{ fontSize: '0.75rem', color: '#4e8cff' }}>🔗 {proj.link}</span>
                  )}
                </div>
                {proj.tech && (
                  <div style={{ fontSize: '0.78rem', color: '#666', marginTop: 2, fontStyle: 'italic' }}>
                    Tech Stack: {proj.tech}
                  </div>
                )}
                {proj.description && (
                  <p style={{ margin: '4px 0 0', color: '#333', fontSize: '0.83rem' }}>{proj.description}</p>
                )}
              </div>
            ))}
          </Section>
        )}

      </div>
    </div>
  )
}

function Section({ title, children, color }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 12,
      }}>
        <h2 style={{
          fontSize: '0.72rem', fontWeight: 800,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: color || '#1a1a2e', margin: 0, whiteSpace: 'nowrap',
        }}>{title}</h2>
        <div style={{ flex: 1, height: '2px', background: color || '#1a1a2e', opacity: 0.15 }}/>
      </div>
      {children}
    </div>
  )
}