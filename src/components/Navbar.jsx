import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-[#ff7722] text-white '>
            <div className="myContainer p-4 flex justify-between items-center text-white h-auto py-4">
                <div className="logo font-bold text-2xl">
                    <span className='text-[#0000FF]'>&lt;</span>
                    <span>Pass</span>
                    
                    <span className='text-[#0000FF]'>Op/&gt;</span>

                </div>
                {/* <ul className='flex space-x-4'>
                    <li className='flex gap-6 text-lg font-medium'>
                        <a className='hover:font-bold' href="/">Home</a>
                        <a className='hover:font-bold' href="#">About</a>
                        <a className='hover:font-bold' href="#">Contact</a>
                    </li>
                </ul> */}
                <button className='bg-white text-[#ff7722] rounded-full flex items-center  hover:scale-105 duration-200 justify-between border border-[#0000FF] absolute right-4 md:relative ring-2 ring-[#0000FF]'>
                    <img className='p-1 w-30' src="/icons/github.png" alt="" />
                </button>
            </div>
        </nav>
    )
}

export default Navbar
