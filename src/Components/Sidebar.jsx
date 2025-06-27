import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

const Sidebar = ({open, onClose}) => {
  return (
    <>
      <div className={`sidebar ${open ? "sidebar-open": ""}`}>
      <button className='sidebar-close-btn' onClick={onClose}>&times;</button>
        <div className='flex flex-col items-center space-y-8 mt-6'>
            <a href="#features" className="text-gray-600 hover:text-[#0068c6] transition-colors">Features</a>
            <a href="#" className='text-gray-600 hover:text-[#0068c6] transition-colors'>Pricing</a>
            <a href="#" className='text-gray-600 hover:text-[#0068c6] transition-colors'>Resources</a>
            <a href="#about" className='text-gray-600 hover:text-[#0068c6] transition-colors'>About</a>
            <NavLink to="/dashboard" className='text-gray-600 hover:text-[#0068c6] transition-colors'>Log In</NavLink>
            <NavLink to="/signup" className='px-4 py-2 bg-[#0068c6] text-white rounded-lg hover:bg-[#0054a1] transition-colors'>Sign Up</NavLink>
        </div>
      </div>
      {open && <div className='sidebar-overlay' onClick={onClose}></div>}
    </>
  )
}

export default Sidebar
