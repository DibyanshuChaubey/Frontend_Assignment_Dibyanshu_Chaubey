import { useRouter } from 'next/router'

// Helper function to format date in readable format
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function NoteCard({ note, onDelete }) {
  const router = useRouter()

  return (
    <div className="card bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
        <span className="text-xs text-gray-400">
          ID: {note.id}
        </span>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => router.push(`/notes/${note.id}`)}
          className="btn text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="btn-outline text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
