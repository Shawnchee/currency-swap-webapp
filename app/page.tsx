'use client';

import { Suspense } from 'react';
import { SwapWidget } from '@/components/SwapWidget';
import { RatesTable } from '@/components/RatesTable';
import { SwapWidgetLoader } from '@/components/SwapWidgetLoader';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0E14] relative overflow-hidden flex flex-col font-sans selection:bg-[#C7F284] selection:text-[#0D0E14]">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C7F284]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-[#9945FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-1 flex flex-col items-center pt-16 md:pt-24 px-4 z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#E2E8F0] tracking-tight leading-[1.1]">
            Swap Your Currency
          </h1>
        </div>

        <Suspense fallback={<SwapWidgetLoader />}>
          <SwapWidget />
        </Suspense>

        <div className="mt-8 w-full flex justify-center">
          <RatesTable />
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-[#9CA3AF] text-[10px] font-bold tracking-widest uppercase opacity-50">
          Currency Exchange Platform
        </p>
      </footer>
    </div>
  );
}
