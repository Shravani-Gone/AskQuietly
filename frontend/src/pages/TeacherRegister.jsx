import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const BRANCHES = ['Information Technology','Computer Science','ENTC','Mechanical','Civil']
const CLASSES = ['FY','SY','TY','Final']
const DIVISIONS = ['A','B','C','D','E','F','G','H']

export default function TeacherRegister() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', branch:'', password:'', confirm:'' })
  const [subjects, setSubjects] = useState([{ subject_name:'', class_year:'', division:'' }])
  const [subjectOptions, setSubjectOptions] = useState({}) // key: "i" -> array of subject names
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const addSubject = () => setSubjects(s=>[...s,{subject_name:'',class_year:'',division:''}])
  const removeSubject = (i) => {
    setSubjects(s=>s.filter((_,idx)=>idx!==i))
    setSubjectOptions(o => { const n={...o}; delete n[i]; return n })
  }

  const setSubj = async (i, k, v) => {
    const updated = subjects.map((item,idx)=>idx===i?{...item,[k]:v, ...(k==='class_year'?{subject_name:''}:{})}:item)
    setSubjects(updated)

    // Fetch subjects when branch (from form) and class_year are both selected
    const row = updated[i]
    const branch = form.branch
    const classYear = k === 'class_year' ? v : row.class_year

    if (branch && classYear && k === 'class_year') {
      try {
        const res = await fetch(`${API}/api/subjects/by-branch-class?branch=${encodeURIComponent(branch)}&class=${encodeURIComponent(classYear)}`)
        const data = await res.json()
        setSubjectOptions(o => ({ ...o, [i]: data.map(s => s.name) }))
      } catch(e) { console.error(e) }
    }
  }

  // When branch changes, clear all subject selections and refetch for rows that have class_year
  const handleBranchChange = async (branch) => {
    set('branch', branch)
    setSubjects(s => s.map(item => ({ ...item, subject_name: '' })))
    setSubjectOptions({})

    // Refetch for any rows that already have class_year selected
    subjects.forEach(async (row, i) => {
      if (row.class_year && branch) {
        try {
          const res = await fetch(`${API}/api/subjects/by-branch-class?branch=${encodeURIComponent(branch)}&class=${encodeURIComponent(row.class_year)}`)
          const data = await res.json()
          setSubjectOptions(o => ({ ...o, [i]: data.map(s => s.name) }))
        } catch(e) { console.error(e) }
      }
    })
  }

  const submit = async () => {
    if (!form.name||!form.email||!form.branch||!form.password) return setError('Please fill all fields')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/auth/register/teacher`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          branch: form.branch,
          password: form.password,
          subjects: subjects.filter(s=>s.subject_name&&s.class_year&&s.division)
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      login(data.user, data.token)
      nav('/teacher')
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
            <div style={{width:50,height:50,background:'linear-gradient(135deg,#EC4899,#7C3AED)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>👩‍🏫</div>
            <div>
              <h2 style={{fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:20,margin:0}}>Teacher Registration</h2>
              <p style={{color:'#9ca3af',fontSize:13,margin:'2px 0 0'}}>Fill in your details below</p>
            </div>
          </div>

          {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:'10px 14px',borderRadius:10,fontSize:13,marginBottom:16,fontWeight:600,border:'1px solid #fecaca'}}>{error}</div>}

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={lbl}>Full Name</label>
              <input placeholder="Enter your full name" value={form.name} onChange={e=>set('name',e.target.value)} style={inp}/>
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} style={inp}/>
            </div>
            <div>
              <label style={lbl}>Branch</label>
              <select value={form.branch} onChange={e=>handleBranchChange(e.target.value)} style={{...inp,background:'white'}}>
                <option value=''>Select branch</option>
                {BRANCHES.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>

            {/* Subjects */}
            <div>
              <label style={lbl}>Subjects You Teach</label>
              {!form.branch && (
                <p style={{fontSize:12,color:'#f59e0b',fontWeight:600,margin:'0 0 8px'}}>⚠️ Please select your branch first</p>
              )}
              <div style={{border:'1.5px solid #e5e7eb',borderRadius:12,padding:14,display:'flex',flexDirection:'column',gap:12}}>
                {subjects.map((s,i) => (
                  <div key={i} style={{display:'flex',flexDirection:'column',gap:8,paddingBottom:i<subjects.length-1?12:0,borderBottom:i<subjects.length-1?'1px solid #f3f4f6':'none'}}>

                    {/* Class first */}
                    <select
                      value={s.class_year}
                      onChange={e=>setSubj(i,'class_year',e.target.value)}
                      disabled={!form.branch}
                      style={{...inp,background:'white',padding:'11px 14px',opacity:!form.branch?0.5:1}}>
                      <option value=''>Select class</option>
                      {CLASSES.map(c=><option key={c}>{c}</option>)}
                    </select>

                    {/* Subject based on branch+class */}
                    <select
                      value={s.subject_name}
                      onChange={e=>setSubj(i,'subject_name',e.target.value)}
                      disabled={!s.class_year || !subjectOptions[i]}
                      style={{...inp,background:'white',padding:'11px 14px',opacity:(!s.class_year||!subjectOptions[i])?0.5:1}}>
                      <option value=''>
                        {!s.class_year ? 'Select class first' : !subjectOptions[i] ? 'Loading subjects...' : 'Select subject'}
                      </option>
                      {(subjectOptions[i] || []).map(sub=><option key={sub}>{sub}</option>)}
                    </select>

                    {/* Division */}
                    <select
                      value={s.division}
                      onChange={e=>setSubj(i,'division',e.target.value)}
                      style={{...inp,background:'white',padding:'11px 14px'}}>
                      <option value=''>Select division</option>
                      {DIVISIONS.map(d=><option key={d}>{d}</option>)}
                    </select>

                    {subjects.length > 1 && (
                      <button onClick={()=>removeSubject(i)} style={{background:'none',border:'none',color:'#EF4444',fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'left',padding:0}}>✕ Remove</button>
                    )}
                  </div>
                ))}
                <button onClick={addSubject} style={{background:'none',border:'1.5px dashed #e9d5ff',borderRadius:8,padding:'10px',color:'#7C3AED',fontSize:13,fontWeight:700,cursor:'pointer'}}>
                  + Add Subject
                </button>
              </div>
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