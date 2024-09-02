import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BsFiletypePdf } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { FaSave } from 'react-icons/fa'
import { useFetchCertificate } from '../../hooks/fetch-certificate'
import Loading from '../../components/loading'
import PDFViewer from './pdf'

export default function CertificateEdit() {
    const navigate = useNavigate()

    const { certificateID } = useParams()
    const { isLoading, data, setData } = useFetchCertificate(certificateID, 'admin')

    const inputRef = useRef(null)
    const [file, setFile] = useState(null)
    const [isSaving, setSaving] = useState(false)

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (e.target.files[0].type !== 'application/pdf') {
                return toast.error('Please upload only PDF file')
            }
            setFile(e.target.files[0])
        }
    }

    const handleInputChange = (field, value) => {
        setData(prevData => ({
            ...prevData,
            issued: {
                ...prevData.issued,
                [field]: value
            }
        }))
    }

    const handleEditForm = async (e) => {
        e.preventDefault()

        setSaving(true)

        const formData = new FormData()
        formData.append('certificate_id', certificateID)
        formData.append('issued_for', data.issued.for)
        formData.append('issued_to', data.issued.to)
        formData.append('is_valid', data.valid)
        if (file) formData.append('certificate', file)

        try {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/certificate`, {
                method: 'PUT',
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
            setSaving(false)
        }
    }

    return (
        isLoading ? <Loading size={30} color='#ff7703' className='mx-auto' /> : (
            data._id ? (
                <div className='mx-auto w-fit'>
                    <PDFViewer file={file || data.file.url} />

                    <form
                        onSubmit={handleEditForm}
                        className='mt-5 mx-auto max-w-[500px] flex flex-col gap-3'
                    >
                        <div className='flex items-center gap-5'>
                            {file ? (
                                <>
                                    <div className='w-[50px] h-[50px] grid place-content-center border rounded'>
                                        <BsFiletypePdf size={30} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p>{file.name}</p>
                                        <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </>
                            ) : (
                                <div className='flex flex-col flex-1'>
                                    <input ref={inputRef} type='file' accept='.pdf,.jpg,.jpeg,.png' onChange={handleChange} className='hidden' />
                                    <button
                                        type='button'
                                        onClick={() => inputRef.current.click()}
                                        className='w-full h-[50px] bg-orange-100 border border-[#ff7703] text-[#ff7703] rounded'
                                    >
                                        Upload new file (PDF only)
                                    </button>
                                </div>
                            )}
                        </div>

                        <input
                            placeholder='Enter Certificate Subject'
                            className='p-3 border rounded'
                            value={data.issued.for}
                            onChange={(e) => handleInputChange('for', e.target.value)}
                        />
                        <input
                            placeholder='Enter Certificate Recipient Name'
                            className='p-3 border rounded'
                            value={data.issued.to}
                            onChange={(e) => handleInputChange('to', e.target.value)}
                        />

                        <div className='p-3 flex gap-5 border rounded'>
                            <p className='font-bold'>Certificate Status</p>
                            <label className='flex gap-1 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='status'
                                    value={true}
                                    checked={data.valid === true}
                                    onChange={() => setData(prevData => ({ ...prevData, valid: true }))}
                                />
                                Valid
                            </label>
                            <label className='flex gap-1 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='status'
                                    value={false}
                                    checked={data.valid === false}
                                    onChange={() => setData(prevData => ({ ...prevData, valid: false }))}
                                />
                                Invalid
                            </label>
                        </div>

                        <div className='w-full flex gap-3 justify-center'>
                            {file && !isSaving && (
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
                                className={`w-full md:w-fit h-[40px] px-4 flex items-center justify-center gap-3 ${isSaving ? 'bg-transparent text-[#ff7703] cursor-not-allowed' : 'bg-[#ff7703] text-white'} rounded`}
                                disabled={isSaving}
                            >
                                {isSaving ? <Loading size={25} className='mx-auto' /> : (
                                    <><p>Save Certificate</p><FaSave size={18} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : <p>No certificate found</p>
        )
    )
}