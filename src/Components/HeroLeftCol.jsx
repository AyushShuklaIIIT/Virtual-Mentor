import React from 'react'
import { NavLink } from 'react-router-dom'

const HeroLeftCol = () => {
  return (
    <div className='relative z-1'>
      <div className='inline-block px-4 py-1 bg-[#e0effe] text-[#0054a1] rounded-full text-sm font-medium mb-6'>
        <span className='flex items-center'>
          <span className='w-2 h-2 bg-[#0c87e8] rounded-full mr-2'></span>
          New AI Features Released
        </span>
      </div>

      <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight'>Smarter Task <span className='gradient-text'>Management,</span> Anywhere.</h1>

      <p className='text-xl text-gray-600 mb-8 max-w-lg'>
        AI-powered productivity planner that works offline and syncs seamlessly. Boost your efficiency with intelligent task suggestions.
      </p>

      <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
        <NavLink to="/dashboard" className='px-8 py-4 bg-[#0068c6] text-white rounded-lg hover:bg-[#0054a1] transition-colors text-center font-medium'>Get Started</NavLink>
        <NavLink to="/calendar" className='px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium flex justify-center items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 mr-2 text-[#0068c6]' fill='none' viewBox='0 0 24 24' stroke="currentColor">
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M10 9.75L15 12L10 14.25V9.75Z" />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          See Demo
        </NavLink>
      </div>

      <div className='mt-10 flex items-center space-x-6'>
        <div className='flex -space-x-2'>
          <img
            className='w-8 h-8 rounded-full ring-2 ring-white'
            src='https://api.dicebear.com/7.x/initials/svg?seed=AS'
            alt='User A'
          />
          <img
            className='w-8 h-8 rounded-full ring-2 ring-white'
            src='https://api.dicebear.com/7.x/initials/svg?seed=AA'
            alt='User B'
          />
          <img
            className='w-8 h-8 rounded-full ring-2 ring-white'
            src='https://api.dicebear.com/7.x/initials/svg?seed=AM'
            alt='User C'
          />
          <img
            className='w-8 h-8 rounded-full ring-2 ring-white'
            src='https://api.dicebear.com/7.x/initials/svg?seed=GS'
            alt='User D'
          />
        </div>
        <div className='text-sm text-gray-600'>
          <span className='font-semibold text-gray-800'>10,000+</span> users already joined
        </div>
      </div>
    </div>
  )
}

export default HeroLeftCol
