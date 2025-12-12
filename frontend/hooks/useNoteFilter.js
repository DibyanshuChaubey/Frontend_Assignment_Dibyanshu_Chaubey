import { useCallback, useMemo, useState } from 'react'

export function useNoteFilter(notes) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent') // recent, oldest, alphabetical
  const [filter, setFilter] = useState('all') // all, completed, archived

  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((note) => {
        const titleMatch = note.title.toLowerCase().includes(query)
        const contentMatch = note.content.toLowerCase().includes(query)
        return titleMatch || contentMatch
      })
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.id) - new Date(b.id)
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'recent':
        default:
          return new Date(b.id) - new Date(a.id)
      }
    })

    return result
  }, [notes, searchQuery, sortBy, filter])

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filter,
    setFilter,
    filteredAndSortedNotes,
  }
}
