import React, { useState } from 'react'
import Sidebar from './Sidebar'
import MainContent from './MainContent'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className='font-sans bg-gray-50 text-[#1e293b] flex h-screen overflow-hidden'>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}></Sidebar>
      <MainContent onOpenSidebar={() => setSidebarOpen(true)}></MainContent> 
    </div>
  )
}

export default Dashboard
