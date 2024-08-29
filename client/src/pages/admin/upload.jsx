import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { MdDelete, MdFileUpload } from 'react-icons/md'

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

export default function Upload() {
    const navigate = useNavigate()

    const inputRef = useRef(null)
    const [file, setFile] = useState(null)
    const [isUploading, setUploading] = useState(false)

    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault()
            e.stopPropagation()
        }

        const handleDrop = (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                validateAndProcessFile(e.dataTransfer.files[0])
            }
        }

        const dropArea = document.querySelector('[data-drop-area]')
        if (!dropArea) return

        dropArea.addEventListener('dragover', handleDragOver)
        dropArea.addEventListener('drop', handleDrop)

        return () => {
            dropArea.removeEventListener('dragover', handleDragOver)
            dropArea.removeEventListener('drop', handleDrop)
        }
    }, [])

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndProcessFile(e.target.files[0])
        }
    }

    const validateAndProcessFile = (file) => {
        if (!allowedTypes.includes(file.type)) {
            return toast.error('Unsupported file type. Please upload .pdf/.png/.jpg/.jpeg format certificate.')
        }
        setFile(file)
    }

    const handleUploadForm = async (e) => {
        e.preventDefault()

        if (!file || !allowedTypes.includes(file.type)) {
            return toast.error('Unsupported file type. Please upload .pdf/.png/.jpg/.jpeg format certificate.')
        }

        setUploading(true)

        const formData = new FormData()
        formData.append('certificate', file)

        try {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        toast.success(response.message)
                        navigate('/admin')
                    }
                    else toast.error(response.message || 'Failed to upload certificate')
                })
        } catch (error) {
            toast.error('An error occurred during the upload')
        } finally {
            setUploading(false)
        }
    }

    return (
        <form
            onSubmit={handleUploadForm}
            className='flex flex-col items-center gap-2'
        >
            {!file ? (
                <div
                    data-drop-area
                    className='w-full h-[calc(100svh-70px-12px)] flex flex-col items-center justify-center gap-5 border-2 border-dashed cursor-pointer'
                    onClick={() => inputRef.current.click()}
                >
                    <input ref={inputRef} type='file' accept='.pdf,.jpg,.jpeg,.png' onChange={handleChange} className='hidden' />
                    <p className='text-center'>Drag and drop your file here</p>
                    <div className='w-full flex items-center gap-3'>
                        <div className='w-full border' />
                        <p>OR</p>
                        <div className='w-full border' />
                    </div>
                    <button
                        type='button'
                        onClick={() => inputRef.current.click()}
                        className='px-4 py-2 bg-[#ff7703] text-white'
                    >
                        Upload a file
                    </button>
                </div>
            ) : (
                <>
                    {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt='Preview' className='xl:w-[1056px] xl:h-[816px] object-contain' />
                    ) : (
                        <embed src={URL.createObjectURL(file)} type='application/pdf' className='xl:w-[1056px] xl:h-[816px]' />
                    )}
                    <div className='w-full flex gap-3 justify-center'>
                        <button
                            onClick={() => setFile(null)}
                            className='w-full md:w-fit h-[40px] px-4 flex items-center justify-center gap-2 border text-red-500'
                        >
                            <p>Remove File</p>
                            <MdDelete size={18} />
                        </button>
                        <button
                            type='submit'
                            className='w-full md:w-fit h-[40px] px-4 flex items-center justify-center gap-2 bg-[#ff7703] text-white'
                            disabled={isUploading}
                        >
                            <p>Upload File</p>
                            <MdFileUpload size={18} />
                        </button>
                    </div>
                </>
            )}
        </form>
    )
}