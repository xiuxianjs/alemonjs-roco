import React from 'react';

export function DarkContainer({ children, width = 600 }: { children: React.ReactNode; width?: number }) {
  return (
    <div className='bg-base-bg flex flex-col gap-4 p-6 box-border text-white' style={{ width: `${width}px` }}>
      {children}
    </div>
  );
}

export function Section({ title, children, extra }: { title: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className='bg-base-panel rounded-xl border border-base-panel-bd py-4 px-5'>
      <div className='flex items-center mb-3 border-b border-white/5 pb-2.5'>
        <div className='text-lg font-extrabold text-base-green-lt mr-3'>{title}</div>
        <div className='flex-1 h-0.5' style={{ background: 'linear-gradient(90deg, rgba(76,175,80,0.4), transparent)' }} />
        {extra && <div className='ml-2.5 text-[#888] text-sm'>{extra}</div>}
      </div>
      {children}
    </div>
  );
}

export function Footer() {
  return <div className='text-right text-xs text-white/25 py-1'>洛克王国宠物图鉴 · Powered by alemonjs</div>;
}
