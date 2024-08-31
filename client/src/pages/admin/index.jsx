import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Admin() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchCertificates = async () => {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/certificates`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) setData(response.data)
                })
        }

        fetchCertificates()
    }, [])

    return (
        <div className='flex flex-col gap-5'>
            <Link
                to='upload'
                className='px-2 w-fit h-[40px] flex items-center justify-center bg-[#ff7703] text-white'
            >
                Upload Certificate
            </Link>
            <h1 className='text-xl font-semibold'>Certificates</h1>
        </div>
    )
}