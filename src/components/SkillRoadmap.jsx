import { useState } from 'react'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

// ── 100% real, verified resource links per skill ──
const SKILL_RESOURCES = {
  // Programming Languages
  'python': [
    { type: 'YouTube', name: 'Python Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', free: true, description: '4-hour beginner to advanced Python course' },
    { type: 'Website', name: 'Python Official Docs', url: 'https://docs.python.org/3/tutorial/', free: true, description: 'Official Python tutorial from python.org' },
    { type: 'Course',  name: 'Python on freeCodeCamp', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', free: true, description: 'Free Python certification course' },
  ],
  'javascript': [
    { type: 'YouTube', name: 'JavaScript Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', free: true, description: 'Complete JavaScript for beginners' },
    { type: 'Website', name: 'JavaScript.info', url: 'https://javascript.info/', free: true, description: 'The Modern JavaScript Tutorial' },
    { type: 'Course',  name: 'JS on freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', free: true, description: 'Free JavaScript certification' },
  ],
  'java': [
    { type: 'YouTube', name: 'Java Full Course – Bro Code', url: 'https://www.youtube.com/watch?v=xk4_1vDrzzo', free: true, description: '12-hour complete Java course' },
    { type: 'Website', name: 'Java Official Docs', url: 'https://docs.oracle.com/javase/tutorial/', free: true, description: 'Official Java tutorials by Oracle' },
    { type: 'Course',  name: 'Java on Codecademy', url: 'https://www.codecademy.com/learn/learn-java', free: true, description: 'Interactive Java course' },
  ],
  'c++': [
    { type: 'YouTube', name: 'C++ Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=8jLOx1hD3_o', free: true, description: 'Full C++ course for beginners' },
    { type: 'Website', name: 'LearnCpp.com', url: 'https://www.learncpp.com/', free: true, description: 'Free comprehensive C++ tutorial site' },
  ],
  'typescript': [
    { type: 'YouTube', name: 'TypeScript Full Course – Hitesh Choudhary', url: 'https://www.youtube.com/watch?v=30LWjhZzg50', free: true, description: 'Complete TypeScript in one video' },
    { type: 'Website', name: 'TypeScript Official Docs', url: 'https://www.typescriptlang.org/docs/', free: true, description: 'Official TypeScript handbook' },
  ],

  // Frontend
  'react': [
    { type: 'YouTube', name: 'React JS Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', free: true, description: 'Complete React course for beginners' },
    { type: 'Website', name: 'React Official Docs', url: 'https://react.dev/learn', free: true, description: 'Official React documentation and tutorial' },
    { type: 'Course',  name: 'React on Scrimba', url: 'https://scrimba.com/learn/learnreact', free: true, description: 'Free interactive React course' },
  ],
  'html': [
    { type: 'YouTube', name: 'HTML Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', free: true, description: 'HTML for absolute beginners' },
    { type: 'Website', name: 'MDN Web Docs – HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', free: true, description: 'Mozilla official HTML guide' },
  ],
  'css': [
    { type: 'YouTube', name: 'CSS Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=OXGznpKZ_sA', free: true, description: 'Complete CSS course from basics' },
    { type: 'Website', name: 'MDN Web Docs – CSS', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS', free: true, description: 'Mozilla official CSS reference' },
  ],
  'vue': [
    { type: 'YouTube', name: 'Vue JS Crash Course – Traversy Media', url: 'https://www.youtube.com/watch?v=VeNfHj6MhgA', free: true, description: 'Vue.js crash course for beginners' },
    { type: 'Website', name: 'Vue Official Docs', url: 'https://vuejs.org/guide/introduction.html', free: true, description: 'Official Vue.js documentation' },
  ],

  // Backend
  'node.js': [
    { type: 'YouTube', name: 'Node.js Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', free: true, description: 'Node.js and Express full course' },
    { type: 'Website', name: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs/', free: true, description: 'Official Node.js documentation' },
  ],
  'django': [
    { type: 'YouTube', name: 'Django Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=F5mRW0jo-U4', free: true, description: 'Complete Python Django tutorial' },
    { type: 'Website', name: 'Django Official Docs', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/', free: true, description: 'Official Django getting started guide' },
  ],

  // Data & AI
  'sql': [
    { type: 'YouTube', name: 'SQL Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', free: true, description: '4-hour SQL course for beginners' },
    { type: 'Website', name: 'SQLZoo', url: 'https://sqlzoo.net/', free: true, description: 'Interactive SQL practice exercises' },
    { type: 'Course',  name: 'SQL on Khan Academy', url: 'https://www.khanacademy.org/computing/computer-programming/sql', free: true, description: 'Free SQL course with exercises' },
  ],
  'machine learning': [
    { type: 'Course',  name: 'ML Course – Andrew Ng (Coursera)', url: 'https://www.coursera.org/learn/machine-learning', free: true, description: 'World famous ML course — audit for free' },
    { type: 'YouTube', name: 'ML Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=NWONeJKn6kc', free: true, description: 'Machine learning crash course' },
    { type: 'Website', name: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', free: true, description: 'Free ML course by Google' },
  ],
  'deep learning': [
    { type: 'Course',  name: 'Deep Learning Specialization – Coursera', url: 'https://www.coursera.org/specializations/deep-learning', free: true, description: 'Andrew Ng deep learning — audit for free' },
    { type: 'YouTube', name: 'Deep Learning – 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', free: true, description: 'Visual explanation of neural networks' },
  ],
  'data analysis': [
    { type: 'YouTube', name: 'Data Analysis with Python – freeCodeCamp', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', free: true, description: 'Full data analysis course with Python' },
    { type: 'Course',  name: 'Data Analysis – freeCodeCamp Cert', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', free: true, description: 'Free data analysis certification' },
  ],
  'pandas': [
    { type: 'YouTube', name: 'Pandas Full Course – Keith Galli', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', free: true, description: 'Complete pandas data analysis tutorial' },
    { type: 'Website', name: 'Pandas Official Docs', url: 'https://pandas.pydata.org/docs/getting_started/index.html', free: true, description: 'Official pandas getting started guide' },
  ],
  'tensorflow': [
    { type: 'Website', name: 'TensorFlow Official Tutorials', url: 'https://www.tensorflow.org/tutorials', free: true, description: 'Official TensorFlow beginner tutorials' },
    { type: 'YouTube', name: 'TensorFlow 2 Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk', free: true, description: 'Complete TensorFlow course' },
  ],

  // DevOps & Cloud
  'docker': [
    { type: 'YouTube', name: 'Docker Full Course – TechWorld with Nana', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', free: true, description: 'Complete Docker tutorial for beginners' },
    { type: 'Website', name: 'Docker Official Docs', url: 'https://docs.docker.com/get-started/', free: true, description: 'Official Docker getting started guide' },
  ],
  'kubernetes': [
    { type: 'YouTube', name: 'Kubernetes Full Course – TechWorld with Nana', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', free: true, description: 'Complete Kubernetes course for beginners' },
    { type: 'Website', name: 'Kubernetes Official Docs', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', free: true, description: 'Official Kubernetes basics tutorial' },
  ],
  'aws': [
    { type: 'YouTube', name: 'AWS Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=3hLmDS179YE', free: true, description: 'Complete AWS cloud practitioner course' },
    { type: 'Website', name: 'AWS Free Training', url: 'https://aws.amazon.com/training/digital/', free: true, description: 'Free AWS digital training courses' },
  ],
  'git': [
    { type: 'YouTube', name: 'Git & GitHub Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', free: true, description: 'Complete Git and GitHub tutorial' },
    { type: 'Website', name: 'Pro Git Book', url: 'https://git-scm.com/book/en/v2', free: true, description: 'Free official Git book online' },
  ],
  'ci/cd': [
    { type: 'YouTube', name: 'CI/CD Pipeline Tutorial – TechWorld with Nana', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', free: true, description: 'CI/CD concepts and hands-on demo' },
    { type: 'Website', name: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions', free: true, description: 'Official GitHub Actions documentation' },
  ],

  // Design
  'figma': [
    { type: 'YouTube', name: 'Figma Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc', free: true, description: 'Complete Figma UI/UX design course' },
    { type: 'Website', name: 'Figma Learn', url: 'https://www.figma.com/resources/learn-design/', free: true, description: 'Official Figma learning resources' },
  ],
  'ui/ux': [
    { type: 'Course',  name: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', free: true, description: 'Google UX course — audit for free on Coursera' },
    { type: 'YouTube', name: 'UX Design Full Course – CareerFoundry', url: 'https://www.youtube.com/watch?v=uL2ZB7XXIgg', free: true, description: 'UX design crash course for beginners' },
  ],

  // Marketing
  'seo': [
    { type: 'Course',  name: 'SEO Training – Moz', url: 'https://moz.com/beginners-guide-to-seo', free: true, description: 'Free beginner SEO guide by Moz' },
    { type: 'YouTube', name: 'SEO Full Course – Ahrefs', url: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', free: true, description: 'Complete SEO course for beginners' },
  ],
  'digital marketing': [
    { type: 'Course',  name: 'Google Digital Marketing Cert', url: 'https://skillshop.withgoogle.com/', free: true, description: 'Free Google digital marketing courses' },
    { type: 'Course',  name: 'Digital Marketing – HubSpot Academy', url: 'https://academy.hubspot.com/courses/digital-marketing', free: true, description: 'Free digital marketing certification' },
  ],

  // Soft Skills & Others
  'system design': [
    { type: 'YouTube', name: 'System Design – Gaurav Sen', url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX', free: true, description: 'System design concepts playlist' },
    { type: 'Website', name: 'System Design Primer – GitHub', url: 'https://github.com/donnemartin/system-design-primer', free: true, description: 'Comprehensive system design guide on GitHub' },
  ],
  'graphql': [
    { type: 'YouTube', name: 'GraphQL Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q', free: true, description: 'Complete GraphQL tutorial' },
    { type: 'Website', name: 'GraphQL Official Docs', url: 'https://graphql.org/learn/', free: true, description: 'Official GraphQL learning guide' },
  ],
  'excel': [
    { type: 'YouTube', name: 'Excel Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', free: true, description: 'Microsoft Excel for beginners' },
    { type: 'Website', name: 'Excel Easy', url: 'https://www.excel-easy.com/', free: true, description: 'Free Excel tutorials and examples' },
  ],
  'power bi': [
    { type: 'YouTube', name: 'Power BI Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=AGrl-H87pRU', free: true, description: 'Complete Power BI tutorial for beginners' },
    { type: 'Website', name: 'Microsoft Power BI Learn', url: 'https://learn.microsoft.com/en-us/power-bi/fundamentals/service-get-started', free: true, description: 'Official Microsoft Power BI learning path' },
  ],
}

// Fallback resources for unknown skills
function getFallbackResources(skill) {
  return [
    {
      type: 'YouTube',
      name: `${skill} Tutorial – YouTube Search`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial for beginners')}`,
      free: true,
      description: `Search YouTube for ${skill} tutorials`,
    },
    {
      type: 'Website',
      name: `${skill} – freeCodeCamp Articles`,
      url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`,
      free: true,
      description: `Free articles and tutorials about ${skill}`,
    },
    {
      type: 'Course',
      name: `${skill} – Coursera (Free Audit)`,
      url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
      free: true,
      description: `Find ${skill} courses you can audit for free`,
    },
  ]
}

function getResources(skill) {
  const key = skill.toLowerCase().trim()
  // Try exact match first
  if (SKILL_RESOURCES[key]) return SKILL_RESOURCES[key]
  // Try partial match
  const match = Object.keys(SKILL_RESOURCES).find(k => key.includes(k) || k.includes(key))
  if (match) return SKILL_RESOURCES[match]
  // Fallback to search links
  return getFallbackResources(skill)
}

const DIFFICULTY_INFO = {
  Beginner:     { bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)',  color: '#4ade80' },
  Intermediate: { bg: 'rgba(255,225,77,0.1)',  border: 'rgba(255,225,77,0.3)',  color: '#ffe14d' },
  Advanced:     { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', color: '#f87171' },
}

const SKILL_COLORS = [
  'var(--purple), var(--pink)',
  'var(--pink), var(--orange)',
  'var(--orange), var(--yellow)',
  'var(--cyan), var(--blue)',
  'var(--blue), var(--purple)',
]

const RESOURCE_ICONS = {
  YouTube: '▶️',
  Course:  '🎓',
  Website: '🌐',
  Book:    '📖',
  Docs:    '📄',
}

export default function SkillRoadmap({ missingSkills, jobRole }) {
  const [roadmap, setRoadmap]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [expanded, setExpanded]   = useState(null)
  const [generated, setGenerated] = useState(false)

  if (!missingSkills?.length) return null

  async function generateRoadmap() {
    if (loading) return
    setLoading(true)

    // Get AI to provide difficulty + time + why + tips
    const prompt = `For a "${jobRole}" role, provide difficulty level, time to learn, why it matters, and a pro tip for each of these skills: ${missingSkills.join(', ')}.

Respond ONLY with a valid JSON array (no markdown):
[
  {
    "skill": "<exact skill name from the list>",
    "why": "<1 sentence why this skill matters for ${jobRole}>",
    "difficulty": "<Beginner / Intermediate / Advanced>",
    "timeToLearn": "<e.g. 2-3 weeks>",
    "tips": "<1 practical tip for learning this skill fast>"
  }
]`

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are a career coach. Respond with valid JSON only. No markdown.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      })

      const data  = await response.json()
      const raw   = data.choices?.[0]?.message?.content || '[]'
      const clean = raw.replace(/```json|```/g, '').trim()
      const aiData = JSON.parse(clean)

      // Merge AI info with our verified resources
      const merged = aiData.map(item => ({
        ...item,
        resources: getResources(item.skill),
      }))

      // Add any skills AI missed
      missingSkills.forEach(skill => {
        if (!merged.find(m => m.skill.toLowerCase() === skill.toLowerCase())) {
          merged.push({
            skill,
            why: `${skill} is important for ${jobRole} roles.`,
            difficulty: 'Intermediate',
            timeToLearn: '2-4 weeks',
            tips: `Practice ${skill} with real projects to learn faster.`,
            resources: getResources(skill),
          })
        }
      })

      setRoadmap(merged)
      setExpanded(merged[0]?.skill)
      setGenerated(true)
    } catch (e) {
      // Fallback — just use verified resources without AI metadata
      const fallback = missingSkills.map(skill => ({
        skill,
        why: `${skill} is a key requirement for ${jobRole} roles.`,
        difficulty: 'Intermediate',
        timeToLearn: '2-4 weeks',
        tips: `Build a small project using ${skill} to solidify your learning.`,
        resources: getResources(skill),
      }))
      setRoadmap(fallback)
      setExpanded(fallback[0]?.skill)
      setGenerated(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      gridColumn: 'span 2', marginTop: 8,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20, overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--purple), var(--cyan), var(--orange))' }}/>

      <div style={{ padding: 28 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cyan)' }}/>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                🎯 Skill Learning Roadmap
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
              Personalized plan with <strong style={{ color: 'var(--cyan)' }}>verified free resources</strong> for your {missingSkills.length} missing skills
            </p>
          </div>

          {!generated && (
            <button onClick={generateRoadmap} disabled={loading} style={{
              padding: '12px 24px', borderRadius: 12, border: 'none',
              background: loading ? 'var(--surface2)' : 'linear-gradient(135deg, var(--purple), var(--cyan))',
              color: loading ? 'var(--muted)' : '#fff',
              fontWeight: 800, fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(155,93,255,0.3)',
              whiteSpace: 'nowrap',
            }}>
              {loading ? '⏳ Generating...' : '✦ Generate Roadmap'}
            </button>
          )}
        </div>

        {/* Skill pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {missingSkills.map(skill => (
            <span key={skill} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
              background: generated ? 'rgba(59,240,228,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${generated ? 'rgba(59,240,228,0.3)' : 'var(--border)'}`,
              color: generated ? 'var(--cyan)' : 'var(--muted)',
              transition: 'all 0.3s',
            }}>
              {generated ? '✓ ' : ''}{skill}
            </span>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 20, borderRadius: 14,
            background: 'rgba(155,93,255,0.06)',
            border: '1px solid rgba(155,93,255,0.2)',
          }}>
            <div style={{ fontSize: '1.5rem' }}>⚙️</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Building your personalized roadmap...</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Matching skills with verified free learning resources</div>
            </div>
          </div>
        )}

        {/* Empty prompt */}
        {!loading && !generated && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
              Click <strong style={{ color: 'var(--purple)' }}>Generate Roadmap</strong> to get a personalized plan with free, verified resources for each skill!
            </p>
          </div>
        )}

        {/* Roadmap */}
        {roadmap && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {roadmap.map((item, i) => {
              const isOpen = expanded === item.skill
              const diff   = DIFFICULTY_INFO[item.difficulty] || DIFFICULTY_INFO.Intermediate
              return (
                <div key={item.skill} style={{
                  borderRadius: 14,
                  border: `1px solid ${isOpen ? 'rgba(155,93,255,0.4)' : 'var(--border)'}`,
                  background: isOpen ? 'rgba(155,93,255,0.04)' : 'var(--surface2)',
                  overflow: 'hidden', transition: 'all 0.2s',
                }}>
                  {/* Header */}
                  <div onClick={() => setExpanded(isOpen ? null : item.skill)}
                    style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: `linear-gradient(135deg, ${SKILL_COLORS[i % SKILL_COLORS.length]})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 800, color: '#fff',
                      }}>{i + 1}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{item.skill}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.why}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: diff.bg, border: `1px solid ${diff.border}`, color: diff.color }}>
                        {item.difficulty}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(78,140,255,0.1)', border: '1px solid rgba(78,140,255,0.3)', color: 'var(--blue)', whiteSpace: 'nowrap' }}>
                        ⏱ {item.timeToLearn}
                      </span>
                      <span style={{ color: 'var(--muted)' }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
                      {/* Resources */}
                      <div style={{ marginTop: 14, marginBottom: 10 }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                          📚 Free Learning Resources
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {item.resources.map((res, j) => (
                            <a key={j} href={res.url} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,240,228,0.4)'; e.currentTarget.style.background = 'rgba(59,240,228,0.04)' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                            >
                              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{RESOURCE_ICONS[res.type] || '🔗'}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{res.name}</div>
                                <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 1 }}>{res.description}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                {res.free && (
                                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 800, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>FREE</span>
                                )}
                                <span style={{ color: 'var(--cyan)', fontSize: '0.9rem' }}>↗</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Pro tip */}
                      {item.tips && (
                        <div style={{ padding: '11px 14px', borderRadius: 10, background: 'rgba(255,225,77,0.06)', border: '1px solid rgba(255,225,77,0.2)' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💡 Pro Tip</span>
                          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.5 }}>{item.tips}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            <button onClick={() => { setGenerated(false); setRoadmap(null) }} style={{
              padding: '10px', borderRadius: 12, marginTop: 4,
              border: '1px dashed rgba(155,93,255,0.3)',
              background: 'transparent', color: 'var(--purple)',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
            }}>🔄 Regenerate Roadmap</button>
          </div>
        )}
      </div>
    </div>
  )
}