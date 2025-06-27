import React from 'react'
import TopBar from './TopBar'
import MainDashboardContent from './MainDashboardContent'

const MainContent = ({onOpenSidebar}) => {
  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <TopBar onOpenSidebar={onOpenSidebar}></TopBar>
      <MainDashboardContent></MainDashboardContent>
    </div>
  )
}

export default MainContent
