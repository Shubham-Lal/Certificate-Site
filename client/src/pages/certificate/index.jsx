import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        </form>
    )
}