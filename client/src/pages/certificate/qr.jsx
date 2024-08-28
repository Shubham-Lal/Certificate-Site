import { useParams } from 'react-router-dom'

export default function CertificateQR() {
    const { certificateID } = useParams()

    return (
        <div>
            Certificate QR ID: {certificateID}
        </div>
    )
}