'use client'
import CodeCanvas from '@/components/CodeCanvas';
import { useState } from 'react';
import { motion, spring } from 'motion/react'

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <main className='relative select-none min-h-screen md:h-dvh'>
        {/* <Diagram /> */}
        <CodeCanvas />
        <motion.div
        onClick={() => setIsActive(!isActive)}
        animate={{
          rotate: isActive ? 180 : 0
        }}
        transition={{
          type: spring,
          damping: 10
        }}
        className='absolute bottom-4 right-5 size-12 p-1 rounded-full text-2xl text-black font-semibold items-center justify-center cursor-pointer hidden md:block'>{`</>`}</motion.div>
      </main>
    </>
  );
}