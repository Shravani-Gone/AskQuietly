import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const COLORS = ['#7C3AED','#a855f7','#EC4899','#8B5CF6','#6366f1','#d946ef','#3B82F6','#10B981','#F59E0B','#EF4444']

export default function StudentUnits() {
  const nav = useNavigate()
  const { subjectId } = useParams()
  const { user, logout } = useAuth()
  const [units, setUnits] = useState([])
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = user?.username?.[0]?.toUpperCase() || 'S'

  useEffect(() => {
    fetch(`${API}/api/subjects/${subjectId}/units`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setUnits(d)
        } else {
          setUnits(d.units || [])
          setSubject(d.subject || null)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [subjectId])

  return (
    <div style={{ minHeight:'100vh', background:'#f3f4f6', display:'flex', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:430, background:'white', minHeight:'100vh' }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:17, color:'#7C3AED' }}>Ask Quietly</span>
          </div>
          <div style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(o=>!o)} style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', cursor:'pointer', color:'white', fontWeight:800, fontSize:15 }}>{initial}</button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:44, background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', minWidth:140, zIndex:100, overflow:'hidden' }}>
                <button onClick={() => { setMenuOpen(false); nav('/student/profile') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>👤 Profile</button>
                <button onClick={() => { setMenuOpen(false); nav('/student/help') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>❓ Help</button>
                <button onClick={() => { setMenuOpen(false); logout(); nav('/') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#EF4444' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'20px' }}>
          <button onClick={() => nav('/student')} style={{ background:'none', border:'none', cursor:'pointer', color:'#7C3AED', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:4, marginBottom:20, padding:0 }}>
            ← Back to Subjects
          </button>

          {subject && (
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
              <div style={{ width:50, height:50, borderRadius:13, background:'linear-gradient(135deg,#7C3AED,#EC4899)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:'white', fontWeight:800, fontSize:12 }}>{subject.name?.slice(0,2).toUpperCase()}</span>
              </div>
              <div>
                <div style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:20, color:'#111827' }}>{subject.name}</div>
                <div style={{ fontSize:12, color:'#9ca3af' }}>{subject.class} • {subject.branch}</div>
              </div>
            </div>
          )}

          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <span style={{ fontSize:16 }}>📚</span>
            <span style={{ fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:16, color:'#374151' }}>Units</span>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>Loading...</div>
          ) : units.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>No units found</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {units.map((u, i) => (
                <button key={u.id} onClick={() => nav(`/student/unit/${u.id}`)}
                  style={{ width:'100%', background:'white', border:'1px solid #f3f4f6', borderRadius:14, padding:'16px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', textAlign:'left' }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${COLORS[i % COLORS.length]},${COLORS[(i+2) % COLORS.length]})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontWeight:700, fontSize:13, color:'white' }}>{i+1}</span>
                  </div>
                  <div style={{ flex:1, fontWeight:600, fontSize:14, color:'#111827' }}>{u.name}</div>
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