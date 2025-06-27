import React from 'react'
import PomodoroTimer from './PomodoroTimer'
import Calendar from './Calendar'

const MainContentRightCol = () => {
  return (
    <div className='space-y-6'>
      <PomodoroTimer></PomodoroTimer>
      <Calendar></Calendar>
    </div>
  )
}

export default MainContentRightCol
