import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Layout({ children, toggleTheme, theme }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition">
                  📝 Notes
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              {!loading && user ? (
                <>
                  <div className="hidden md:flex items-center gap-6">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      👤 {user.email}
                    </span>
                    <Link href="/dashboard">
                      <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer font-medium">
                        Dashboard
                      </span>
                    </Link>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-lg"
                  >
                    {theme === 'dark' ? '☀️' : '🌙'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="btn text-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-lg"
                  >
                    {theme === 'dark' ? '☀️' : '🌙'}
                  </motion.button>
                  <Link href="/login">
                    <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 cursor-pointer font-medium">
                      Login
                    </span>
                  </Link>
                  <Link href="/register">
                    <span className="btn text-sm bg-blue-600 hover:bg-blue-700 text-white">
                      Sign Up
                    </span>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
