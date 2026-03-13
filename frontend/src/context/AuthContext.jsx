import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = sessionStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  })

  const login = (userData, token) => {
    sessionStorage.setItem('user', JSON.stringify(userData))
    sessionStorage.setItem('token', token)
    setUser(userData)
  }

  const logout = () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)