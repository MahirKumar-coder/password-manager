import React from 'react'

const Footer = () => {
    return (
        
            <div className='bg-[#ff7722] text-white   flex flex-col  items-center   w-full py-4 gap-2'>
                <div className="logo font-bold text-2xl ">
                    <span className='text-[#0000FF]'>&lt;</span>
                    <span>Pass</span>

                    <span className='text-[#0000FF]'>Op/&gt;</span>

                </div>
                <div className='flex gap-2 items-center justify-center text-sm'>
                    Creared with <img className='w-7 m-2 ' src="icons/heart.png" alt="z" /> by CodeWithMahir
                </div>
            </div>
        
    )
}

export default Footer
