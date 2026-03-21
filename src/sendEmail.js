import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

emailjs.init(PUBLIC_KEY)

// ── Send Resume Analysis Results ──
export async function sendAnalysisEmail({ toEmail, toName, jobRole, results }) {
  const strengths     = results.strengths?.join(', ')     || 'N/A'
  const missingSkills = results.missingSkills?.join(', ') || 'N/A'
  const rewrites      = results.rewrites?.map(r => `${r.section}: ${r.tip}`).join('\n') || 'N/A'

  const params = {
    to_email:     toEmail,
    to_name:      toName,
    job_role:     jobRole,
    score:        results.score,
    score_label:  results.scoreLabel,
    match:        results.match,
    strengths,
    missing_skills: missingSkills,
    rewrites,
    test_score:   'N/A',
    resources:    'Run the Skill Roadmap in the app to get personalized free resources!',
  }

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
}

// ── Send Mock Test Results ──
export async function sendTestEmail({ toEmail, toName, jobRole, score, strongTopics, weakTopics, questions, answers }) {
  const strong   = strongTopics.join(', ')   || 'None yet'
  const weak     = weakTopics.join(', ')     || 'None'
  const wrongQs  = questions
    .filter((q, i) => answers[i] !== q.correct)
    .map(q => `Q: ${q.question}\nCorrect Answer: ${q.correct}\nExplanation: ${q.explanation}`)
    .join('\n\n') || 'All correct!'

  const params = {
    to_email:       toEmail,
    to_name:        toName,
    job_role:       jobRole,
    score:          'See mock test',
    score_label:    score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work',
    match:          'N/A',
    strengths:      `Strong Topics: ${strong}`,
    missing_skills: `Weak Topics: ${weak}`,
    rewrites:       `Questions to Review:\n${wrongQs}`,
    test_score:     `${score}% (${questions.filter((q, i) => answers[i] === q.correct).length}/${questions.length} correct)`,
    resources:      'Check the Skill Roadmap in the app for free learning resources on your weak topics!',
  }

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
}