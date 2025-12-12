import { useState, useEffect } from 'react'
import API from '../lib/api'
import { useRouter } from 'next/router'
import { useNotification } from '../hooks/useNotification'
import { useNoteDraft } from '../hooks/useNoteDraft'
import { MarkdownEditor } from './MarkdownEditor'
import { motion } from 'framer-motion'

export default function NoteForm({ noteId, onSuccess }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(noteId ? true : false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { success, error: showError, warning } = useNotification()
  const { saveDraft, getDraft, removeDraft, hasDraft } = useNoteDraft(noteId || 'new')

  useEffect(() => {
    if (noteId) {
      const token = localStorage.getItem('token')
      API.get(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setTitle(res.data.title)
          setContent(res.data.content)
          setLoading(false)
        })
        .catch(err => {
          showError(err.response?.data?.detail || 'Failed to load note')
          setLoading(false)
        })
    } else {
      // Check for draft on new note
      const draft = getDraft()
      if (draft && hasDraft()) {
        warning('Draft found! Restoring your previous work...')
        setTitle(draft.title)
        setContent(draft.content)
      }
      setLoading(false)
    }
  }, [noteId])

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((title.trim() || content.trim()) && !noteId) {
        saveDraft(title, content)
      }
    }, 1000) // Save after 1 second of inactivity

    return () => clearTimeout(timer)
  }, [title, content, noteId, saveDraft])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !content.trim()) {
      showError('Title and content are required')
      return
    }

    if (title.trim().length < 3) {
      showError('Title must be at least 3 characters')
      return
    }

    if (content.trim().length < 10) {
      showError('Content must be at least 10 characters')
      return
    }

    const token = localStorage.getItem('token')
    setIsSaving(true)

    try {
      if (noteId) {
        await API.put(`/notes/${noteId}`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        success('Note updated successfully!')
      } else {
        await API.post('/notes', { title, content }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        removeDraft()
        success('Note created successfully!')
      }
      onSuccess()
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {noteId ? '✏️ Edit Note' : '✨ Create New Note'}
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📌 Title
        </label>
        <div className="flex gap-2 items-center">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a compelling title..."
            className="input flex-1"
          />
          <span className={`text-sm font-medium whitespace-nowrap ${
            title.trim().length < 3 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {title.length}/3+
          </span>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📝 Content
        </label>
        <div className="flex gap-2 items-start justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Markdown is supported! Write with headers, links, code blocks, and more.
          </span>
          <span className={`text-sm font-medium ${
            content.trim().length < 10 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {content.length}/10+ characters
          </span>
        </div>
        <MarkdownEditor content={content} onChange={setContent} />
      </div>

      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => router.push('/dashboard')}
          className="btn-outline px-6 py-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSaving}
          className="btn px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {isSaving ? '💾 Saving...' : noteId ? '📝 Update Note' : '✨ Create Note'}
        </motion.button>
      </div>

      {!noteId && hasDraft() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-sm"
        >
          💡 Draft auto-saving enabled. Your work is being saved automatically.
        </motion.div>
      )}
    </motion.form>
  )
}
