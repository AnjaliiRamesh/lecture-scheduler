import React, { createContext, useState, useContext, useEffect } from 'react'

// 1. Create the notice board
const AuthContext = createContext()

// 2. Create the Provider — wraps the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user was already logged in (from localStorage)
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Login function — saves user info
  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    // Save to localStorage so login persists on page refresh
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Logout function — clears everything
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — easy way to read from the notice board
export const useAuth = () => {
  return useContext(AuthContext)
}