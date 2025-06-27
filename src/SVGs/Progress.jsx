import React from 'react'

const Progress = ({percent, stroke, fill}) => {
    return (
        <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
                d="M18 2.0845
       a 15.9155 15.9155 0 0 1 0 31.831
       a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18 2.0845
       a 15.9155 15.9155 0 0 1 0 31.831
       a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="100"
                strokeDashoffset={100 - percent}
            />
            <text x="18" y="20.5" fontFamily="Inter" fontSize="10" textAnchor="middle" fill={fill}>
                {percent}%
            </text>
        </svg>

    )
}

export default Progress
