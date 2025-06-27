import React, { useState } from 'react'
import Sidebar from '../DashPageComp/Sidebar'
import Calendar from './Calendar'

const CalPlusNav = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false)
  return (
    <div className='bg-gray-50 flex h-screen overflow-hidden'>
      <Sidebar open={sidebarOpen} onClose={() => setsidebarOpen(false)}></Sidebar>
      <Calendar onOpenSidebar={() => setsidebarOpen(true)}></Calendar>
    </div>
  )
}

export default CalPlusNav
