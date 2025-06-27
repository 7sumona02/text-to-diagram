'use client'
import CodeCanvas from '@/components/CodeCanvas';

export default function Home() {
  return (
    <>
      <main className='relative select-none min-h-screen md:h-dvh'>
        {/* <Diagram /> */}
        <CodeCanvas />
      </main>
    </>
  );
}