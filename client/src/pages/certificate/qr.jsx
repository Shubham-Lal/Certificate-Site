import { useParams, Link } from 'react-router-dom'
import { useFetchCertificate } from '../../hooks/fetch-certificate'
import Loading from '../../components/loading'

export default function CertificateQR() {
    const { certificateID } = useParams()
    const { isLoading, data } = useFetchCertificate(certificateID)

    return (
        <div className='flex flex-col items-center gap-3'>
            {isLoading ? <Loading size={30} color='#ff7703' className='mx-auto' /> : (
                data._id ? (
                    <>
                        <p><span className='font-bold'>Certificate ID:</span> {certificateID}</p>
                        <p><span className='font-bold'>Certificate Status:</span> {data.valid ? 'Valid' : 'Invalid'}</p>
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${import.meta.env.VITE_CLIENT_URL}/certificate/${certificateID}/verify`}
                            alt='Certificate Verify QR'
                        />
                        <Link to='verify' className='px-4 w-fit h-[40px] flex items-center justify-center bg-orange-100 border border-[#ff7703] text-[#ff7703] rounded'>
                            View Certificate
                        </Link>
                    </>
                ) : <p>No certificate found</p>
            )}
        </div>
    )
}