import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home({ theme, toggleTheme }) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="text-center py-20 text-gray-900 dark:text-gray-100">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Notes App
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A simple, secure way to keep your notes organized
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link href="/register">
            <button className="btn px-8 py-3 text-lg">
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-outline px-8 py-3 text-lg">
              Login
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="card">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">📝 Create</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quickly create and organize your notes with a clean, intuitive interface
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">🔍 Search</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Find your notes instantly with powerful search functionality
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">🔒 Secure</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your notes are private and protected with JWT authentication
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
