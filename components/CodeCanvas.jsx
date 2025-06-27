import React, { useState } from 'react'
import LetterSwapForward from './letter-swap-forward-anim'
import Link from 'next/link'
import { SelectDiagram } from './SelectDiag'
import { Button } from './ui/button'
import { CodeEditor } from './CodeEditor'
import { ScrollArea } from './ui/scroll-area'
import { PhotoType } from './PhotoType'

const CodeCanvas = () => {
    const [diagram, setDiagram] = useState(null)
  return (
    <div className='min-h-screen w-full bg-[#ededed]'>
        <div className='container max-w-7xl mx-auto md:px-0 px-5'>
            {/* navbar */}
            <div className='py-4 flex items-center justify-between'>
                <div className='bg-black text-white max-w-fit py-1 px-2 font-semibold tracking-tighter cursor-pointer text-sm'>
                    <LetterSwapForward label="code canvas" staggerDuration={0} reverse={false} />
                </div>
                <div className='flex items-center gap-3'>
                    <div className='text-[0.6rem] bg-neutral-300 font-semibold py-1 px-2 text-neutral-900 rounded-lg cursor-pointer'>
                        <LetterSwapForward label="HOW TO USE" staggerDuration={0} reverse={false} />
                    </div>
                    <Link target='_blank' href='https://portfolio.sumona.tech/' className='text-black font-semibold uppercase text-xs tracking-tighter'>Say hey 👋</Link>
                </div>
            </div>

            {/* select & generate */}
            <div className='flex items-center gap-2 py-4'>
                <SelectDiagram />
                <Button className='text-sm rounded-[0.2rem] cursor-pointer px-8'>Generate</Button>
            </div>

            {/* code editor */}
            <div className='max-w-8xl mx-auto py-4'>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-10'>
                    <div>
                        <div className='pb-2 text-black font-semibold uppercase text-xs tracking-tighter'>Code here 💻</div>
                        <ScrollArea className="h-[37rem] rounded-[0.2rem]">
                            <CodeEditor />
                        </ScrollArea>
                    </div>
                    <div>
                        <div className='pb-2 text-black font-semibold uppercase text-xs tracking-tighter'>DIAGRAM 📝</div>
                        <ScrollArea className="min-h-[25rem] w-full bg-white p-2 rounded-[0.2rem]">
                            {diagram ? (
                                diagram 
                            ) : (
                                <div className="flex items-center justify-center min-h-[25rem] text-neutral-300 text-xs font-semibold">
                                diagram will appear here
                                </div>
                            )}
                        </ScrollArea>
                        <div className='w-full flex items-center justify-end gap-2 py-4'>
                            <PhotoType />
                            <Button className='text-sm rounded-[0.2rem] cursor-pointer px-8 w-[12rem]'>Save</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CodeCanvas