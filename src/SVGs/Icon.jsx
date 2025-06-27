import React from 'react'

const Icon = () => {
    return (
        <svg className='w-8 h-8' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M12 2L2 7L12 12L22 7L12 2Z' fill='url(#gradient1)' />
            <path d='M2 17L12 22L22 17' stroke='url(#gradient1)' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
            <path d='M2 12L12 17L22 12' stroke='url(#gradient2)' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
            <defs>
                <linearGradient id='gradient1' x1={2} y1={7} x2={22} y2={7} gradientUnits='userSpaceOnUse'>
                    <stop stopColor='#0068c6' />
                    <stop offset={1} stopColor='#6627cc' />
                </linearGradient>
                <linearGradient id='gradient2' x1={2} y1={17} x2={22} y2={17} gradientUnits='userSpaceOnUse'>
                    <stop stopColor='#0068c6' />
                    <stop offset={1} stopColor='#6627cc' />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default Icon
