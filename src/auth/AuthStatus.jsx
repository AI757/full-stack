import { useState } from 'react'
import { Link } from 'react-router-dom'

import useAuth from './useAuth.js'

function AuthStatus() {
  const { isLoading, logout, user } = useAuth()
  const [error, setError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setError('')
    setIsLoggingOut(true)

    try {
      await logout()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return <p className="auth-status-message">Checking login status…</p>
  }

  return (
    <div className="auth-status">
      {user ? (
        <>
          <p>
            Signed in as <strong>{user.username}</strong>
          </p>
          <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default AuthStatus
