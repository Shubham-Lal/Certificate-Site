import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOpenInNew, MdDelete, MdEdit, MdDone } from 'react-icons/md'
import { toast } from 'sonner'
import { RxCross2 } from 'react-icons/rx'
import { useFetchCertificates } from '../../hooks/fetch-certificate'
import Loading from '../../components/loading'

export default function Admin() {
    const { isLoading, data, setData } = useFetchCertificates()

    const [deletingId, setDeletingId] = useState(null)

    const handleDeleteCertificate = async (certificateID) => {
        const confirmed = window.confirm('Are you sure you want to delete this certificate?')
        if (!confirmed) return

        setDeletingId(certificateID)

        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/certificate/${certificateID}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) setData(prev => prev.filter(item => item._id !== certificateID))
                else toast.error(response.message || 'Error deleting certificate')
            })
            .catch(() => {
                toast.error('Error deleting certificate')
            })
            .finally(() => setDeletingId(null))
    }

    return (
        <div className='overflow-x-hidden'>
            <div className='mx-auto xl:w-[calc(1280px-0.75rem-0.75rem)] flex items-center justify-between'>
                <h1 className='text-2xl sm:text-3xl'>Certificates</h1>
                <Link to='upload' className='px-4 w-fit h-[40px] flex items-center justify-center bg-orange-100 border border-[#ff7703] text-[#ff7703] rounded'>
                    Create Certificate
                </Link>
            </div>

            <div className='mx-auto xl:w-fit overflow-x-auto'>
                <table className='w-[calc(1280px-0.75rem-0.75rem)] mt-3 border-collapse border border-gray-300'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='w-[20%] border border-gray-300'>ID</th>
                            <th className='border border-gray-300'>Subject</th>
                            <th className='w-[20%] border border-gray-300'>Name</th>
                            <th className='w-[50px] border border-gray-300'></th>
                            <th className='w-[50px] border border-gray-300'></th>
                            <th className='w-[50px] border border-gray-300'></th>
                            <th className='w-[50px] border border-gray-300'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td className='py-2 px-3'>
                                    <Loading size={24} color='#ff7703' />
                                </td>
                            </tr>
                        ) : (
                            data.length ? (
                                data.map(item => (
                                    <tr key={item._id}>
                                        <td className='py-2 px-3 border border-gray-300 text-center'>{item._id}</td>
                                        <td className='py-2 px-3 border border-gray-300'>{item.issued.for}</td>
                                        <td className='py-2 px-3 border border-gray-300 text-center'>{item.issued.to}</td>
                                        <td className={`py-2 px-3 border border-gray-300`}>
                                            {item.valid ? (
                                                <MdDone size={24} className='text-green-500' title='Certificate Valid' />
                                            ) : (
                                                <RxCross2 size={24} className='text-red-500' title='Certificate Invalid' />
                                            )}
                                        </td>
                                        <td className='py-2 px-3 border border-gray-300 cursor-pointer group'>
                                            <Link to={`/certificate/${item._id}`}>
                                                <MdOpenInNew size={24} className='text-gray-600 group-hover:text-black' />
                                            </Link>
                                        </td>
                                        <td className='py-2 px-3 border border-gray-300 cursor-pointer group'>
                                            <Link to={`/certificate/${item._id}/edit`}>
                                                <MdEdit size={24} className='text-gray-600 group-hover:text-black' />
                                            </Link>
                                        </td>
                                        <td className='py-2 px-3 border border-gray-300 cursor-pointer group'>
                                            <button
                                                className={`flex items-center justify-center ${deletingId === item._id ? 'cursor-not-allowed' : ''}`}
                                                onClick={() => handleDeleteCertificate(item._id)} 
                                                disabled={deletingId === item._id}
                                            >
                                                {deletingId === item._id ? (
                                                    <Loading size={24} className='text-red-500' />
                                                ) : (
                                                    <MdDelete size={24} className='text-gray-600 group-hover:text-red-500' />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td className='py-2 px-3'><p>No certificate added yet</p></td></tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
