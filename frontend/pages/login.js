import { useState } from 'react'
import API from '../lib/api'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Login({ theme, toggleTheme }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      
      // Fetch user info to store locally
      const userRes = await API.get('/users/me', {
        headers: { Authorization: `Bearer ${res.data.access_token}` }
      })
      localStorage.setItem('user', JSON.stringify(userRes.data))
      
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded shadow w-full max-w-md text-gray-900 dark:text-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="input"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full mb-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/register">
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                Sign Up
              </span>
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  )
}