import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

    // Check localStorage
    const savedTheme = localStorage.getItem('theme') || systemTheme
    setTheme(savedTheme)
    setMounted(true)

    // Apply theme
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme) => {
    const html = document.documentElement
    if (newTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  return { theme, toggleTheme, mounted }
}
