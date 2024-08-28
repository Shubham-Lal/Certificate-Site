import { useState, useRef } from 'react'
import { toast } from 'sonner'

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

export default function Upload() {
    const inputRef = useRef(null)
    const [file, setFile] = useState(null)
    const [isUploading, setUploading] = useState(false)

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            inputRef.current.files = e.dataTransfer.files
            validateAndProcessFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            validateAndProcessFile(e.target.files[0])
        }
    }

    const validateAndProcessFile = (file) => {
        if (!allowedTypes.includes(file.type)) {
            return toast.error('Unsupported file type. Please upload .pdf/.png/.jpg/.jpeg format certificate.')
        }
        setFile(file)
    }

    const handleUploadForm = (e) => {
        e.preventDefault()

        if (!allowedTypes.includes(file.type)) {
            return toast.error('Unsupported file type. Please upload .pdf/.png/.jpg/.jpeg format certificate.')
        }
        
        setUploading(true)

        console.log(file)
    }

    return (
        <form
            onSubmit={handleUploadForm}
            className='flex flex-col items-center justify-center gap-2'
        >
            {!file ? (
                <div
                    className='w-full max-w-[500px] p-6 flex flex-col items-center justify-center gap-5 border-2 border-dashed cursor-pointer'
                    onDrop={handleDrop}
                >
                    <input ref={inputRef} type='file' accept='image/*,.pdf' onChange={handleChange} className='hidden' />
                    <p className='text-center'>Drag and drop your file here or</p>
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
                    <button
                        onClick={() => setFile(null)}
                        className='px-4 py-2 bg-red-500 text-white'
                    >
                        Remove File
                    </button>
                    {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt='Preview' className='xl:w-[1056px] xl:h-[816px] object-contain' />
                    ) : (
                        <embed src={URL.createObjectURL(file)} type='application/pdf' className='xl:w-[1056px] xl:h-[816px]' />
                    )}
                    <button
                        type='submit'
                        className='px-4 py-2 bg-[#ff7703] text-white'
                        disabled={isUploading}
                    >
                        Upload
                    </button>
                </>
            )}
        </form>
    )
}