import '../styles/globals.css'
import ErrorBoundary from '../components/ErrorBoundary'
import { NotificationProvider } from '../components/NotificationProvider'
import { useTheme } from '../hooks/useTheme'

function MyApp({ Component, pageProps }) {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) return null

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className={theme === 'dark' ? 'dark' : ''}>
          <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default MyApp
