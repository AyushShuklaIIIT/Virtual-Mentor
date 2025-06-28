import React from 'react'
import ButtonIcon from '../SVGs/ButtonIcon'
import { NavLink } from 'react-router-dom'

const Navigation = ({setSidebarOpen}) => {
  return (
    <nav className='bg-white/80 backdrop-blur-md py-4 px-6 fixed w-full z-10 border-b border-gray-100'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
            <img src="/logo-1.png" alt="Virtual Mentor Logo" className='w-12 h-12' />
            <span className='font-bold text-xl'>Virtual Mentor</span>
        </div>

        <div className='hidden md:flex items-center space-x-8'>
            <a href="#features" className="text-gray-600 hover:text-[#0068c6] transition-colors">Features</a>
            <a href="#about" className='text-gray-600 hover:text-[#0068c6] transition-colors'>About</a>
        </div> 

        <div className='flex items-center space-x-4'>
            <NavLink to="/login" className='hidden md:block text-gray-600 hover:text-[#0068c6] transition-colors'>Log In</NavLink>
            <NavLink to="/signup" className='hidden md:block px-4 py-2 bg-[#0068c6] text-white rounded-lg hover:bg-[#0054a1] transition-colors'>Sign Up</NavLink>
            <button id='open-dashboard-sidebar' className='md:hidden text-gray-600 sidebar-toggle-btn' onClick={() => setSidebarOpen(true)}>
                <ButtonIcon></ButtonIcon>
            </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
