import { useCallback, useEffect, useState } from 'react'

const DRAFT_PREFIX = 'note_draft_'
const DRAFT_TIMESTAMP_KEY = 'draft_timestamps'

export function useNoteDraft(noteId) {
  const draftKey = `${DRAFT_PREFIX}${noteId}`

  const saveDraft = useCallback((title, content) => {
    if (!title && !content) {
      removeDraft()
      return
    }

    const draft = {
      title,
      content,
      savedAt: new Date().toISOString(),
      noteId,
    }

    localStorage.setItem(draftKey, JSON.stringify(draft))

    // Track draft timestamps
    const timestamps = JSON.parse(localStorage.getItem(DRAFT_TIMESTAMP_KEY) || '{}')
    timestamps[noteId] = new Date().toISOString()
    localStorage.setItem(DRAFT_TIMESTAMP_KEY, JSON.stringify(timestamps))
  }, [draftKey, noteId])

  const getDraft = useCallback(() => {
    const draft = localStorage.getItem(draftKey)
    return draft ? JSON.parse(draft) : null
  }, [draftKey])

  const removeDraft = useCallback(() => {
    localStorage.removeItem(draftKey)
  }, [draftKey])

  const hasDraft = useCallback(() => {
    return localStorage.getItem(draftKey) !== null
  }, [draftKey])

  return { saveDraft, getDraft, removeDraft, hasDraft }
}
