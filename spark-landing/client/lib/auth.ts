import { supabase } from './supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  role?: string
  restaurant_id?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  full_name: string
  role?: string
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  error: string | null
}

// Authentication functions
export const auth = {
  // Sign in with email and password
  async signIn({ email, password }: LoginCredentials): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return { user: null, error }

      if (data.user) {
        // Fetch additional user profile data
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          full_name: profile?.full_name,
          role: profile?.role,
          restaurant_id: profile?.restaurant_id,
        }

        return { user: authUser, error: null }
      }

      return { user: null, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  },

  // Sign up with email and password
  async signUp({ email, password, full_name, role = 'user' }: SignUpCredentials): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          },
        },
      })

      if (error) return { user: null, error }

      if (data.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name,
            role,
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          full_name,
          role,
        }

        return { user: authUser, error: null }
      }

      return { user: null, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  },

  // Sign out
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Get current session
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession()
      return { session: data.session, error }
    } catch (error) {
      return { session: null, error: error as AuthError }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) return { user: null, error }

      // Fetch additional user profile data
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      const authUser: AuthUser = {
        id: user.id,
        email: user.email!,
        full_name: profile?.full_name,
        role: profile?.role,
        restaurant_id: profile?.restaurant_id,
      }

      return { user: authUser, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  },

  // Update password
  async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  },
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}
