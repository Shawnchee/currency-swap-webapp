'use client';

import { Suspense } from 'react';
import { SwapWidget } from '@/components/SwapWidget';
import { RatesTable } from '@/components/RatesTable';
import { SwapWidgetLoader } from '@/components/SwapWidgetLoader';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-1 flex flex-col items-center pt-16 md:pt-24 px-4 z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
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
        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-50">
          Currency Exchange Platform
        </p>
      </footer>
    </div>
  );
}
