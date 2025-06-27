import React, { useState } from 'react'
import Sidebar from '../DashPageComp/Sidebar'
import Insights from './Insights'

const CalPlusNav = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false)
    return (
        <div className='bg-gray-50 flex h-screen overflow-hidden'>
            <Sidebar open={sidebarOpen} onClose={() => setsidebarOpen(false)}></Sidebar>
            <div className='overflow-y-auto w-full'>
                <Insights onOpenSidebar={() => setsidebarOpen(true)}></Insights>
            </div>
        </div>
    )
}

export default CalPlusNav