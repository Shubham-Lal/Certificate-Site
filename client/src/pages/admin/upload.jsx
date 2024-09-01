import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BsFiletypePdf } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { FaSave } from 'react-icons/fa'
import PDFViewer from '../certificate/pdf'
import Loading from '../../components/loading'

export default function Upload() {
    const navigate = useNavigate()
    const [isUploading, setUploading] = useState(false)
    const [issued, setIssued] = useState({ for: '', to: '' })
    const inputRef = useRef(null)
    const [file, setFile] = useState(null)

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (e.target.files[0].type !== 'application/pdf') {
                return toast.error('Please upload only PDF file')
            }
            setFile(e.target.files[0])
        }
    }

    const handleUploadForm = async (e) => {
        e.preventDefault()

        setUploading(true)

        const formData = new FormData()
        formData.append('issued_for', issued.for)
        formData.append('issued_to', issued.to)
        formData.append('certificate', file)

        try {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/certificate`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        toast.success(response.message)
                        navigate('/admin')
                    } else {
                        toast.error(response.message || 'Failed to upload certificate')
                    }
                })
        } catch (error) {
            toast.error('An error occurred during the upload')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className='mx-auto w-full sm:w-fit'>
            {file && <PDFViewer file={file} />}

            <form
                onSubmit={handleUploadForm}
                className={`${file ? 'mt-5' : ''} mx-auto w-full sm:w-[500px] flex flex-col gap-3`}
            >
                {file ? (
                    <div className='flex items-center gap-5'>
                        <div className='w-[50px] h-[50px] grid place-content-center border rounded'>
                            <BsFiletypePdf size={30} />
                        </div>
                        <div className='flex flex-col'>
                            <p>{file.name}</p>
                            <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <input ref={inputRef} type='file' accept='.pdf,.jpg,.jpeg,.png' onChange={handleChange} className='hidden' />
                        <button
                            type='button'
                            onClick={() => inputRef.current.click()}
                            className='px-4 h-[50px] bg-orange-100 border border-[#ff7703] text-[#ff7703] rounded'
                        >
                            Choose file (PDF only)
                        </button>
                    </>
                )}

                <input
                    placeholder='Enter Certificate Subject'
                    className='p-3 border rounded'
                    value={issued.for}
                    onChange={(e) =>
                        setIssued(prev => ({
                            ...prev,
                            for: e.target.value
                        }))
                    }
                />
                <input
                    placeholder='Enter Certificate Recipient Name'
                    className='p-3 border rounded'
                    value={issued.to}
                    onChange={(e) =>
                        setIssued(prev => ({
                            ...prev,
                            to: e.target.value
                        }))
                    }
                />

                <div className='w-full flex gap-3 justify-center'>
                    {file && !isUploading && (
                        <button
                            onClick={() => setFile(null)}
                            className='w-full md:w-fit h-[40px] px-4 flex items-center justify-center gap-3 border border-red-500 text-red-500 rounded'
                        >
                            <p>Remove File</p>
                            <MdDelete size={18} />
                        </button>
                    )}
                    <button
                        type='submit'
                        className={`w-full md:w-fit h-[40px] px-4 flex items-center justify-center gap-3 ${isUploading ? 'bg-transparent text-[#ff7703] cursor-not-allowed' : 'bg-[#ff7703] text-white'} rounded`}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loading size={25} className='mx-auto' /> : (
                            <><p>Save File</p><FaSave size={18} /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}