import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../store/useAuthStore'

export default function Login() {
    const navigate = useNavigate()

    const { setIsAuthenticated } = useAuthStore()

    const [credentials, setCredentials] = useState({ email: '', password: '' })

    const handleLoginForm = async (e) => {
        e.preventDefault()

        if (!credentials.email.trim()) return toast.error('Enter email')
        else if (!credentials.password.trim()) return toast.error('Enter password')

        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    setIsAuthenticated(true)
                    toast.success(response.message)
                    navigate('/admin')
                }
                else toast.error(response.message)
            })
            .catch(() => toast.error('Something went wrong'))
    }

    return (
        <form
            onSubmit={handleLoginForm}
            className='mx-auto max-w-[500px] flex flex-col gap-3'
        >
            <h1 className='text-xl font-semibold'>Login to your account</h1>
            <input
                type='email'
                name='email'
                placeholder='Enter email'
                className='p-3 border'
                value={credentials.email}
                onChange={(e) =>
                    setCredentials(prevCredentials => ({
                        ...prevCredentials,
                        email: e.target.value
                    }))
                }
            />
            <input
                type='password'
                name='password'
                placeholder='Enter password'
                className='p-3 border'
                value={credentials.password}
                onChange={(e) =>
                    setCredentials(prevCredentials => ({
                        ...prevCredentials,
                        password: e.target.value
                    }))
                }
            />
            <button
                type='submit'
                className='h-[50px] bg-[#ff7703] text-white'
            >
                Login
            </button>
            <Link
                to='/'
                className='flex items-center justify-center h-[50px] border border-[#ff7703] text-[#ff7703]'
            >
                Go back to home
            </Link>
        </form>
    )
}