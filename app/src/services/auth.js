/**
 * Authentication service — wraps Supabase Auth.
 *
 * Supports email/password and magic link (passwordless) auth.
 * When Supabase is not configured, provides a mock auth state
 * so the app works locally without a backend.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ── Auth Functions ──────────────────────────────────────────

export async function signUp({ email, password, displayName }) {
  if (!isSupabaseConfigured()) {
    return mockUser(email, displayName)
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  })

  if (error) throw error
  return data.user
}

export async function signIn({ email, password }) {
  if (!isSupabaseConfigured()) {
    return mockUser(email)
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data.user
}

export async function signInWithMagicLink(email) {
  if (!isSupabaseConfigured()) {
    return mockUser(email)
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  })

  if (error) throw error
  return { message: 'Check your email for a login link' }
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    localStorage.removeItem('mock-user')
    return
  }

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    const mock = localStorage.getItem('mock-user')
    return mock ? JSON.parse(mock) : null
  }

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  if (!isSupabaseConfigured()) {
    const user = await getCurrentUser()
    return user ? { user } : null
  }

  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Listen for auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured()) {
    // No-op for local mode
    return () => {}
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session)
    }
  )

  return () => subscription.unsubscribe()
}

export async function resetPassword(email) {
  if (!isSupabaseConfigured()) {
    return { message: 'Password reset not available in local mode' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
  return { message: 'Check your email for a password reset link' }
}


// ── Mock Auth (local development) ──────────────────────────

function mockUser(email, displayName) {
  const user = {
    id: 'local-user-' + Date.now(),
    email,
    user_metadata: { display_name: displayName || email.split('@')[0] },
  }
  localStorage.setItem('mock-user', JSON.stringify(user))
  return user
}
