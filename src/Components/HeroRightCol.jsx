import React from 'react'
import Illustration from '../SVGs/Illustration'

const HeroRightCol = () => {
  return (
    <div className='relative'>
        <div className='relative z-1'>
            <Illustration></Illustration>
        </div>

        {/* Decorative Elements */}
        <div className='absolute top-1/4 right-0 w-20 h-20 bg-[#0c87e8]/10 rounded-full blur-xl'></div>
        <div className='absolute bottom-1/4 left-0 w-24 h-24 bg-[#8a5cf5]/10 rounded-full blur-xl'></div>
    </div>
  )
}

export default HeroRightCol
