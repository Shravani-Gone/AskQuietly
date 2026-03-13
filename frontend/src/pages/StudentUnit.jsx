import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function StarRating({ questionId, rating, onRate, eligible }) {
  const [hover, setHover] = useState(0)

  if (!eligible) return null

  return (
    <div style={{ marginTop: 10, padding: '10px 12px', background: '#fffbeb', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #fde68a' }}>
      <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>Rate this answer:</span>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(star => (
          <span key={star}
            onClick={() => !rating && onRate(questionId, star)}
            onMouseEnter={() => !rating && setHover(star)}
            onMouseLeave={() => !rating && setHover(0)}
            style={{ fontSize: 22, cursor: rating ? 'default' : 'pointer', color: star <= (hover || rating) ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s' }}>
            ★
          </span>
        ))}
      </div>
      {rating ? <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>✓ Rated</span> : null}
    </div>
  )
}

export default function StudentUnit() {
  const nav = useNavigate()
  const { unitId } = useParams()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('unanswered')
  const [unit, setUnit] = useState(null)
  const [subject, setSubject] = useState(null)
  const [answered, setAnswered] = useState([])
  const [unanswered, setUnanswered] = useState([])
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [voting, setVoting] = useState(null)
  // ratings stored in a ref so they NEVER reset on re-render or tab switch
  const ratingsRef = useRef({})
  const [ratingsVersion, setRatingsVersion] = useState(0)
  const token = sessionStorage.getItem('token')
  const initial = user?.username?.[0]?.toUpperCase() || 'S'

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API}/api/questions/unit/${unitId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAnswered(data.answered || [])
      setUnanswered(data.unanswered || [])
      setUnit(data.unit || null)
      setSubject(data.subject || null)
      // Only set ratings from backend if not already rated locally
      for (const q of (data.answered || [])) {
        if (q.my_rating && !ratingsRef.current[q.id]) {
          ratingsRef.current[q.id] = q.my_rating
        }
      }
      setRatingsVersion(v => v + 1)
    } catch(e) { console.error(e) }
  }

  useEffect(() => { fetchQuestions() }, [unitId])

  const handleRate = async (questionId, star) => {
    // Save to ref immediately so it never disappears
    ratingsRef.current[questionId] = star
    setRatingsVersion(v => v + 1)

    try {
      await fetch(`${API}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question_id: questionId, rating: star })
      })
    } catch(e) { console.error(e) }
  }

  const submitQuestion = async () => {
    if (!question.trim()) return
    setSubmitting(true); setSubmitMsg('')
    try {
      const res = await fetch(`${API}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ unit_id: unitId, text: question.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed')
      setQuestion('')
      setSubmitMsg('✅ Doubt submitted!')
      await fetchQuestions()
      setTimeout(() => { setSubmitMsg(''); setTab('unanswered') }, 1500)
    } catch(e) { setSubmitMsg('❌ ' + e.message) }
    setSubmitting(false)
  }

  const vote = async (questionId) => {
    if (voting === questionId) return
    setVoting(questionId)
    try {
      await fetch(`${API}/api/questions/${questionId}/vote`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }
      })
      await fetchQuestions()
    } catch(e) { console.error(e) }
    setVoting(null)
  }

  const tabStyle = (t) => ({
    padding: '8px 16px', border: 'none', borderRadius: 20, cursor: 'pointer',
    fontSize: 13, fontWeight: 600, fontFamily: 'Nunito,sans-serif',
    background: tab === t ? 'linear-gradient(135deg,#7C3AED,#EC4899)' : '#f3f4f6',
    color: tab === t ? 'white' : '#6b7280',
  })

  const renderAnswer = (q) => {
    const a = q.answer
    if (!a) return null
    if (a.mode === 'offline') return (
      <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: 12, marginTop: 10 }}>
        <p style={{ fontSize: 12, color: '#7C3AED', fontWeight: 700, margin: '0 0 8px' }}>🏫 Offline Session</p>
        {a.date && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>📅 {new Date(a.date).toLocaleDateString()}</p>}
        {a.time && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>🕐 {a.time}</p>}
        {a.venue && <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>📍 {a.venue}</p>}
        {a.text && <p style={{ fontSize: 13, color: '#374151', margin: '8px 0 0', paddingTop: 8, borderTop: '1px solid #fde68a' }}>{a.text}</p>}
      </div>
    )
    if (a.mode === 'online') return (
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 12, marginTop: 10 }}>
        <p style={{ fontSize: 12, color: '#1e40af', fontWeight: 700, margin: '0 0 8px' }}>💻 Online Session</p>
        {a.date && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>📅 {new Date(a.date).toLocaleDateString()}</p>}
        {a.time && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>🕐 {a.time}</p>}
        {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>🔗 Join Meeting</a>}
        {a.text && <p style={{ fontSize: 13, color: '#374151', margin: '8px 0 0', paddingTop: 8, borderTop: '1px solid #bfdbfe' }}>{a.text}</p>}
      </div>
    )
    return (
      <div style={{ background: 'white', borderRadius: 10, padding: 12, marginTop: 10, border: '1px solid #f3f4f6' }}>
        <p style={{ fontSize: 12, color: '#7C3AED', fontWeight: 700, margin: '0 0 6px' }}>📎 Teacher's Answer</p>
        {a.text && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 8px' }}>{a.text}</p>}
        {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: 13, color: '#2563eb', fontWeight: 600, marginBottom: 6, wordBreak: 'break-all' }}>🔗 Reference Link</a>}
        {a.file_url && <a href={a.file_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'white', fontWeight: 600, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>📄 Download File</a>}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, background: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 17, color: '#7C3AED' }}>Ask Quietly</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 800, fontSize: 15 }}>{initial}</button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 44, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 140, zIndex: 100, overflow: 'hidden' }}>
                <button onClick={() => { setMenuOpen(false); nav('/student/profile') }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>👤 Profile</button>
                <button onClick={() => { setMenuOpen(false); nav('/student/help') }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>❓ Help</button>
                <button onClick={() => { setMenuOpen(false); logout(); nav('/') }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#EF4444' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '20px', flex: 1 }}>
          <button onClick={() => nav(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, padding: 0 }}>
            ← Back to Units
          </button>

          {subject && <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px' }}>{subject.name}</p>}
          {unit && <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 18, margin: '0 0 20px', color: '#111827' }}>Unit {unit.order_index}: {unit.name}</h2>}

          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <button style={tabStyle('answered')} onClick={() => setTab('answered')}>✅ Answered ({answered.length})</button>
            <button style={tabStyle('unanswered')} onClick={() => setTab('unanswered')}>🕐 Pending ({unanswered.length})</button>
            <button style={tabStyle('ask')} onClick={() => setTab('ask')}>💬 Ask</button>
          </div>

          {tab === 'answered' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {answered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                  <p>No answered questions yet.</p>
                </div>
              ) : answered.map(q => (
                <div key={q.id} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 16 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: '0 0 4px' }}>{q.text}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px' }}>
                    {q.is_mine ? '👤 Asked by you • ' : ''}{new Date(q.created_at).toLocaleDateString()}
                  </p>
                  {renderAnswer(q)}
                  <StarRating
                    questionId={q.id}
                    rating={ratingsRef.current[q.id] || null}
                    eligible={q.is_mine || q.has_voted}
                    onRate={handleRate}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'unanswered' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {unanswered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
                  <p>No pending questions!</p>
                </div>
              ) : unanswered.map(q => (
                <div key={q.id} style={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 14, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: '0 0 6px' }}>{q.text}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                      {q.is_mine ? '👤 Asked by you • ' : ''}{new Date(q.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => !q.is_mine && !q.has_voted && vote(q.id)}
                    disabled={q.is_mine || q.has_voted || voting === q.id}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      background: q.has_voted ? '#e9d5ff' : q.is_mine ? '#f3f4f6' : '#f5f3ff',
                      border: `1px solid ${q.has_voted ? '#c4b5fd' : '#e9d5ff'}`,
                      borderRadius: 10, padding: '8px 10px',
                      cursor: q.is_mine || q.has_voted ? 'not-allowed' : 'pointer',
                      minWidth: 44, gap: 2, flexShrink: 0, opacity: q.is_mine ? 0.5 : 1
                    }}>
                    <span style={{ fontSize: 16 }}>{q.has_voted ? '✅' : '👍'}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>{q.vote_count || 0}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'ask' && (
            <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💬</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Ask a New Doubt</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>Anonymous to other students</p>
                </div>
              </div>
              <textarea
                placeholder="Type your doubt here..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e9d5ff', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'white' }}
              />
              {submitMsg && (
                <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginTop: 10, background: submitMsg.includes('✅') ? '#f0fdf4' : '#fef2f2', color: submitMsg.includes('✅') ? '#16a34a' : '#b91c1c' }}>
                  {submitMsg}
                </div>
              )}
              <button onClick={submitQuestion} disabled={submitting || !question.trim()} style={{ width: '100%', padding: 13, marginTop: 12, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (submitting || !question.trim()) ? 0.6 : 1 }}>
                {submitting ? 'Submitting...' : '✈ Submit Doubt'}
              </button>
            </div>
          )}
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />}
    </div>
  )
}