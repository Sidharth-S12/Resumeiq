import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { TEMPLATES, TemplatePicker } from '../components/ResumeTemplates'

const EMPTY_EXP  = { role: '', company: '', location: '', startDate: '', endDate: '', description: '' }
const EMPTY_EDU  = { degree: '', field: '', school: '', year: '', grade: '' }
const EMPTY_PROJ = { name: '', tech: '', description: '', link: '' }

export default function ResumeBuilder({ user }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]   = useState('personal')
  const [skillInput, setSkillInput] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [templateId, setTemplateId] = useState('classic')

  const [data, setData] = useState({
    personal:   { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
    summary:    '',
    experience: [{ ...EMPTY_EXP }],
    education:  [{ ...EMPTY_EDU }],
    skills:     [],
    projects:   [{ ...EMPTY_PROJ }],
  })

  // ── Helpers ──
  function updatePersonal(field, val) {
    setData(d => ({ ...d, personal: { ...d.personal, [field]: val } }))
  }
  function updateList(section, index, field, val) {
    setData(d => {
      const arr = [...d[section]]
      arr[index] = { ...arr[index], [field]: val }
      return { ...d, [section]: arr }
    })
  }
  function addItem(section, empty) {
    setData(d => ({ ...d, [section]: [...d[section], { ...empty }] }))
  }
  function removeItem(section, index) {
    setData(d => ({ ...d, [section]: d[section].filter((_, i) => i !== index) }))
  }
  function addSkill() {
    const s = skillInput.trim()
    if (s && !data.skills.includes(s)) {
      setData(d => ({ ...d, skills: [...d.skills, s] }))
    }
    setSkillInput('')
  }
  function removeSkill(skill) {
    setData(d => ({ ...d, skills: d.skills.filter(s => s !== skill) }))
  }

async function downloadPDF() {
  setDownloading(true)
  try {
    const element = document.getElementById('resume-preview')
    if (!element) throw new Error('Resume preview not found')

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgData  = canvas.toDataURL('image/jpeg', 0.98)
    const pdf      = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${data.personal.name || 'resume'}_ResumeIQ.pdf`)

  } catch (e) {
    console.error('PDF error:', e)
    alert('PDF generation failed. Please try again.')
  }
  setDownloading(false)
}
  const tabs = [
    { id: 'personal',   label: '👤 Personal'   },
    { id: 'summary',    label: '📋 Summary'    },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education',  label: '🎓 Education'  },
    { id: 'skills',     label: '🛠️ Skills'     },
    { id: 'projects',   label: '🚀 Projects'   },
  ]

  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="hero-tag" style={{ marginBottom: 12 }}>✦ Resume Builder</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Build Your{' '}
          <span style={{ background: 'linear-gradient(90deg, var(--pink), var(--orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Perfect Resume
          </span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
          Fill in your details on the left — see your resume come to life on the right!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>

        {/* ── LEFT: FORM ── */}
        <div>
          <div className="card">
            <div className="card-bar"/>

            {/* Tabs */}
            <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border)', padding: '0 20px', gap: 2 }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 10px', fontSize: '0.8rem', fontWeight: 700,
                  color: activeTab === tab.id ? 'var(--pink)' : 'var(--muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--pink)' : '2px solid transparent',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '24px' }}>

              {/* ── PERSONAL ── */}
              {activeTab === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <TemplatePicker selected={templateId} onSelect={setTemplateId} />
                  <FormRow label="Full Name"     value={data.personal.name}      onChange={v => updatePersonal('name', v)}      placeholder="John Doe" />
                  <FormRow label="Email"         value={data.personal.email}     onChange={v => updatePersonal('email', v)}     placeholder="john@email.com" />
                  <FormRow label="Phone"         value={data.personal.phone}     onChange={v => updatePersonal('phone', v)}     placeholder="+91 98765 43210" />
                  <FormRow label="Location"      value={data.personal.location}  onChange={v => updatePersonal('location', v)}  placeholder="Bengaluru, India" />
                  <FormRow label="LinkedIn URL"  value={data.personal.linkedin}  onChange={v => updatePersonal('linkedin', v)}  placeholder="linkedin.com/in/johndoe" />
                  <FormRow label="Portfolio URL" value={data.personal.portfolio} onChange={v => updatePersonal('portfolio', v)} placeholder="johndoe.dev" />
                </div>
              )}

              {/* ── SUMMARY ── */}
              {activeTab === 'summary' && (
                <div>
                  <label style={labelStyle}>Professional Summary</label>
                  <textarea rows={6} value={data.summary}
                    onChange={e => setData(d => ({ ...d, summary: e.target.value }))}
                    placeholder="Write a short 2-4 sentence summary highlighting your experience, skills, and what you bring to the role..."
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 8 }}>
                    💡 Mention your years of experience, top skills, and career goal.
                  </p>
                </div>
              )}

              {/* ── EXPERIENCE ── */}
              {activeTab === 'experience' && (
                <div>
                  {data.experience.map((exp, i) => (
                    <div key={i} style={sectionBoxStyle}>
                      <SectionBoxHeader label={`Experience #${i + 1}`} color="var(--pink)"
                        onRemove={data.experience.length > 1 ? () => removeItem('experience', i) : null} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <FormRow label="Job Title"  value={exp.role}      onChange={v => updateList('experience', i, 'role', v)}      placeholder="Software Engineer" />
                        <FormRow label="Company"    value={exp.company}   onChange={v => updateList('experience', i, 'company', v)}   placeholder="Google" />
                        <FormRow label="Location"   value={exp.location}  onChange={v => updateList('experience', i, 'location', v)}  placeholder="Bengaluru, India" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <FormRow label="Start Date" value={exp.startDate} onChange={v => updateList('experience', i, 'startDate', v)} placeholder="Jan 2022" />
                          <FormRow label="End Date"   value={exp.endDate}   onChange={v => updateList('experience', i, 'endDate', v)}   placeholder="Present" />
                        </div>
                        <div>
                          <label style={labelStyle}>Key Responsibilities</label>
                          <textarea rows={4} value={exp.description}
                            onChange={e => updateList('experience', i, 'description', e.target.value)}
                            placeholder={"Built REST APIs using Node.js\nImproved app performance by 40%\nLed a team of 3 developers"}
                            style={{ ...inputStyle, resize: 'vertical' }}
                          />
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>Each line = one bullet point</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem('experience', EMPTY_EXP)} style={addBtnStyle}>+ Add Another Experience</button>
                </div>
              )}

              {/* ── EDUCATION ── */}
              {activeTab === 'education' && (
                <div>
                  {data.education.map((edu, i) => (
                    <div key={i} style={sectionBoxStyle}>
                      <SectionBoxHeader label={`Education #${i + 1}`} color="var(--cyan)"
                        onRemove={data.education.length > 1 ? () => removeItem('education', i) : null} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <FormRow label="Degree"     value={edu.degree} onChange={v => updateList('education', i, 'degree', v)} placeholder="B.Tech / B.Sc / MBA" />
                        <FormRow label="Field"      value={edu.field}  onChange={v => updateList('education', i, 'field', v)}  placeholder="Computer Science" />
                        <FormRow label="University" value={edu.school} onChange={v => updateList('education', i, 'school', v)} placeholder="University of Kerala" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <FormRow label="Year"  value={edu.year}  onChange={v => updateList('education', i, 'year', v)}  placeholder="2024" />
                          <FormRow label="Grade" value={edu.grade} onChange={v => updateList('education', i, 'grade', v)} placeholder="8.5 CGPA" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem('education', EMPTY_EDU)} style={addBtnStyle}>+ Add Another Education</button>
                </div>
              )}

              {/* ── SKILLS ── */}
              {activeTab === 'skills' && (
                <div>
                  <label style={labelStyle}>Add Skills (press Enter or click Add)</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSkill()}
                      placeholder="e.g. React, Python, Figma..."
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: 10,
                        border: '1px solid rgba(155,93,255,0.4)',
                        background: 'var(--surface2)',
                        color: '#ffffff',
                        fontSize: '0.88rem', outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button onClick={addSkill} style={{
                      padding: '10px 20px', borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                      color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                    }}>Add</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {data.skills.map(skill => (
                      <div key={skill} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 20,
                        background: 'rgba(155,93,255,0.12)',
                        border: '1px solid rgba(155,93,255,0.3)',
                        color: 'var(--purple)', fontSize: '0.85rem', fontWeight: 600,
                      }}>
                        {skill}
                        <button onClick={() => removeSkill(skill)} style={{
                          background: 'none', border: 'none', color: 'var(--muted)',
                          cursor: 'pointer', padding: 0, fontSize: '0.85rem', lineHeight: 1,
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                  {data.skills.length === 0 && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 12 }}>
                      No skills added yet. Type a skill and press Enter!
                    </p>
                  )}
                </div>
              )}

              {/* ── PROJECTS ── */}
              {activeTab === 'projects' && (
                <div>
                  {data.projects.map((proj, i) => (
                    <div key={i} style={sectionBoxStyle}>
                      <SectionBoxHeader label={`Project #${i + 1}`} color="var(--orange)"
                        onRemove={data.projects.length > 1 ? () => removeItem('projects', i) : null} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <FormRow label="Project Name"  value={proj.name} onChange={v => updateList('projects', i, 'name', v)} placeholder="ResumeIQ App" />
                        <FormRow label="Technologies"  value={proj.tech} onChange={v => updateList('projects', i, 'tech', v)} placeholder="React, Firebase, Groq AI" />
                        <FormRow label="Project Link"  value={proj.link} onChange={v => updateList('projects', i, 'link', v)} placeholder="github.com/you/project" />
                        <div>
                          <label style={labelStyle}>Description</label>
                          <textarea rows={3} value={proj.description}
                            onChange={e => updateList('projects', i, 'description', e.target.value)}
                            placeholder="Briefly describe what the project does and your role..."
                            style={{ ...inputStyle, resize: 'vertical' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem('projects', EMPTY_PROJ)} style={addBtnStyle}>+ Add Another Project</button>
                </div>
              )}

            </div>

            {/* ── BOTTOM ACTIONS ── */}
            <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12 }}>
              <button onClick={downloadPDF} disabled={downloading} style={{
                flex: 1, padding: '14px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(155,93,255,0.3)',
                opacity: downloading ? 0.7 : 1,
              }}>
                {downloading ? '⏳ Generating...' : '⬇️ Download PDF'}
              </button>
              <button onClick={() => navigate('/')} style={{
                flex: 1, padding: '14px', borderRadius: 14,
                border: '1px solid var(--border)', background: 'var(--surface2)',
                color: 'var(--text)', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
              }}>
                🔍 Analyze This Resume
              </button>
            </div>

          </div>
        </div>

        {/* ── RIGHT: PREVIEW ── */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }}/>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live Preview
            </span>
          </div>
           {(() => {
            const T = TEMPLATES.find(t => t.id === templateId)?.component
            return T ? <T data={data} /> : null
          })()}
        </div>

      </div>
    </div>
  )
}

// ── Reusable components ──
function FormRow({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={inputStyle} />
    </div>
  )
}

function SectionBoxHeader({ label, color, onRemove }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <span style={{ fontWeight: 700, fontSize: '0.88rem', color }}>{label}</span>
      {onRemove && (
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.82rem' }}>
          ✕ Remove
        </button>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  letterSpacing: '0.07em', textTransform: 'uppercase',
  color: 'var(--muted)', marginBottom: 6,
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface2)',
  color: '#ffffff',
  fontSize: '0.88rem', outline: 'none',
  transition: 'border-color 0.2s', fontFamily: 'inherit',
}

const sectionBoxStyle = {
  marginBottom: 20, padding: '18px',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 14, border: '1px solid var(--border)',
}

const addBtnStyle = {
  width: '100%', padding: '12px', borderRadius: 12, marginTop: 4,
  border: '1px dashed rgba(155,93,255,0.3)',
  background: 'rgba(155,93,255,0.05)',
  color: 'var(--purple)', fontWeight: 700, fontSize: '0.88rem',
  cursor: 'pointer', transition: 'all 0.2s',
}