import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const COLORS = ['#7C3AED','#a855f7','#EC4899','#8B5CF6','#6366f1','#d946ef','#3B82F6','#10B981','#F59E0B','#EF4444']

export default function TeacherSubjects() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = user?.username?.[0]?.toUpperCase() || 'T'

  useEffect(() => {
    fetch(`${API}/api/subjects/teacher`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(d => { setSubjects(Array.isArray(d) ? d : d.subjects || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'#f3f4f6', display:'flex', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:430, background:'white', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:17, color:'#7C3AED' }}>Ask Quietly</span>
          </div>
          <div style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(o=>!o)} style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#EC4899,#7C3AED)', border:'none', cursor:'pointer', color:'white', fontWeight:800, fontSize:15 }}>{initial}</button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:44, background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', minWidth:140, zIndex:100, overflow:'hidden' }}>
                <button onClick={() => { setMenuOpen(false); nav('/teacher/profile') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>👤 Profile</button>
                <button onClick={() => { setMenuOpen(false); nav('/teacher/help') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>❓ Help</button>
                <button onClick={() => { setMenuOpen(false); logout(); nav('/') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#EF4444' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'24px 20px', flex:1 }}>
          <div style={{ marginBottom:24 }}>
            <h1 style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:26, margin:0 }}>
              Hello, <span style={{ color:'#7C3AED' }}>{user?.username}</span> 👋
            </h1>
            <p style={{ color:'#6b7280', fontSize:14, marginTop:4 }}>Teacher • {user?.branch}</p>
          </div>

          <h2 style={{ fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:16, color:'#374151', marginBottom:14 }}>Your Subjects</h2>

          {loading ? (
            <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Loading subjects...</div>
          ) : subjects.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>
              <div style={{ fontSize:40, marginBottom:8 }}>📚</div>
              <p>No subjects assigned yet.</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {subjects.map((s, i) => (
                <button key={s.id} onClick={() => nav(`/teacher/units/${s.id}`)}
                  style={{ width:'100%', background:'white', border:'1px solid #f3f4f6', borderRadius:14, padding:'14px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', textAlign:'left' }}>
                  <div style={{ width:46, height:46, borderRadius:12, background:`linear-gradient(135deg,${COLORS[i % COLORS.length]},${COLORS[(i+3) % COLORS.length]})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ color:'white', fontWeight:800, fontSize:11 }}>{s.name.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'#111827', fontFamily:'Nunito,sans-serif' }}>{s.name}</div>
                    <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>
                      {s.class && `${s.class} • `}{s.division && `Div ${s.division}`}
                    </div>
                  </div>
                  <span style={{ color:'#d1d5db', fontSize:18 }}>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:9 }}/>}
    </div>
  )
}