import { createContext, useContext, useState, useEffect } from 'react'
import * as auth from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    auth.getSession().then((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const unsubscribe = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') setUser(null)
    })

    return unsubscribe
  }, [])

  const signUp = async ({ email, password, displayName }) => {
    const user = await auth.signUp({ email, password, displayName })
    setUser(user)
    return user
  }

  const signIn = async ({ email, password }) => {
    const user = await auth.signIn({ email, password })
    setUser(user)
    return user
  }

  const signInWithMagicLink = async (email) => {
    return auth.signInWithMagicLink(email)
  }

  const signOut = async () => {
    await auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
