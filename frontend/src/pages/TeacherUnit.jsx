import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function TeacherUnit() {
  const nav = useNavigate()
  const { unitId } = useParams()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('pending')
  const [unit, setUnit] = useState(null)
  const [subject, setSubject] = useState(null)
  const [pending, setPending] = useState([])
  const [answered, setAnswered] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const token = sessionStorage.getItem('token')
  const initial = user?.username?.[0]?.toUpperCase() || 'T'

  useEffect(() => {
    fetch(`${API}/api/questions/teacher/unit/${unitId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        setPending(d.pending || [])
        setAnswered(d.answered || [])
        setUnit(d.unit || null)
        setSubject(d.subject || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [unitId])

  const tabStyle = (t) => ({
    padding: '8px 20px', border: 'none', borderRadius: 20, cursor: 'pointer',
    fontSize: 13, fontWeight: 600, fontFamily: 'Nunito,sans-serif',
    background: tab === t ? 'linear-gradient(135deg,#7C3AED,#EC4899)' : '#f3f4f6',
    color: tab === t ? 'white' : '#6b7280'
  })

  const renderStars = (avg) => {
    if (!avg) return null
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} style={{ fontSize: 14, color: s <= Math.round(avg) ? '#f59e0b' : '#d1d5db' }}>★</span>
        ))}
        <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{avg} avg</span>
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
          <button onClick={() => nav(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, padding: 0 }}>
            ← Back to Units
          </button>

          {subject && <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px' }}>{subject.name}</p>}
          {unit && <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 18, margin: '0 0 20px', color: '#111827' }}>Unit {unit.order_index}: {unit.name}</h2>}

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button style={tabStyle('pending')} onClick={() => setTab('pending')}>🕐 Pending ({pending.length})</button>
            <button style={tabStyle('answered')} onClick={() => setTab('answered')}>✅ Answered ({answered.length})</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading...</div>
          ) : tab === 'pending' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
                  <p>No pending questions!</p>
                </div>
              ) : pending.map(q => (
                <button key={q.id} onClick={() => nav(`/teacher/question/${q.id}`)}
                  style={{ width: '100%', background: 'white', border: '1px solid #f3f4f6', borderRadius: 14, padding: 16, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0, flex: 1 }}>{q.text}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f5f3ff', borderRadius: 8, padding: '4px 8px', flexShrink: 0 }}>
                      <span style={{ fontSize: 12 }}>👍</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>{q.vote_count || 0}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 0' }}>{new Date(q.created_at).toLocaleDateString()} • Tap to answer</p>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {answered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📝</div>
                  <p>No answered questions yet.</p>
                </div>
              ) : answered.map(q => (
                <button key={q.id} onClick={() => nav(`/teacher/question/${q.id}`)}
                  style={{ width: '100%', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 16, cursor: 'pointer', textAlign: 'left' }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: '0 0 6px' }}>{q.text}</p>
                  {q.answer && (
                    <p style={{ fontSize: 12, color: '#16a34a', margin: '0 0 4px', fontWeight: 600 }}>
                      ✅ {q.answer.mode === 'offline' ? '🏫 Offline session' : q.answer.mode === 'online' ? '💻 Online session' : '📎 Referral answer'}
                    </p>
                  )}
                  {renderStars(q.feedback_avg)}
                  {q.feedback_count > 0 && <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{q.feedback_count} rating{q.feedback_count > 1 ? 's' : ''}</p>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />}
    </div>
  )
}