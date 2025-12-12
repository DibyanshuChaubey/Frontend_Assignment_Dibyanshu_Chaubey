import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import NoteForm from '../../components/NoteForm'

export default function NotePage({ theme, toggleTheme }) {
  const router = useRouter()
  const { id } = router.query
  const noteId = id === 'new' ? null : id ? parseInt(id) : null

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="max-w-2xl">
        <NoteForm noteId={noteId} onSuccess={handleSuccess} />
      </div>
    </Layout>
  )
}
