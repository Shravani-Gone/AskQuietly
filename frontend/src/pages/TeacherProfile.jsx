import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function TeacherProfile() {
  const nav = useNavigate()
  const { user, login, logout } = useAuth()
  const [form, setForm] = useState({ email: user?.email || '', name: user?.username || '', newPassword: '', confirmPassword: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const token = sessionStorage.getItem('token')
  const initial = user?.username?.[0]?.toUpperCase() || 'T'
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const save = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) return setError('Passwords do not match')
    if (form.newPassword && form.newPassword.length < 6) return setError('Password must be at least 6 characters')
    setSaving(true); setMsg(''); setError('')
    try {
      const body = { email: form.email, full_name: form.name }
      if (form.newPassword) body.password = form.newPassword
      const res = await fetch(`${API}/api/auth/profile/teacher`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      login({ ...user, email: form.email, username: form.name }, token)
      setMsg('✅ Profile updated successfully!')
      setForm(f => ({ ...f, newPassword: '', confirmPassword: '' }))
    } catch(e) { setError(e.message) }
    setSaving(false)
  }

  const inp = { width:'100%', padding:'13px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }
  const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }

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
                <button onClick={() => { setMenuOpen(false); nav('/teacher/help') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#374151' }}>❓ Help</button>
                <button onClick={() => { setMenuOpen(false); logout(); nav('/') }} style={{ width:'100%', padding:'12px 16px', border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight:600, color:'#EF4444' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'24px 20px', flex:1 }}>
          <button onClick={() => nav('/teacher/subjects')} style={{ background:'none', border:'none', cursor:'pointer', color:'#7C3AED', fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:4, marginBottom:20, padding:0 }}>← Back</button>

          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#EC4899,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:800, fontSize:22, fontFamily:'Nunito,sans-serif', flexShrink:0 }}>{initial}</div>
            <div>
              <h2 style={{ fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:20, margin:0 }}>{user?.username}</h2>
              <p style={{ fontSize:13, color:'#9ca3af', margin:'2px 0 0' }}>Teacher • {user?.branch}</p>
            </div>
          </div>

          {msg && <div style={{ background:'#f0fdf4', color:'#16a34a', padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:600, marginBottom:16, border:'1px solid #bbf7d0' }}>{msg}</div>}
          {error && <div style={{ background:'#fef2f2', color:'#b91c1c', padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:600, marginBottom:16, border:'1px solid #fecaca' }}>{error}</div>}

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={lbl}>Full Name</label>
              <input value={form.name} onChange={e=>set('name',e.target.value)} style={inp} placeholder="Your full name"/>
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input value={form.email} onChange={e=>set('email',e.target.value)} style={inp} placeholder="your@email.com"/>
            </div>
            <div style={{ borderTop:'1px solid #f3f4f6', paddingTop:16, marginTop:4 }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:14 }}>Change Password (optional)</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={lbl}>New Password</label>
                  <div style={{ position:'relative' }}>
                    <input type={showPass?'text':'password'} value={form.newPassword} onChange={e=>set('newPassword',e.target.value)} style={{...inp, padding:'13px 36px 13px 14px'}} placeholder="Min 6 chars"/>
                    <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#9ca3af' }}>{showPass?'🙈':'👁️'}</button>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Confirm</label>
                  <input type="password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} style={inp} placeholder="Repeat"/>
                </div>
              </div>
            </div>
            <button onClick={save} disabled={saving} style={{ width:'100%', padding:14, background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif', opacity:saving?0.7:1, marginTop:4 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:9 }}/>}
    </div>
  )
}