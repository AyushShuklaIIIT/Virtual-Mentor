import React, { useState } from 'react'
import Sidebar from '../DashPageComp/Sidebar'
import Settings from './Settings'

const SettingsNav = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false)
    return (
        <div className='bg-gray-50 flex h-screen overflow-hidden'>
            <Sidebar open={sidebarOpen} onClose={() => setsidebarOpen(false)}></Sidebar>
            <div className='overflow-y-auto w-full'>
                <Settings onOpenSidebar={() => setsidebarOpen(true)}></Settings>
            </div>
        </div>
    )
}

export default SettingsNav