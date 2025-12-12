import { useState } from 'react'
import { useRouter } from 'next/router'
import API from '../lib/api'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Register({ theme, toggleTheme }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !password || !fullName) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const res = await API.post('/auth/register', {
        email,
        password,
        full_name: fullName
      })

      // Auto-login after registration
      const loginRes = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', loginRes.data.access_token)
      localStorage.setItem('user', JSON.stringify({
        id: res.data.id,
        email: res.data.email,
        full_name: res.data.full_name
      }))

      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded shadow w-full max-w-md text-gray-900 dark:text-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="input"
            />
          </div>

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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login">
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                Login
              </span>
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  )
}
