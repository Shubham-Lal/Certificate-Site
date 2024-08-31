import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

export default function CertificateQR() {
    const navigate = useNavigate()
    const { certificateID } = useParams()

    const [data, setData] = useState({})

    useEffect(() => {
        const fetchCertificate = async () => {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/public/certificate/${certificateID}`, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) setData(response.data)
                })
        }

        if (!certificateID || !certificateID.trim()) navigate('/')
        fetchCertificate()
    }, [])

    return (
        <div className='flex flex-col items-center gap-3'>
            {data._id ? (
                <>
                    <p><span className='font-bold'>Certificate ID:</span> {certificateID}</p>
                    <p><span className='font-bold'>Certificate Status:</span> {data.valid ? 'Valid' : 'Invalid'}</p>
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${import.meta.env.VITE_CLIENT_URL}/certificate/${certificateID}/verify`}
                        alt='Certificate Verify QR'
                    />
                    {data.valid && (
                        <Link to='verify' className='px-4 w-fit h-[40px] flex items-center justify-center bg-orange-100 border border-[#ff7703] text-[#ff7703] rounded'>
                            View Certificate
                        </Link>
                    )}
                </>
            ) : <p>No certificate found</p>}
        </div>
    )
}