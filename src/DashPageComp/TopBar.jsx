import React from 'react'
import NotificationBell from '../SVGs/NotificationBell'
import HamburgerIcon from '../SVGs/HamburgerIcon'
import { NavLink } from 'react-router-dom'
import ProfileDropdown from '../Components/ProfileDropdown'

const TopBar = ({onOpenSidebar}) => {
  return (
    <header className='bg-white border-b border-gray-200 flex items-center justify-between p-4'>
        <div className='flex items-center'>
            <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                <HamburgerIcon></HamburgerIcon>
            </button> 
            <h1 className='text-xl font-semibold text-[#1e293b]'>Dashboard</h1>
        </div>

        <div className='flex items-center space-x-4'>
            <div className={`flex items-center px-3 py-1 ${navigator.onLine ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'} rounded-full text-sm`}>
                <span className={`w-2 h-2 ${navigator.onLine ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-2`}></span>
                <span>{navigator.onLine ? 'Online' : 'Offline'}</span>
            </div>

            <button className='relative text-[#64748b] hover:text-[#334155]'>
                <NotificationBell></NotificationBell>
                <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>

            <div className='relative'>
            <ProfileDropdown></ProfileDropdown>
            </div>
        </div>
    </header>
  )
}

export default TopBar
