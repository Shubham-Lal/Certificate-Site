import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdOpenInNew, MdDelete, MdEdit, MdDone } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'

export default function Admin() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchCertificates = async () => {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/certificates`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) setData(response.data)
                })
        }

        fetchCertificates()
    }, [])

    return (
        <div className='relative overflow-x-hidden'>
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
                        {data.length ? (
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
                                        <a href={`${import.meta.env.VITE_CLIENT_URL}/certificate/${item._id}`} target='_blank' rel='noopener noreferrer'>
                                            <MdOpenInNew size={24} className='text-gray-600 group-hover:text-black' />
                                        </a>
                                    </td>
                                    <td className='py-2 px-3 border border-gray-300 cursor-pointer group'>
                                        <Link to={`/certificate/${item._id}/edit`}>
                                            <MdEdit size={24} className='text-gray-600 group-hover:text-black' />
                                        </Link>
                                    </td>
                                    <td className={`py-2 px-3 border border-gray-300 cursor-pointer group`}>
                                        <MdDelete size={24} className='text-gray-600 group-hover:text-red-500' />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td className='py-2 px-3'><p>No certificate yet</p></td></tr>
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    )
}