import React from 'react'

export default function Heading({text}:{text:string}) {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl py-12">
            {text}
        </h1>
    )
}
