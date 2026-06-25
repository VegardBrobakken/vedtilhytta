import { createContext, useContext, useEffect, useState } from 'react'

type RouterValue = {
  path: string
  navigate: (to: string) => void
  // Turns an app path ('/priser') into a real URL including the deploy base.
  href: (to: string) => string
}

const RouterContext = createContext<RouterValue | null>(null)

// Vite injects BASE_URL ('/' in dev, '/vedtilhytta/' on GitHub Pages).
// Strip the trailing slash so we can concatenate cleanly.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

// Real pathname -> internal app path. '/vedtilhytta/priser' -> '/priser'.
function toAppPath(pathname: string) {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || '/'
  }
  return pathname || '/'
}

// Internal app path -> real URL. '/priser' -> '/vedtilhytta/priser'.
function toHref(to: string) {
  return BASE + to
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState(toAppPath(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(toAppPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (to: string) => {
    if (toHref(to) === window.location.pathname) return
    window.history.pushState(null, '', toHref(to))
    setPath(to)
  }

  return (
    <RouterContext.Provider value={{ path, navigate, href: toHref }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider')
  return ctx
}
