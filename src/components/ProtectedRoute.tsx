import { useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useRouter } from '../router/RouterContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const { navigate } = useRouter()

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [loading, user, navigate])

  if (loading) return <p>Laster...</p>
  if (!user) return null

  return <>{children}</>
}
