import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    const userState = {
      token: userData.token,
      email: userData.email,
      id: userData.id,
      username: userData.username,
      isAdmin: userData.isAdmin || false
    }
    setUser(userState)
    localStorage.setItem('user', JSON.stringify(userState))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 