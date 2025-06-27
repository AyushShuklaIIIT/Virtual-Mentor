import React from 'react'
import HeroLeftCol from './HeroLeftCol'
import HeroRightCol from './HeroRightCol'
import Trusted from './Trusted'

const HeroSection = () => {
  return (
    <section className='pt-32 pb-20 md:pt-40 md:pb-28 px-6 relative overflow-hidden' id="about">
        {/* Background Blobs */}
        <div className='absolute -top-24 -right-24 w-96 h-96 bg-[#bae0fd]/30 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 -left-48 w-96 h-96 bg-[#dcd5ff]/30 rounded-full blur-3xl'></div>

        <div className='max-w-7xl mx-auto'>
            <div className='grid md:grid-cols-2 gap-12 items-center'>
                <HeroLeftCol></HeroLeftCol>
                <HeroRightCol></HeroRightCol>
            </div>

            {/* Trusted By Section */}
            <Trusted></Trusted>
        </div>
    </section>
  )
}

export default HeroSection
