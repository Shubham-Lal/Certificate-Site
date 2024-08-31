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
import Navbar from './components/navbar'
import { useAuthStore } from './store/useAuthStore'

export default function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore()

  useEffect(() => {
    const autoLogin = async () => {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/authenticate`, {
        method: 'GET',
        credentials: 'include'
      })
        .then(res => res.json())
        .then(response => {
          if (response.success) setIsAuthenticated(true)
        })
    }
    autoLogin()
  }, [])

  return (
    <BrowserRouter>
      <Navbar />

      <main className='pt-[calc(60px+0.75rem)] pb-3 px-3'>
        <Routes>
          <Route path='/' element={<Navigate to='/certificate' />} />
          <Route path='/admin'>
            <Route index element={isAuthenticated ? <Admin /> : <Navigate to='/login' />} />
            <Route path='upload' element={isAuthenticated ? <Upload /> : <Navigate to='/login' />} />
          </Route>
          <Route path='/login' element={isAuthenticated ? <Navigate to='/admin' /> : <Login />} />
          <Route path='/signup' element={isAuthenticated ? <Navigate to='/admin' /> : <Signup />} />
          <Route path='/certificate'>
            <Route index element={<Certificate />} />
            <Route path=':certificateID'>
              <Route index element={<CertificateQR />} />
              <Route path='verify' element={<CertificateVerify />} />
            </Route>
          </Route>
        </Routes>
      </main>

      <Toaster
        duration={3000}
        position='top-center'
        richColors
      />
    </BrowserRouter>
  )
}