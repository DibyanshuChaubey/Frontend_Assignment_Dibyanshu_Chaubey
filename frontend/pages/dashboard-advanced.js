import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import API from '../lib/api'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useNotification } from '../hooks/useNotification'
import { useNoteFilter } from '../hooks/useNoteFilter'
import { AdvancedNoteCard } from '../components/AdvancedNoteCard'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function Dashboard({ theme, toggleTheme }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { success, error, info } = useNotification()
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredAndSortedNotes,
  } = useNoteFilter(notes)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    loadNotes(token)
  }, [router])

  const loadNotes = async (token) => {
    try {
      setLoading(true)
      const res = await API.get('/notes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(res.data)
      if (res.data.length === 0) {
        info('No notes yet. Create your first note!')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/login')
      } else {
        error(err.response?.data?.detail || 'Failed to load notes')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.'))
      return

    try {
      const token = localStorage.getItem('token')
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(notes.filter((n) => n.id !== id))
      success('Note deleted successfully')
    } catch (err) {
      error(err.response?.data?.detail || 'Failed to delete note')
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📚 My Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredAndSortedNotes.length} note{filteredAndSortedNotes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/notes/new">
              <button className="btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                ✨ New Note
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 Search Notes
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or content..."
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📊 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            <div className="flex items-end">
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearSearch}
                  className="btn-outline w-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400"
                >
                  ✕ Clear Search
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
        ) : filteredAndSortedNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? '🔍 No notes found matching your search' : '📝 No notes yet'}
            </p>
            {!searchQuery && (
              <Link href="/notes/new">
                <button className="btn bg-gradient-to-r from-blue-600 to-purple-600">
                  Create your first note
                </button>
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSortedNotes.map((note) => (
              <AdvancedNoteCard
                key={note.id}
                note={note}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
