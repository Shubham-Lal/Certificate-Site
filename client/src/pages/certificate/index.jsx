import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Certificate() {
    const navigate = useNavigate()

    const [id, setID] = useState('')

    const handleCertificateForm = async (e) => {
        e.preventDefault()
        if (!id.trim()) return toast.error('Please enter the certificate id')
        navigate(`${id}/verify`)
    }

    return (
        <form
            onSubmit={handleCertificateForm}
            className='mx-auto max-w-[500px] flex flex-col gap-3'
        >
            <h1 className='text-xl font-semibold'>Verify your certificate</h1>
            <input
                type='text'
                placeholder='Enter Certificate ID'
                className='p-3 border'
                value={id}
                onChange={e => setID(e.target.value)}
            />
            <button
                type='submit'
                className='h-[50px] bg-[#ff7703] text-white'
            >
                Verify
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