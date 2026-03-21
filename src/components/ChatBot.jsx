import { useState, useRef, useEffect } from 'react'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const SYSTEM_PROMPT = `You are ResumeIQ Assistant — a friendly, expert career coach and resume advisor built into the ResumeIQ app.

You help users with:
1. Writing professional resume sections (summary, experience bullets, objective)
2. Suggesting relevant skills for any job role
3. Answering career-related questions
4. Generating professional summaries based on user details
5. Interview tips and job search advice

Rules:
- Keep responses concise and practical
- Use bullet points and formatting when helpful
- Always be encouraging and positive
- If asked to generate a summary, ask for: name, job role, years of experience, top 3 skills
- Focus only on career, resume, and job-related topics
- If asked unrelated questions, politely redirect to career topics`

const SUGGESTIONS = [
  "Write a summary for a Data Analyst fresher",
  "What skills should I add for Software Engineer?",
  "How do I describe my internship experience?",
  "Give me tips for my first job interview",
]

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm your **ResumeIQ Assistant**. I can help you write your resume, suggest skills, answer career questions, and generate a professional summary!\n\nWhat would you like help with today?",
    }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread]   = useState(0)
  const bottomRef = useRef()
  const inputRef  = useRef()

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [open, messages])

  async function sendMessage(text) {
    const userText = text || input.trim()
    if (!userText || loading) return

    setInput('')
    setLoading(true)

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)

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
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      })

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response. Please try again!'

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (!open) setUnread(u => u + 1)

    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Please check your connection and try again.' }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: "Hi! 👋 I'm your **ResumeIQ Assistant**. How can I help you today?",
    }])
  }

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 1000,
          width: 360, height: 520,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeUp 0.25s ease',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', boxShadow: '0 0 12px rgba(155,93,255,0.4)',
              }}>✦</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>ResumeIQ Assistant</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)' }}/>
                  Online · Powered by Groq AI
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={clearChat} title="Clear chat" style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                color: 'var(--muted)', borderRadius: 8, padding: '5px 10px',
                fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
              }}>Clear</button>
              <button onClick={() => setOpen(false)} style={{
                background: 'rgba(255,78,205,0.1)', border: '1px solid rgba(255,78,205,0.3)',
                color: 'var(--pink)', borderRadius: 8, padding: '5px 10px',
                fontSize: '0.85rem', cursor: 'pointer',
              }}>✕</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', marginRight: 8, marginTop: 2,
                  }}>✦</div>
                )}
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, var(--purple), var(--pink))'
                    : 'var(--surface2)',
                  color: '#fff',
                  fontSize: '0.83rem',
                  lineHeight: 1.6,
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem',
                }}>✦</div>
                <div style={{
                  padding: '10px 16px', borderRadius: '18px 18px 18px 4px',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--purple)',
                      animation: `bounce 1.2s ${i * 0.2}s infinite`,
                    }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && !loading && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
                  background: 'rgba(155,93,255,0.08)', border: '1px solid rgba(155,93,255,0.25)',
                  color: 'var(--purple)', cursor: 'pointer', transition: 'all 0.2s',
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 8,
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about your resume..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--surface2)',
                color: '#ffffff',
                fontSize: '0.85rem', outline: 'none',
                fontFamily: 'inherit', resize: 'none',
                lineHeight: 1.4,
              }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
              padding: '10px 14px', borderRadius: 12, border: 'none',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--purple), var(--pink))'
                : 'var(--surface2)',
              color: input.trim() && !loading ? '#fff' : 'var(--muted)',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              fontSize: '1rem', transition: 'all 0.2s',
              boxShadow: input.trim() && !loading ? '0 4px 12px rgba(155,93,255,0.3)' : 'none',
            }}>➤</button>
          </div>

        </div>
      )}

      {/* ── FLOATING BUTTON ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, var(--purple), var(--pink))',
          color: '#fff', fontSize: '1.4rem', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(155,93,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease',
          transform: open ? 'rotate(0deg) scale(1.05)' : 'rotate(0deg)',
        }}
        title="Chat with ResumeIQ Assistant"
      >
        {open ? '✕' : '💬'}
        {/* Unread badge */}
        {unread > 0 && !open && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--orange)', color: '#fff',
            fontSize: '0.7rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unread}</div>
        )}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  )
}