import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const nav = useNavigate()
  const [selected, setSelected] = useState('')

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#7C3AED,#a855f7,#EC4899)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:400}}>
        <button onClick={() => nav('/')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',marginBottom:24,display:'flex',alignItems:'center',gap:6}}>
          ← Back
        </button>
        <div style={{background:'white',borderRadius:16,padding:'28px 24px',boxShadow:'0 8px 40px rgba(124,58,237,0.18)'}}>
          <div style={{textAlign:'center',marginBottom:24}}>
            <div style={{width:56,height:56,background:'linear-gradient(135deg,#f3e8ff,#fce7f3)',borderRadius:14,margin:'0 auto 14px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>🎓</div>
            <h2 style={{fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:22}}>Join Ask Quietly</h2>
            <p style={{color:'#6b7280',fontSize:14,marginTop:4}}>Select your role to get started</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            <div onClick={() => setSelected('student')} style={{
              border:`2px solid ${selected==='student'?'#7C3AED':'#e5e7eb'}`,
              borderRadius:14,padding:'20px 12px',cursor:'pointer',
              background:selected==='student'?'#faf5ff':'white',
              textAlign:'center',transition:'all 0.2s'
            }}>
              <div style={{fontSize:32,marginBottom:8}}>🎓</div>
              <div style={{fontWeight:800,fontSize:15,fontFamily:'Nunito,sans-serif',color:selected==='student'?'#7C3AED':'#374151'}}>Student</div>
            </div>
            <div onClick={() => setSelected('teacher')} style={{
              border:`2px solid ${selected==='teacher'?'#EC4899':'#e5e7eb'}`,
              borderRadius:14,padding:'20px 12px',cursor:'pointer',
              background:selected==='teacher'?'#fdf4ff':'white',
              textAlign:'center',transition:'all 0.2s'
            }}>
              <div style={{fontSize:32,marginBottom:8}}>👩‍🏫</div>
              <div style={{fontWeight:800,fontSize:15,fontFamily:'Nunito,sans-serif',color:selected==='teacher'?'#EC4899':'#374151'}}>Teacher</div>
            </div>
          </div>
          <button
            disabled={!selected}
            onClick={() => nav(`/register/${selected}`)}
            style={{
              width:'100%',padding:14,
              background:'linear-gradient(135deg,#7C3AED,#EC4899)',
              color:'white',border:'none',borderRadius:10,
              fontSize:15,fontWeight:700,cursor:'pointer',
              fontFamily:'Nunito,sans-serif',
              opacity:selected?1:0.5
            }}
          >
            Continue as {selected ? selected.charAt(0).toUpperCase()+selected.slice(1) : '...'}
          </button>
          <p style={{textAlign:'center',fontSize:13,color:'#6b7280',marginTop:16}}>
            Already have an account?{' '}
            <button onClick={() => nav('/signin')} style={{color:'#7C3AED',fontWeight:700,background:'none',border:'none',cursor:'pointer',fontSize:13}}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  )
}