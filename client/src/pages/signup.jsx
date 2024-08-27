import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Signup() {
    const navigate = useNavigate()

    const [credentials, setCredentials] = useState({ email: '', password: '' })

    const handleSignupForm = async (e) => {
        e.preventDefault()

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
                Signup
            </button>
        </form>
    )
}