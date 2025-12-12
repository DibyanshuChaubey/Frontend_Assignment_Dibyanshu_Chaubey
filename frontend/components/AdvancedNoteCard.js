import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function AdvancedNoteCard({ note, onDelete }) {
  const router = useRouter()

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  }

  const getPreview = (content) => {
    return content.substring(0, 200) + (content.length > 200 ? '...' : '')
  }

  const getWordCount = (content) => {
    return content.trim().split(/\s+/).length
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      className="card bg-white dark:bg-gray-800 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex-1 line-clamp-2">
          {note.title}
        </h3>
        <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full whitespace-nowrap">
          {getWordCount(note.content)} words
        </span>
      </div>

      <div className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {getPreview(note.content)}
        </ReactMarkdown>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push(`/notes/${note.id}`)}
          className="btn text-sm px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
        >
          📝 Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(note.id)}
          className="btn-outline text-sm px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-200 rounded transition"
        >
          🗑️ Delete
        </motion.button>
      </div>
    </motion.div>
  )
}

// Default export for convenient import
export default AdvancedNoteCard
