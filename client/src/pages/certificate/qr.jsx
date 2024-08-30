import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

export default function CertificateQR() {
    const navigate = useNavigate()
    const { certificateID } = useParams()

    const [isValid, setValid] = useState('')

    useEffect(() => {
        const fetchCertificate = async () => {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/public/certificate/${certificateID}`, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        setValid(response.data.valid)
                    }
                })
        }
        if (!certificateID || !certificateID.trim()) navigate('/')
        fetchCertificate()
    }, [certificateID])

    return (
        <div className='flex flex-col items-center gap-2'>
            {isValid ? (
                <>
                    <p>Certificate ID: {certificateID}</p>
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${import.meta.env.VITE_CLIENT_URL}/certificate/${certificateID}/verify`}
                        alt='Certificate Verify QR'
                    />
                    <Link to='verify' className='px-4 py-2 bg-[#ff7703] text-white'>Verify</Link>
                </>
            ) : <p>No certificate found</p>}
        </div>
    )
}