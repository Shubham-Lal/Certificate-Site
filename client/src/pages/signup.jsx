import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Signup() {
    const navigate = useNavigate()

    const [credentials, setCredentials] = useState({ name: '', email: '', password: '' })

    const handleSignupForm = async (e) => {
        e.preventDefault()

        if (!credentials.email.trim()) return toast.error('Enter email')
        else if (!credentials.password.trim()) return toast.error('Enter password')

        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    toast.success(response.message)
                    navigate('/login')
                }
                else toast.error(response.message)
            })
            .catch(() => toast.error('Something went wrong'))
    }

    return (
        <form
            onSubmit={handleSignupForm}
            className='mx-auto max-w-[500px] flex flex-col gap-3'
        >
            <h1 className='text-xl font-semibold'>Create your account</h1>
            <input
                placeholder='Enter your name'
                className='p-3 border rounded'
                value={credentials.name}
                onChange={(e) =>
                    setCredentials(prev => ({
                        ...prev,
                        name: e.target.value
                    }))
                }
            />
            <input
                type='email'
                placeholder='Enter email'
                className='p-3 border rounded'
                value={credentials.email}
                onChange={(e) =>
                    setCredentials(prev => ({
                        ...prev,
                        email: e.target.value
                    }))
                }
            />
            <input
                type='password'
                placeholder='Enter password'
                className='p-3 border rounded'
                value={credentials.password}
                onChange={(e) =>
                    setCredentials(prev => ({
                        ...prev,
                        password: e.target.value
                    }))
                }
            />
            <button
                type='submit'
                className='h-[50px] bg-[#ff7703] text-white rounded'
            >
                Signup
            </button>
        </form>
    )
}