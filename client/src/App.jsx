import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Admin from './pages/admin'
import Upload from './pages/admin/upload'
import Login from './pages/login'
import Signup from './pages/signup'
import Certificate from './pages/certificate'
import CertificateQR from './pages/certificate/qr'
import CertificateVerify from './pages/certificate/verify'
import CertificateEdit from './pages/certificate/edit'
import Navbar from './components/navbar'
import Loading from './components/loading'
import { useAuthStore } from './store/useAuthStore'

export default function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore()

  useEffect(() => {
    const autoLogin = async () => {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/authenticate`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success) setIsAuthenticated('authenticated')
          else setIsAuthenticated('failed')
        })
        .catch(() => setIsAuthenticated('failed'))
    }
    autoLogin()
  }, [])

  return (
    <BrowserRouter>
      <Navbar />

      <main className='pt-[calc(60px+0.75rem)] pb-3 px-3'>
        <Routes>
          <Route path='/' element={<Navigate to='/certificate' />} />
          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/upload'
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={isAuthenticated === 'authenticated' ? <Navigate to='/admin' /> : <Login />} />
          <Route path='/signup' element={isAuthenticated === 'authenticated' ? <Navigate to='/admin' /> : <Signup />} />
          <Route path='/certificate'>
            <Route index element={<Certificate />} />
            <Route path=':certificateID'>
              <Route index element={<CertificateQR />} />
              <Route path='verify' element={<CertificateVerify />} />
              <Route
                path='edit'
                element={
                  <ProtectedRoute>
                    <CertificateEdit />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </main>

      <Toaster duration={3000} position='top-center' richColors />
    </BrowserRouter>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated === 'authenticating') {
    return <Loading size={30} color='#ff7703' className='mx-auto' />
  }

  if (isAuthenticated === 'authenticated') {
    return children
  }

  return <Navigate to='/login' />
}