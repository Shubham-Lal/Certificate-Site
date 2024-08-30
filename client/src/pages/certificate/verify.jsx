import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function CertificateVerify() {
    const { certificateID } = useParams()

    const [data, setData] = useState('')

    useEffect(() => {
        const fetchCertificate = async () => {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/public/certificate/${certificateID}`, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        setData(response.data)
                    }
                })
        }
        if (!certificateID || !certificateID.trim()) navigate('/')
        fetchCertificate()
    }, [certificateID])

    return (
        <div className='flex flex-col items-center gap-2'>
            {data.valid ? (
                <>
                    <p>Certificate ID: {certificateID}</p>
                    <img
                        src={data.cert_url}
                        alt='Certificate'
                        className='xl:w-[1056px] xl:h-[816px] object-contain'
                    />
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${import.meta.env.VITE_CLIENT_URL}/certificate/${certificateID}/verify`}
                        alt='Certificate Verify QR'
                    />
                </>
            ) : <p>No certificate found</p>}
        </div>
    )
}