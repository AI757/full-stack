import { useCallback, useEffect, useMemo, useState } from 'react'

import { ApiError, apiRequest } from '../lib/api.js'
import AuthContext from './auth-context.js'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    async function loadSession() {
      try {
        const result = await apiRequest('/api/auth/me')

        if (isCurrent) setUser(result.user)
      } catch (error) {
        // A 401 is the normal signed-out state. Other failures are kept visible
        // for debugging without preventing the application from rendering.
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error('Unable to restore login session:', error)
        }
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    loadSession()

    return () => {
      isCurrent = false
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    setUser(result.user)
    return result.user
  }, [])

  const register = useCallback(
    async ({ username, email, password, journalist }) => {
      await apiRequest('/api/user/create', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
          journalist,
        }),
      })

      // Registration does not create a Passport session, so log in immediately
      // with the same credentials instead of storing the password anywhere.
      return login({ email, password })
    },
    [login],
  )

  const logout = useCallback(async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ isLoading, login, logout, register, user }),
    [isLoading, login, logout, register, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
