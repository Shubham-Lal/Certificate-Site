import { useParams } from 'react-router-dom'

export default function CertificateVerify() {
    const { certificateID } = useParams()

    return (
        <div>
            Certificate Verify ID: {certificateID}
        </div>
    )
}