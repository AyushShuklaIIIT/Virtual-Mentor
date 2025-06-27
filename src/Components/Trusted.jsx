import React from 'react'

const Trusted = () => {
  return (
    <div className='mt-20 text-center'>
        <p  className='text-sm text-gray-500 mb-8'>TRUSTED BY INNOVATIVE TEAMS</p>
        <div className='flex flex-wrap justify-center items-center gap-x-12 gap-y-8'>
            {/* Company Logos */}
            <svg className='h-8 w-auto text-gray-400' viewBox='0 0 100 30' fill='currentColor'>
                <path d='M15 5h70v5H15zM15 12.5h45v5H15zM15 20h60v5H15z' />
            </svg>

            <svg className='h-8 w-auto text-gray-400' viewBox='0 0 100 30' fill='currentColor'>
                <circle cx={50} cy={15} r={12} />
                <path d='M25 15h50' stroke='curentColor' strokeWidth={5} />
            </svg>

            <svg className='h-8 w-auto text-gray-400' viewBox='0 0 100 30' fill='currentColor'>
                <rect x={20} y={5} width={60} height={20} rx={10} />
            </svg>

            <svg className='h-8 w-auto text-gray-400' viewBox='0 0 100 30' fill='currentColor'>
                <circle cx={30} cy={15} r={10} />
                <circle cx={70} cy={15} r={10} />
                <path d="M30 15h40" stroke='currentColor' strokeWidth={5} />
            </svg>
        </div>
    </div>
  )
}

export default Trusted
