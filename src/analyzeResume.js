const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export async function analyzeResume(resumeText, jobRole) {
  const prompt = `You are an expert resume analyzer and career coach. Analyze the following resume for a "${jobRole}" position.

RESUME TEXT:
${resumeText}

Analyze this resume and respond ONLY with a valid JSON object in exactly this format (no extra text, no markdown, no code fences):
{
  "score": <number from 0-100>,
  "scoreLabel": "<Poor / Fair / Good / Excellent>",
  "scoreDesc": "<2 sentence explanation of the score>",
  "match": <number from 0-100>,
  "matchDesc": "<1 sentence explaining the job match percentage>",
  "missingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "rewrites": [
    { "section": "<section name>", "tip": "<specific rewrite suggestion>" },
    { "section": "<section name>", "tip": "<specific rewrite suggestion>" },
    { "section": "<section name>", "tip": "<specific rewrite suggestion>" }
  ],
  "strengths": ["strength1", "strength2", "strength3"]
}

Be specific to the actual resume content and the "${jobRole}" job role. Give honest, actionable feedback.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. Always respond with valid JSON only. No markdown, no extra text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Groq API error. Please try again.')
  }

  const data = await response.json()

  // Extract text from Groq response
  const rawText = data.choices?.[0]?.message?.content

  if (!rawText) throw new Error('No response from AI. Please try again.')

  // Clean up any markdown code fences if present
  const clean = rawText.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch (e) {
    throw new Error('Could not parse AI response. Please try again.')
  }
}