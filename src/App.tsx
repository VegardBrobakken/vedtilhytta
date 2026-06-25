import './App.css'
import { useRouter } from './router/RouterContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicLayout } from './components/PublicLayout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { Prices } from './pages/Prices'
import { Delivery } from './pages/Delivery'
import { About } from './pages/About'
import { Order } from './pages/Order'
import { Admin } from './pages/Admin'
import { Login } from './pages/Login'

const publicPages: Record<string, React.ComponentType> = {
  '/': Home,
  '/veden-var': Products,
  '/priser': Prices,
  '/levering': Delivery,
  '/om-oss': About,
  '/bestill': Order,
}

function App() {
  const { path } = useRouter()

  if (path === '/admin') {
    return (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    )
  }

  if (path === '/login') {
    return (
      <PublicLayout>
        <Login />
      </PublicLayout>
    )
  }

  const Page = publicPages[path] ?? Home
  return (
    <PublicLayout>
      <Page />
    </PublicLayout>
  )
}

export default App
