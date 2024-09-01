import { useState, useEffect } from 'react'

function useFetchCertificate(certificateID) {
    const [isLoading, setLoading] = useState(true)
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
                .finally(() => setLoading(false))
        }

        fetchCertificate()
    }, [])

    return { isLoading, data, setData }
}

export default useFetchCertificate