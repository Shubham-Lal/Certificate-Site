import { useLocation, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../store/useAuthStore'

const Navbar = () => {
    const location = useLocation()

    const { isAuthenticated, setIsAuthenticated, setUser } = useAuthStore()

    const handleLogout = async (e) => {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setIsAuthenticated(false)
                    setUser({ id: '', email: '' })
                    toast.success(response.message)
                }
                else toast.error(response.message)
            })
            .catch(() => toast.error('Something went wrong'))
    }

    return (
        <header className='px-3 fixed top-0 left-0 w-full h-[60px] flex justify-between items-center bg-white border-b'>
            <Link to='/'>
                <img src='/logo.ico' alt='logo' />
            </Link>
            <nav className='flex gap-3 text-lg'>
                <Link to='/certificate' className={`hover:text-[#ff7703] ${location.pathname === '/certificate' ? 'text-[#ff7703]' : ''}`}>Certificate</Link>
                {isAuthenticated ? (
                    <>
                        <Link to='/admin' className={`hover:text-[#ff7703] ${location.pathname === '/admin' ? 'text-[#ff7703]' : ''}`}>Admin</Link>
                        <button
                            className='hover:underline'
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className={`hover:text-[#ff7703] ${location.pathname === '/login' ? 'text-[#ff7703]' : ''}`}>Login</Link>
                        <Link to='/signup' className={`hover:text-[#ff7703] ${location.pathname === '/signup' ? 'text-[#ff7703]' : ''}`}>Signup</Link>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Navbar