import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function SignIn() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const submit = async () => {
    if (!form.username || !form.password) return setError('Please fill all fields')
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      login(data.user, data.token)
      nav(data.user.role === 'teacher' ? '/teacher' : '/student')
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#7C3AED,#a855f7,#EC4899)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:400}}>
        <button onClick={() => nav('/')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',marginBottom:24,display:'flex',alignItems:'center',gap:6,padding:0}}>
          ← Back
        </button>
        <div style={{background:'white',borderRadius:20,padding:'28px 24px',boxShadow:'0 8px 40px rgba(124,58,237,0.18)'}}>
          <h2 style={{fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:22,marginBottom:4}}>Welcome back 👋</h2>
          <p style={{color:'#6b7280',fontSize:14,marginBottom:24}}>Sign in to your account</p>
          {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:'10px 14px',borderRadius:8,fontSize:13,marginBottom:16,fontWeight:600}}>{error}</div>}
          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6}}>Username</label>
            <input
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm(f=>({...f,username:e.target.value}))}
              onKeyDown={e => e.key==='Enter' && submit()}
              style={{width:'100%',padding:'12px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6}}>Password</label>
            <div style={{position:'relative'}}>
              <input
                type={showPass?'text':'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f=>({...f,password:e.target.value}))}
                onKeyDown={e => e.key==='Enter' && submit()}
                style={{width:'100%',padding:'12px 40px 12px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
              />
              <button type="button" onClick={()=>setShowPass(p=>!p)}
                style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#9ca3af'}}>
                {showPass?'🙈':'👁️'}
              </button>
            </div>
          </div>
          <button onClick={submit} disabled={loading} style={{
            width:'100%',padding:14,
            background:'linear-gradient(135deg,#7C3AED,#EC4899)',
            color:'white',border:'none',borderRadius:10,
            fontSize:15,fontWeight:700,cursor:'pointer',
            fontFamily:'Nunito,sans-serif',opacity:loading?0.7:1
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p style={{textAlign:'center',fontSize:13,color:'#6b7280',marginTop:16}}>
            Don't have an account?{' '}
            <button onClick={() => nav('/register')} style={{color:'#7C3AED',fontWeight:700,background:'none',border:'none',cursor:'pointer',fontSize:13}}>
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}