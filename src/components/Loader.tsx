import React from 'react'
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

export default function Loader() {
    return (
        <div className='min-h-screen 
    flex items-center justify-center 
    '>
            <ClimbingBoxLoader
                color='#2563EB'
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}
