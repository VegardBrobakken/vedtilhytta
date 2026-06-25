import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useRouter } from '../router/RouterContext'

export function Login() {
  const { user, login } = useAuth()
  const { navigate } = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) navigate('/admin')
  }, [user, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('Feil e-post eller passord')
    }
  }

  return (
    <div>
      <h1>Logg inn</h1>
      <form onSubmit={onSubmit}>
        <label>
          E-post
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Passord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Logg inn</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}
