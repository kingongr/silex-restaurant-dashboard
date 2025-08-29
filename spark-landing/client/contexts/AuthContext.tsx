import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { auth, onAuthStateChange, AuthUser, AuthState } from '../lib/auth'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await auth.getSession()
        
        if (error) {
          setState(prev => ({ ...prev, error: error.message, loading: false }))
          return
        }

        if (session) {
          const { user, error: userError } = await auth.getCurrentUser()
          
          if (userError) {
            setState(prev => ({ ...prev, error: userError.message, loading: false }))
            return
          }

          setState({
            user,
            session,
            loading: false,
            error: null,
          })
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'An error occurred', 
          loading: false 
        }))
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      
      if (event === 'SIGNED_IN' && session) {
        const { user, error } = await auth.getCurrentUser()
        
        if (error) {
          setState(prev => ({ ...prev, error: error.message }))
          return
        }

        setState({
          user,
          session,
          loading: false,
          error: null,
        })
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          session: null,
          loading: false,
          error: null,
        })
      } else if (event === 'TOKEN_REFRESHED' && session) {
        const { user, error } = await auth.getCurrentUser()
        
        if (error) {
          setState(prev => ({ ...prev, error: error.message }))
          return
        }

        setState(prev => ({ ...prev, user, session }))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { user, error } = await auth.signIn({ email, password })
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      if (user) {
        setState(prev => ({ ...prev, user, loading: false, error: null }))
        return { success: true }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: false, error: 'Sign in failed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { user, error } = await auth.signUp({ email, password, full_name: fullName })
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      if (user) {
        setState(prev => ({ ...prev, user, loading: false, error: null }))
        return { success: true }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: false, error: 'Sign up failed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const { error } = await auth.signOut()
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return
      }

      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await auth.resetPassword(email)
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await auth.updatePassword(password)
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
