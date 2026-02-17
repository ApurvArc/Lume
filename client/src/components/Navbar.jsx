import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const { setShowLogin, user, credit, logout } = useContext(AppContext)

    const navigate = useNavigate()

    return (
        <div className='flex items-center justify-between py-4'>

            <Link to='/'><img className='w-28 sm:w-32 lg:w-40' src={assets.logo} alt="" /></Link>

            <div className='flex items-center gap-2 sm:gap-5'>
                {/* AI Tools Dropdown */}
                <div className='relative group'>
                    <p className='cursor-pointer text-gray-700 hover:text-blue-600 transition-colors'>AI Tools</p>
                    <div className='absolute hidden group-hover:block top-full right-0 z-10 pt-2'>
                        <ul className='list-none m-0 p-2 bg-white rounded-lg border shadow-lg text-sm min-w-[180px]'>
                            <li onClick={() => navigate('/result')} className='py-2 px-4 cursor-pointer hover:bg-blue-50 rounded-md transition-colors'>🎨 Generate Image</li>
                            <li onClick={() => navigate('/remove-bg')} className='py-2 px-4 cursor-pointer hover:bg-blue-50 rounded-md transition-colors'>🖼️ Background Remover</li>
                            <li onClick={() => navigate('/upscale')} className='py-2 px-4 cursor-pointer hover:bg-blue-50 rounded-md transition-colors'>🔍 Image Upscaler</li>
                            <li onClick={() => navigate('/cleanup')} className='py-2 px-4 cursor-pointer hover:bg-blue-50 rounded-md transition-colors'>🧹 Image Cleanup</li>
                        </ul>
                    </div>
                </div>

                {
                    user
                        ? <div className='flex items-center gap-2 sm:gap-3'>
                            <button onClick={() => navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                                <img className='w-5' src={assets.credit_star} alt="" />
                                <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits left : {credit}</p>
                            </button>
                            <p className='text-gray-600 max-sm:hidden pl-4'>Hi, {user.name}</p>
                            <div className='relative group'>
                                <img className='w-10 drop-shadow' src={assets.profile_icon} alt="" />
                                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded  pt-12'>
                                    <ul className='list-none m-0 p-2 bg-white rounded-md border  text-sm'>
                                        <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        : <div className='flex items-center gap-2 sm:gap-5'>
                            <p onClick={() => navigate('/buy')} className='cursor-pointer'>Pricing</p>
                            <button onClick={() => setShowLogin(true)} className='bg-zinc-800 text-white px-7 py-2 sm:px-10 sm:py-2 text-sm rounded-full'>
                                Login
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}

export default Navbar