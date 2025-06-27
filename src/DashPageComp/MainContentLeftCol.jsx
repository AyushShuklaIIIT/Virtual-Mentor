import React from 'react'
import TodayTasks from './TodayTasks'
import ProductivityInsights from './ProductivityInsights'

const MainContentLeftCol = () => {
  return (
    <div className='lg:col-span-2 space-y-6'>
      <TodayTasks></TodayTasks>
      <ProductivityInsights></ProductivityInsights>
    </div>
  )
}

export default MainContentLeftCol
