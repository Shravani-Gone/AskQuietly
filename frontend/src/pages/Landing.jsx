import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const nav = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) nav(user.role === 'teacher' ? '/teacher' : '/student', { replace: true })
  }, [user])

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#7C3AED 0%,#a855f7 50%,#EC4899 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{textAlign:'center',marginBottom:48}}>
        <div style={{width:80,height:80,background:'rgba(255,255,255,0.2)',borderRadius:22,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h1 style={{fontFamily:'Nunito,sans-serif',fontSize:42,fontWeight:900,color:'white',letterSpacing:'-0.02em',margin:0}}>Ask Quietly</h1>
        <p style={{color:'rgba(255,255,255,0.8)',fontSize:15,marginTop:10}}>Doubt solving made simple</p>
      </div>
      <div style={{width:'100%',maxWidth:380,display:'flex',flexDirection:'column',gap:14}}>
        <button onClick={() => nav('/signin')} style={{width:'100%',padding:16,background:'rgba(255,255,255,0.95)',color:'#7C3AED',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>
          Sign In
        </button>
        <button onClick={() => nav('/register')} style={{width:'100%',padding:16,background:'rgba(255,255,255,0.15)',color:'white',border:'1.5px solid rgba(255,255,255,0.4)',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>
          Create Account
        </button>
      </div>
    </div>
  )
}