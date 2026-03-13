import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function TeacherQuestion() {
  const nav = useNavigate()
  const { questionId } = useParams()
  const { user, logout } = useAuth()
  const [question, setQuestion] = useState(null)
  const [voters, setVoters] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [individualRatings, setIndividualRatings] = useState({})
  const [mode, setMode] = useState('referral')
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const [link, setLink] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')
  const [showWho, setShowWho] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const token = sessionStorage.getItem('token')
  const initial = user?.username?.[0]?.toUpperCase() || 'T'

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const d = await res.json()
      setQuestion(d.question || null)
      setVoters(d.voters || [])
      setFeedback(d.feedback || null)
      setIndividualRatings(d.individual_ratings || {})
    } catch(e) { console.error(e) }
  }, [questionId, token])

  useEffect(() => {
    fetchQuestion()
    const interval = setInterval(fetchQuestion, 10000)
    return () => clearInterval(interval)
  }, [fetchQuestion])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchQuestion()
    setRefreshing(false)
  }

  const submitAnswer = async () => {
    if (mode === 'referral' && !text.trim() && !file && !link.trim())
      return setSubmitMsg('❌ Please provide text, a file, or a link')
    if (mode === 'offline' && (!date || !time || !venue.trim()))
      return setSubmitMsg('❌ Please fill date, time and venue')
    if (mode === 'online' && !link.trim())
      return setSubmitMsg('❌ Please provide a meeting link')

    setSubmitting(true); setSubmitMsg('')
    try {
      const formData = new FormData()
      formData.append('question_id', questionId)
      formData.append('mode', mode)
      if (text.trim()) formData.append('text', text.trim())
      if (date) formData.append('date', date)
      if (time) formData.append('time', time)
      if (venue.trim()) formData.append('venue', venue.trim())
      if (link.trim()) formData.append('link', link.trim())
      if (file) formData.append('file', file)

      const res = await fetch(`${API}/api/answers`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed')
      setSubmitMsg('✅ Answer submitted!')
      setTimeout(() => nav(-1), 1800)
    } catch(e) { setSubmitMsg('❌ ' + e.message) }
    setSubmitting(false)
  }

  const getRatingById = (studentId) => individualRatings[studentId] || null

  const renderStars = (rating) => (
    <span style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: 13, color: s <= rating ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  )

  const inp = { width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
  const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }
  const modeBtn = (m, label, emoji) => (
    <button onClick={() => setMode(m)} style={{ flex: 1, padding: '10px 8px', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, background: mode === m ? 'linear-gradient(135deg,#7C3AED,#EC4899)' : '#f3f4f6', color: mode === m ? 'white' : '#6b7280' }}>
      {emoji} {label}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, background: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 17, color: '#7C3AED' }}>Ask Quietly</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#EC4899,#7C3AED)', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 800, fontSize: 15 }}>{initial}</button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 44, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 140, zIndex: 100, overflow: 'hidden' }}>
                <button onClick={() => { setMenuOpen(false); nav('/teacher/profile') }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>👤 Profile</button>
                <button onClick={() => { setMenuOpen(false); nav('/teacher/help') }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151' }}>❓ Help</button>
                <button onClick={() => { setMenuOpen(false); logout(); nav('/') }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#EF4444' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '20px', flex: 1 }}>
          <button onClick={() => nav(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, padding: 0 }}>
            ← Back
          </button>

          <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 18, margin: '0 0 20px', color: '#111827' }}>
            {question?.status === 'answered' ? 'View Answer' : 'Answer Doubt'}
          </h2>

          {question && (
            <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>❓ Student's Doubt</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'white', borderRadius: 8, padding: '3px 8px' }}>
                  <span style={{ fontSize: 12 }}>👍</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>{question.vote_count || 0}</span>
                </div>
              </div>
              <p style={{ fontWeight: 600, fontSize: 15, color: '#111827', margin: '0 0 10px', lineHeight: 1.5 }}>{question.text}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => setShowWho(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: 13, fontWeight: 700, padding: 0, textDecoration: 'underline' }}>
                  {showWho ? 'Hide' : '👁 View Who'}
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8 }}>
                  {refreshing ? '...' : '🔄 Refresh'}
                </button>
              </div>

              {showWho && (
                <div style={{ marginTop: 12, background: 'white', borderRadius: 10, padding: 12 }}>

                  <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', margin: '0 0 8px' }}>Asked by:</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, background: '#f5f3ff', borderRadius: 8, padding: '8px 10px' }}>
                    <span style={{ fontSize: 13, color: '#7C3AED', fontWeight: 700 }}>{question.asker_name || 'Student'}</span>
                    {getRatingById(question.asker_id)
                      ? renderStars(getRatingById(question.asker_id))
                      : <span style={{ fontSize: 11, color: '#9ca3af' }}>not rated</span>
                    }
                  </div>

                  {voters.length > 0 && (
                    <>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', margin: '0 0 8px' }}>Voted by:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {voters.map((v, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f3f4f6', borderRadius: 8, padding: '8px 10px' }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{v.username}</span>
                            {getRatingById(v.id)
                              ? renderStars(getRatingById(v.id))
                              : <span style={{ fontSize: 11, color: '#9ca3af' }}>not rated</span>
                            }
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {feedback && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Overall:</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{feedback.avg}</span>
                      {renderStars(Math.round(feedback.avg))}
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>({feedback.count} rating{feedback.count > 1 ? 's' : ''})</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {question?.status === 'answered' ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 16 }}>
              <p style={{ fontSize: 13, color: '#16a34a', fontWeight: 700, margin: '0 0 8px' }}>✅ Already Answered</p>
              {question.answer?.mode === 'offline' && (
                <>
                  <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>🏫 Offline Session</p>
                  {question.answer.date && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>📅 {new Date(question.answer.date).toLocaleDateString()}</p>}
                  {question.answer.time && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>🕐 {question.answer.time}</p>}
                  {question.answer.venue && <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>📍 {question.answer.venue}</p>}
                </>
              )}
              {question.answer?.mode === 'online' && (
                <>
                  <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>💻 Online Session</p>
                  {question.answer.date && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>📅 {new Date(question.answer.date).toLocaleDateString()}</p>}
                  {question.answer.time && <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>🕐 {question.answer.time}</p>}
                  {question.answer.link && <a href={question.answer.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>🔗 Join Meeting</a>}
                </>
              )}
              {question.answer?.mode === 'referral' && (
                <>
                  {question.answer.text && <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{question.answer.text}</p>}
                  {question.answer.link && <a href={question.answer.link} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: 13, color: '#2563eb', fontWeight: 600, marginTop: 6, wordBreak: 'break-all' }}>🔗 Reference Link</a>}
                  {question.answer.file_url && <a href={question.answer.file_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 13, color: 'white', fontWeight: 600, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>📄 Download File</a>}
                </>
              )}
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 10px' }}>Answer Mode</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {modeBtn('referral', 'Referral', '📎')}
                {modeBtn('offline', 'Offline', '🏫')}
                {modeBtn('online', 'Online', '💻')}
              </div>

              {mode === 'referral' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={lbl}>Answer Text (optional)</label>
                    <textarea placeholder="Type your answer..." value={text} onChange={e => setText(e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={lbl}>Reference Link (optional)</label>
                    <input placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Upload File (optional)</label>
                    <div style={{ border: '2px dashed #e9d5ff', borderRadius: 10, padding: 16, textAlign: 'center', cursor: 'pointer', background: '#faf5ff' }} onClick={() => document.getElementById('fileInput').click()}>
                      {file ? (
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED', margin: '0 0 4px' }}>📄 {file.name}</p>
                          <button onClick={e => { e.stopPropagation(); setFile(null) }} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✕ Remove</button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: 24, margin: '0 0 6px' }}>📁</p>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', margin: 0 }}>Tap to upload</p>
                        </div>
                      )}
                    </div>
                    <input id="fileInput" type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                  </div>
                </div>
              )}

              {mode === 'offline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 13, color: '#92400e', fontWeight: 600, margin: 0 }}>📢 Students will be notified about this offline session.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={lbl}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} /></div>
                    <div><label style={lbl}>Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} style={inp} /></div>
                  </div>
                  <div><label style={lbl}>Venue</label><input placeholder="e.g. Room 301..." value={venue} onChange={e => setVenue(e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Notes (optional)</label><textarea placeholder="Extra info..." value={text} onChange={e => setText(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} /></div>
                </div>
              )}

              {mode === 'online' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 13, color: '#1e40af', fontWeight: 600, margin: 0 }}>💻 Students will receive the meeting link.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={lbl}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} /></div>
                    <div><label style={lbl}>Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} style={inp} /></div>
                  </div>
                  <div><label style={lbl}>Meeting Link</label><input placeholder="https://meet.google.com/..." value={link} onChange={e => setLink(e.target.value)} style={inp} /></div>
                  <div><label style={lbl}>Notes (optional)</label><textarea placeholder="Extra info..." value={text} onChange={e => setText(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} /></div>
                </div>
              )}

              {submitMsg && (
                <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginTop: 16, background: submitMsg.includes('✅') ? '#f0fdf4' : '#fef2f2', color: submitMsg.includes('✅') ? '#16a34a' : '#b91c1c' }}>
                  {submitMsg}
                </div>
              )}

              <button onClick={submitAnswer} disabled={submitting} style={{ width: '100%', padding: 13, marginTop: 16, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Submitting...' : '✈ Submit Answer'}
              </button>
            </div>
          )}
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />}
    </div>
  )
}