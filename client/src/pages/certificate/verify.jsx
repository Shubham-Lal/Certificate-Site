import { useParams } from 'react-router-dom'
import { useFetchCertificate } from '../../hooks/fetch-certificate'
import Loading from '../../components/loading'
import PDFViewer from './pdf'

export default function CertificateVerify() {
    const { certificateID } = useParams()
    const { isLoading, data } = useFetchCertificate(certificateID)

    return (
        <div className='flex flex-col items-center gap-3'>
            {isLoading ? <Loading size={30} color='#ff7703' className='mx-auto' /> : (
                data._id ? (
                    <>
                        <PDFViewer file={data.file.url} />
                        <p>This Certificate is issued to <span className='font-bold'>{data.issued.to}</span> for <span className='font-bold'>{data.issued.for}</span>.</p>
                        <p><span className='font-bold'>Certificate ID:</span> {certificateID}</p>
                        <p><span className='font-bold'>Certificate Status:</span> {data.valid ? 'Valid' : 'Invalid'}</p>
                        <div className='flex items-center gap-3'>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=75x75&data=${import.meta.env.VITE_CLIENT_URL}/certificate/${certificateID}/verify`}
                                alt='Certificate Verify QR'
                            />
                            <img
                                src={data.valid ? '/valid.jpg' : '/invalid.jpg'}
                                className='w-[90px] h-[90px] object-contain'
                                alt='Certificate Verify QR'
                            />
                        </div>
                        <a href={data.file.url} target='_blank' rel='noopener noreferrer' className='px-4 w-fit h-[40px] flex items-center justify-center bg-orange-100 border border-[#ff7703] text-[#ff7703] rounded'>
                            Download
                        </a>
                    </>
                ) : <p>No certificate found</p>
            )}
        </div>
    )
}