import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CiSearch } from 'react-icons/ci'
import { IoAdd } from 'react-icons/io5'
import { useAuthStore } from '../../store/useAuthStore'

export default function Certificate() {
    const navigate = useNavigate()

    const { isAuthenticated } = useAuthStore()

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
            <h1 className='text-xl font-semibold'>View your certificate</h1>
            <input
                type='text'
                placeholder='Enter Certificate ID'
                className='p-3 border rounded'
                value={id}
                onChange={e => setID(e.target.value)}
            />
            <button
                type='submit'
                className='h-[50px] flex items-center justify-center gap-1 bg-orange-100 border border-[#ff7703] text-[#ff7703] rounded'
            >
                <p>Search Certificate</p>
                <CiSearch size={25} />
            </button>
            {isAuthenticated === 'authenticated' && (
                <Link
                    to='/admin/upload'
                    className='h-[50px] flex items-center justify-center gap-1 border rounded'
                >
                    <p>Create Certificate</p>
                    <IoAdd size={25} />
                </Link>
            )}
        </form>
    )
}