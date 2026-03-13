import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FAQS = [
  { q: 'How do I ask a doubt?', a: 'Go to Subjects → select a subject → select a unit → tap the "💬 Ask Doubt" tab → type your question → tap Submit.' },
  { q: 'Will other students see my name?', a: 'No. Your identity is completely anonymous to other students. Only your teacher can see who asked which question.' },
  { q: 'How do I vote for a question?', a: 'In the Unanswered tab, tap the 👍 button on any question asked by another student. You can only vote once per question.' },
  { q: 'How will I know when my doubt is answered?', a: 'The question will automatically move from the Unanswered tab to the Answered tab once your teacher responds.' },
  { q: 'How do I change my password?', a: 'Go to Profile (tap your avatar at top right) → scroll down to "Change Password" → enter new password → tap Save Changes.' },
  { q: 'How do I change my email or division?', a: 'Go to Profile → update your email, class, division, or roll number → tap Save Changes.' },
  { q: 'Why can I not see any subjects?', a: 'Subjects are shown only for students with Branch = Information Technology, Class = SY, and Division A or B. Check your profile details.' },
  { q: 'Can I edit or delete a question I asked?', a: 'Currently questions cannot be edited or deleted after submission. Make sure your doubt is clear before submitting.' },
  { q: 'What does the vote count mean?', a: 'The more votes a question gets, the higher its priority. Teachers see questions sorted by votes — most voted = answered first.' },
  { q: 'How do I logout?', a: 'Tap your avatar (circle with your initial) at the top right → tap 🚪 Logout.' },
]

export default function StudentHelp() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = user?.username?.[0]?.toUpperCase() || 'S'

  return (
    <div style={{ minHeight:'100vh', background:'#f3f4f6', display:'flex', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:430, background:'white', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:17, color:'#7C3AED' }}>Ask Quietly</span>
          </div>
          <div style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(o=>!o)} style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', border:'none', cursor:'pointer', color:'white', fontWeight:800, fontSize:15 }}>{initial}</button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:44, background:'white', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', minWidth:140, zIndex:100, overflow:'hidden' }}>
                <button onClick={() => { setMenuOpen(false); nav('/student/subjects') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>📚 Subjects</button>
                <button onClick={() => { setMenuOpen(false); nav('/student/profile') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>👤 Profile</button>
                <button onClick={() => { setMenuOpen(false); logout(); nav('/') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#EF4444' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'24px 20px', flex:1 }}>
          <button onClick={() => nav('/student/subjects')} style={{ background:'none', border:'none', cursor:'pointer', color:'#7C3AED', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:4, marginBottom:20, padding:0 }}>← Back</button>

          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:22, margin:'0 0 6px' }}>Help & FAQ</h2>
            <p style={{ fontSize:14, color:'#6b7280', margin:0 }}>Answers to common questions about Ask Quietly</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: open===i ? '#faf5ff' : 'white', border:`1px solid ${open===i?'#e9d5ff':'#f3f4f6'}`, borderRadius:12, overflow:'hidden', transition:'all 0.2s' }}>
                <button onClick={() => setOpen(open===i ? null : i)} style={{ width:'100%', padding:'14px 16px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, textAlign:'left' }}>
                  <span style={{ fontWeight:600, fontSize:14, color:'#111827', flex:1 }}>{faq.q}</span>
                  <span style={{ fontSize:16, color:'#7C3AED', flexShrink:0, transition:'transform 0.2s', transform: open===i ? 'rotate(180deg)' : 'none' }}>▾</span>
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