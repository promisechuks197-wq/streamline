import { createContext, useContext, useState, useCallback } from 'react'

const AdminContext = createContext()

const ADMIN_CREDENTIALS = {
  email: 'admin@streamlined.com',
  password: 'admin123',
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_session')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = { email, name: 'Admin User', role: 'admin', loginTime: Date.now() }
      localStorage.setItem('admin_session', JSON.stringify(session))
      setAdmin(session)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_session')
    setAdmin(null)
  }, [])

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
