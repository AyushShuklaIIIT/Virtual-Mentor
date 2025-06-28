import React, { useState } from 'react'
import Sidebar from '../DashPageComp/Sidebar'
import AISuggestion from './AISuggestion'

const TaskNav = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false)
  return (
    <div className='bg-gray-50 flex h-screen overflow-hidden'>
      <Sidebar open={sidebarOpen} onClose={() => setsidebarOpen(false)}></Sidebar>
      <AISuggestion onOpenSidebar={() => setsidebarOpen(true)}></AISuggestion>
    </div>
  )
}

export default TaskNav
