import React from 'react'

const Illustration = () => {
    return (
        <svg className='w-full h-auto' viewBox='0 0 600 620' fill='none' xmlns='http://www.w3.org/2000/svg'>
            {/* Background Shape */}
            <path
                className='blob'
                d="M250,50 C361,50 450,138.873 450,250 C450,361.127 361,450 250,450 C138.873,450 50,361.127 50,250 C50,138.873 138.873,50 250,50 Z"
                fill="url(#hero-gradient)"
                stroke="#bae0fd"
                filter='url(#dropShadow)'
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dashboard Frame */}
            <rect x="150" y="100" width={300} height={226} rx={12} fill='white' stroke='#E2E8F0' strokeWidth={2} filter='url(#dropShadow)' />
            <rect x="150" y="100" width={300} height={40} rx={12} fill='#f8fafc' stroke='#e2e8f0' strokeWidth={2} />

            {/* Dashboard Header */}
            <circle cx={170} cy={120} r={6} fill='#fda4af' />
            <circle cx={190} cy={120} r={6} fill='#fcd34d' />
            <circle cx={210} cy={120} r={6} fill='#86efac' />

            {/* Dashboard Content */}
            <rect x={165} y={155} width={120} height={80} rx={6} fill='#f0f7ff' stroke='#bae0fd' strokeWidth={1} />
            <rect x={165} y={245} width={120} height={68} rx={6} fill='#f5f3ff' stroke='#dcd5ff' strokeWidth={1} />
            <rect x={295} y={155} width={140} height={158} rx={6} fill='#f8fafc' stroke='#e2e8f0' strokeWidth={1} />

            {/* Task Items */}
            <rect x={175} y={165} width={100} height={12} rx={2} fill='#0068c6' />
            <rect x={175} y={185} width={80} height={8} rx={2} fill='#cbd5e1' />
            <rect x={175} y={200} width={90} height={8} rx={2} fill='#cbd5e1' />
            <rect x={175} y={215} width={70} height={8} rx={2} fill='#cbd5e1' />

            {/* Chart */}
            <rect x={175} y={255} width={100} height={10} rx={2} fill='#6627cc' />
            <rect x={175} y={275} width={80} height={10} rx={2} fill='#0068c6' />
            <rect x={175} y={295} width={60} height={10} rx={2} fill='#7738ea' />

            {/* Calendar/Tasks  */}
            <rect x={305} y={165} width={120} height={12} rx={2} fill='#0068c6' />
            <rect x={305} y={185} width={120} height={1} rx={0.5} fill='#e2e8f0' />

            <rect x={305} y={195} width={10} height={10} rx={2} fill='#bae0fd' />
            <rect x={320} y={195} width={70} height={10} rx={2} fill='#94a3b8' />

            <rect x={305} y={215} width={10} height={10} rx={2} fill='#c3b5fd' />
            <rect x={320} y={215} width={90} height={10} rx={2} fill='#94a3b8' />

            <rect x={305} y={235} width={10} height={10} rx={2} fill='#bae0fd' />
            <rect x={320} y={235} width={60} height={10} rx={2} fill='#94a3b8' />

            <rect x={305} y={255} width={10} height={10} rx={2} fill='#c3b5fd' />
            <rect x={320} y={255} width={80} height={10} rx={2} fill='#94a3b8' />

            <rect x={305} y={275} width={10} height={10} rx={2} fill='#bae0fd' />
            <rect x={320} y={275} width={50} height={10} rx={2} fill='#94a3b8' />

            {/* AI Assistant Bubble */}
            <g className='floating'>
                <rect x={320} y={70} width={140} height={60} rx={12} fill='#0068c6' />
                <path d='M340 130L320 110H340V130Z' fill='#0068c6' />
                <text x={390} y={100} fontFamily='Inter, sans-serif' fontSize={12} fill='white' textAnchor='middle'>AI Assistant</text>
                <text x={390} y={115} fontFamily='Inter, sans-serif' fontSize={10} fill='white' textAnchor='middle'>Suggesting smart tasks</text>
            </g>

            {/* Floating elements */}
            <g className='floating floating-delay-1'>
                <circle cx={120} cy={180} r={20} fill='#f0f7ff' />
                <path d='M120 170V190M110 180H130' stroke='#0068c6' strokeWidth={2} strokeLinecap='round' />
            </g>

            <g className='floating floating-delay-2'>
                <circle cx={480} cy={220} r={25} fill='#f5f3ff' />
                <path d='M480 210V230M470 220H490' stroke='#6627CC' strokeWidth={2} strokeLinecap='round' />
            </g>

            {/* Mobile Device */}
            <rect x={230} y={340} width={140} height={240} rx={20} fill='white' stroke='#e2e8f0' strokeWidth={2} filter='url(#dropShadow)' />
            <rect x={230} y={380} width={140} height={160} rx={4} fill='#f8fafc' />
            <rect x={245} y={395} width={110} height={40} rx={6} fill='#f0f7ff' stroke='#bae0fd' strokeWidth={1} />
            <rect x={245} y={445} width={110} height={40} rx={6} fill='#f5f3ff' stroke='#dcd5ff' strokeWidth={1} />
            <rect x={245} y={495} width={110} height={30} rx={6} fill='#f0f7ff' stroke='#bae0fd' strokeWidth={1} />

            <rect x={255} y={405} width={70} height={8} rx={2} fill='#0068c6' />
            <rect x={255} y={420} width={50} height={6} rx={2} fill='#94a3b8' />

            <rect x={255} y={455} width={70} height={8} rx={2} fill='#6627cc' />
            <rect x={255} y={470} width={50} height={6} rx={2} fill='#94a3b8' />

            <rect x={255} y={505} width={70} height={8} rx={2} fill='#0068c6' />

            <circle cx={300} cy={360} r={8} fill='#f1f5f9' />
            <rect x={285} y={550} width={30} height={5} rx={2.5} fill='#e2e8f0' />

            {/* Sync Indicator */}
            <g className='floating'>
                <circle cx={400} cy={460} r={30} fill='#f0f7ff' />
                <path d='M400 445V455M400 465V475M385 460H395M405 460H415' stroke='#0068c6' strokeWidth={2} strokeLinecap='round' />
                <path d='M385 445L415 475M385 475L415 445' stroke='#0068c6' strokeWidth={2} strokeLinecap='round' />
            </g>

            {/* Connection Lines */}
            <path d='M300 340C300 340 350 300 350 280' stroke='#e2e8f0' strokeWidth={2} strokeDasharray="4 4" />
            <path d='M370 460C370 460 390 460 400 460' stroke='#e2e8f0' strokeWidth={2} strokeDasharray="4 4" />

            <defs>
                <linearGradient id='hero-gradient' x1={50} y1={250} x2={450} y2={250} gradientUnits='userSpaceOnUse'>
                    <stop stopColor='#0068c6' stopOpacity={0.4} />
                    <stop offset={1} stopColor='#6627cc' stopOpacity={0.4} />
                </linearGradient>
                <filter id='dropShadow' x="-20%" y='-20%' width="140%" height="140%">
                    <feDropShadow dx={0} dy={4} stdDeviation={4} floodColor="#cbd5e1" />
                </filter>
            </defs>
        </svg>
    )
}

export default Illustration
