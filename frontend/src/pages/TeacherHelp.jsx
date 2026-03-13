import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FAQS = [
  { q: 'How do I see pending doubts?', a: 'Go to Subjects → select a subject → select a unit → tap the "🕐 Pending" tab to see all unanswered questions sorted by votes.' },
  { q: 'How do I answer a doubt?', a: 'Tap any pending question → write your answer in the text box → tap Submit Answer. The question moves to Answered immediately.' },
  { q: 'What is "View Who"?', a: 'On the question detail page, View Who shows you the names of students who asked the question and who voted for it, helping you track engagement.' },
  { q: 'How are questions ranked?', a: 'Questions are sorted by vote count — the most upvoted question appears at the top so you can prioritize the most common doubts.' },
  { q: 'How do I change my password?', a: 'Tap your avatar at the top right → Profile → scroll to Change Password → enter new password → Save Changes.' },
  { q: 'How do I update my name or email?', a: 'Go to Profile (via your avatar menu) → update your name or email → tap Save Changes.' },
  { q: 'Will students know who answered?', a: 'Yes. Students see "Teacher\'s Answer" when a question is answered, and the question moves to the Answered tab.' },
  { q: 'How do I logout?', a: 'Tap your avatar (circle at top right) → tap 🚪 Logout.' },
]

export default function TeacherHelp() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = user?.username?.[0]?.toUpperCase() || 'T'

  return (
    <div style={{ minHeight:'100vh', background:'#f3f4f6', display:'flex', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:430, background:'white', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:17, color:'#7C3AED' }}>Ask Quietly</span>
          </div>
          <div style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(o=>!o)} style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#EC4899,#7C3AED)', border:'none', cursor:'pointer', color:'white', fontWeight:800, fontSize:15 }}>{initial}</button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:44, background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', minWidth:140, zIndex:100, overflow:'hidden' }}>
                <button onClick={() => { setMenuOpen(false); nav('/teacher/subjects') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>📚 Subjects</button>
                <button onClick={() => { setMenuOpen(false); nav('/teacher/profile') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>👤 Profile</button>
                <button onClick={() => { setMenuOpen(false); logout(); nav('/') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#EF4444' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'24px 20px', flex:1 }}>
          <button onClick={() => nav('/teacher/subjects')} style={{ background:'none', border:'none', cursor:'pointer', color:'#7C3AED', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:4, marginBottom:20, padding:0 }}>← Back</button>

          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:22, margin:'0 0 6px' }}>Help & FAQ</h2>
            <p style={{ fontSize:14, color:'#6b7280', margin:0 }}>Answers to common questions about Ask Quietly</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: open===i ? '#fdf4ff' : 'white', border:`1px solid ${open===i?'#f0abfc':'#f3f4f6'}`, borderRadius:12, overflow:'hidden' }}>
                <button onClick={() => setOpen(open===i ? null : i)} style={{ width:'100%', padding:'14px 16px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, textAlign:'left' }}>
                  <span style={{ fontWeight:600, fontSize:14, color:'#111827', flex:1 }}>{faq.q}</span>
                  <span style={{ fontSize:16, color:'#EC4899', flexShrink:0, transition:'transform 0.2s', transform: open===i ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                {open===i && (
                  <div style={{ padding:'0 16px 14px' }}>
                    <p style={{ fontSize:14, color:'#4b5563', margin:0, lineHeight:1.6 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:9 }}/>}
    </div>
  )
}