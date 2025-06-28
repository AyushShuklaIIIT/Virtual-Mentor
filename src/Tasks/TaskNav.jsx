import React, { useState } from 'react'
import Sidebar from '../DashPageComp/Sidebar'
import Tasks from './Tasks'

const TaskNav = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false)
  return (
    <div className='bg-gray-50 flex h-screen overflow-hidden'>
      <Sidebar open={sidebarOpen} onClose={() => setsidebarOpen(false)}></Sidebar>
      <Tasks onOpenSidebar={() => setsidebarOpen(true)}></Tasks>
    </div>
  )
}

export default TaskNav
