import React from 'react'

const DownButton = ({ onClick }) => {
    return (
        <button className='bg-[#7738ea] hover:bg-[#6627cc] rounded-lg p-2 flex justify-center items-center cursor-pointer' onClick={onClick}>
            <lord-icon
                src="https://cdn.lordicon.com/gqfozvrp.json"
                trigger="hover"
                colors="primary:#ffffff"
                stroke="bold"
                style={{width: "18px", height: "18px"}}>
            </lord-icon>
        </button>
    )
}

export default DownButton
