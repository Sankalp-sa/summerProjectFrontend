import React from 'react'

export default function Heading2({text}:{text:string}) {
    return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {text}
        </h2>
    )
}

