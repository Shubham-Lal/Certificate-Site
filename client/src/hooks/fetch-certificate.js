import { useState, useEffect } from 'react'

function useFetchCertificate(certificateID, type = 'public') {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchCertificate = async () => {
            const url = `${import.meta.env.VITE_SERVER_URL}/api/${type}/certificate/${certificateID}`

            const fetchOptions = {
                method: 'GET',
                ...(type === 'admin' && { credentials: 'include' })
            }

            try {
                const res = await fetch(url, fetchOptions)
                const response = await res.json()

                if (response.success) setData(response.data)
            } catch (error) {
                console.error('Error fetching certificate:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCertificate()
    }, [])

    return { isLoading, data, setData }
}

function useFetchCertificates() {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchCertificates = async () => {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/certificate`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) setData(response.data)
                })
                .finally(() => setLoading(false))
        }

        fetchCertificates()
    }, [])

    return { isLoading, data, setData }
}

export { useFetchCertificate, useFetchCertificates }