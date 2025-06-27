import React from 'react'

const Features = () => {
  return (
    <section className='py-16 px-6 bg-white' id="features">
      <div className='max-w-7xl mx-auto text-center'>
        <h2 className='text-3xl font-bold mb-4'>Supercharge Your Productivity</h2>
        <p className='text-gray-600 max-w-2xl mx-auto mb-12'>Intelligent Task Mentor combines AI-powered suggestions with seamless sync to help you stay focused, manage priorities, and boost productivity effortlessly across all your devices.</p>

        <div className='grid md:grid-cols-3 gap-8'>
            <div className='p-6 bg-gray-50 rounded-xl'>
                <div className='w-12 h-12 bg-[#e0effe] rounded-lg flex items-center justify-center mx-auto mb-4'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-[#0068c6]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v719-11h-7z' />
                    </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>AI-Powered Suggestions</h3>
                <p className='text-gray-600'>Get intelligent task recommendations based on your habits and priorities.</p>
            </div>

            <div className='p-6 bg-gray-50 rounded-xl'>
                <div className='w-12 h-12 bg-[#ede8ff] rounded-lg flex items-center justify-center mx-auto mb-4'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-[#7738ea]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                    </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Seamless Sync</h3>
                <p className='text-gray-600'>Work offline and your data will automatically sync when you're back online.</p>
            </div>

            <div className='p-6 bg-gray-50 rounded-xl'>
                <div className='w-12 h-12 bg-[#e0effe] rounded-lg flex items-center justify-center mx-auto mb-4'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-[#0068c6]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M8 21h8m-4-4v4m0-4a4 4 0 004-4V5H8v8a4 4 0 004 4zm6-11h2a2 2 0 012 2v1a4 4 0 01-4 4M6 6H4a2 2 0 00-2 2v1a4 4 0 004 4" />
                    </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Gamified Experience</h3>
                <p className='text-gray-600'>Earn rewards and track your progress with a fun, engaging productivity system.</p>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Features
