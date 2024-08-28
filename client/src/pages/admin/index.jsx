import { Link } from 'react-router-dom'

export default function Admin() {
    return (
        <div className='flex flex-col gap-5'>
            <Link
                to='upload'
                className='px-2 w-fit h-[40px] flex items-center justify-center bg-[#ff7703] text-white'
            >
                Upload Certificate
            </Link>
        </div>
    )
}