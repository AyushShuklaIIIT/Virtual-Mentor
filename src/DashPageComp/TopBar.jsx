import React, { useState, useEffect } from 'react'
import NotificationBell from '../SVGs/NotificationBell'
import HamburgerIcon from '../SVGs/HamburgerIcon'
import ProfileDropdown from '../Components/ProfileDropdown'

const TopBar = ({onOpenSidebar}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update online status
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <header className='bg-white border-b border-gray-200 flex items-center justify-between p-4'>
        <div className='flex items-center'>
            <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                <HamburgerIcon></HamburgerIcon>
            </button> 
            <h1 className='text-xl font-semibold text-[#1e293b]'>Dashboard</h1>
        </div>

        <div className='flex items-center space-x-4'>
            <div className={`flex items-center px-3 py-1 ${isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'} rounded-full text-sm`}>
                <span className={`w-2 h-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full mr-2`}></span>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
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