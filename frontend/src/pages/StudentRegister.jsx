import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const BRANCHES = ['Information Technology','Computer Science','ENTC','AI/ML','Mechanical','Civil']
const CLASSES = ['FY','SY','TY','Final']
const DIVISIONS = ['A','B','C','D','E','F','G','H']

export default function StudentRegister() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username:'', email:'', class_year:'', branch:'', division:'', roll_number:'', password:'', confirm:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const submit = async () => {
    if (!form.username||!form.email||!form.class_year||!form.branch||!form.division||!form.roll_number||!form.password)
      return setError('Please fill all fields')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/auth/register/student`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          class_year: form.class_year,
          branch: form.branch,
          division: form.division,
          roll_number: form.roll_number,
          password: form.password
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      login(data.user, data.token)
      nav('/student/subjects')
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  const inp = { width:'100%', padding:'13px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }
  const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#7C3AED,#a855f7,#EC4899)',display:'flex',justifyContent:'center',alignItems:'flex-start'}}>
      <div style={{width:'100%',maxWidth:430,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'40px 20px 0'}}>
          <button onClick={() => nav('/register')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6,marginBottom:24,padding:0}}>
            ← Change role
          </button>
        </div>
        <div style={{flex:1,background:'white',borderRadius:'24px 24px 0 0',padding:'28px 24px'}}>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
            <div style={{width:50,height:50,background:'linear-gradient(135deg,#7C3AED,#EC4899)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>🎓</div>
            <div>
              <h2 style={{fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:20,margin:0}}>Student Registration</h2>
              <p style={{color:'#9ca3af',fontSize:13,margin:'2px 0 0'}}>Fill in your details below</p>
            </div>
          </div>

          {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:'10px 14px',borderRadius:10,fontSize:13,marginBottom:16,fontWeight:600,border:'1px solid #fecaca'}}>{error}</div>}

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={lbl}>Full Name</label>
              <input placeholder="Enter your name" value={form.username} onChange={e=>set('username',e.target.value)} style={inp}/>
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} style={inp}/>
            </div>
            <div>
              <label style={lbl}>Branch</label>
              <select value={form.branch} onChange={e=>set('branch',e.target.value)} style={{...inp,background:'white'}}>
                <option value=''>Select branch</option>
                {BRANCHES.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label style={lbl}>Class (Year)</label>
                <select value={form.class_year} onChange={e=>set('class_year',e.target.value)} style={{...inp,padding:'13px 10px',background:'white'}}>
                  <option value=''>Select</option>
                  {CLASSES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Division</label>
                <select value={form.division} onChange={e=>set('division',e.target.value)} style={{...inp,padding:'13px 10px',background:'white'}}>
                  <option value=''>Select</option>
                  {DIVISIONS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={lbl}>Roll Number</label>
              <input placeholder="e.g. 101" value={form.roll_number} onChange={e=>set('roll_number',e.target.value)} style={inp}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label style={lbl}>Password</label>
                <div style={{position:'relative'}}>
                  <input type={showPass?'text':'password'} placeholder="Min 6 chars" value={form.password} onChange={e=>set('password',e.target.value)}
                    style={{...inp,padding:'13px 36px 13px 10px'}}/>
                  <button type="button" onClick={()=>setShowPass(p=>!p)}
                    style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:15,color:'#9ca3af'}}>
                    {showPass?'🙈':'👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label style={lbl}>Confirm</label>
                <div style={{position:'relative'}}>
                  <input type={showConfirm?'text':'password'} placeholder="Repeat" value={form.confirm} onChange={e=>set('confirm',e.target.value)}
                    style={{...inp,padding:'13px 36px 13px 10px'}}/>
                  <button type="button" onClick={()=>setShowConfirm(p=>!p)}
                    style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:15,color:'#9ca3af'}}>
                    {showConfirm?'🙈':'👁️'}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={submit} disabled={loading} style={{
              width:'100%',padding:15,marginTop:4,
              background:'linear-gradient(135deg,#7C3AED,#EC4899)',
              color:'white',border:'none',borderRadius:12,
              fontSize:15,fontWeight:700,cursor:'pointer',
              fontFamily:'Nunito,sans-serif',opacity:loading?0.7:1
            }}>
              {loading ? 'Creating account...' : 'Create Account & Sign In'}
            </button>
            <p style={{textAlign:'center',fontSize:13,color:'#6b7280',margin:0}}>
              Already have an account?{' '}
              <button onClick={()=>nav('/signin')} style={{color:'#7C3AED',fontWeight:700,background:'none',border:'none',cursor:'pointer',fontSize:13}}>Sign in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}