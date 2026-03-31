import { elementColors } from '@src/data/config.js';
import type { Pet } from '@src/model/types';
import classNames from 'classnames';
import React from 'react';
import HTML from './HTML.js';

interface Props {
  data: {
    pets: Pet[];
    element: string;
  };
}

function getElements(pet: Pet): string[] {
  return Array.isArray(pet.element) ? pet.element : [pet.element];
}

function getGradient(elems: string[]): string {
  if (elems.length === 1) {
    return elementColors[elems[0]] || '#666';
  }

  return `linear-gradient(135deg, ${elementColors[elems[0]] || '#666'}, ${elementColors[elems[1]] || '#666'})`;
}

const COLS = 5;
const CARD_W = 150;
const GAP = 14;
const PAD = 28;
const TOTAL_W = COLS * CARD_W + (COLS - 1) * GAP + PAD * 2;

export default function PetListCard({ data }: Props) {
  const { pets, element } = data;

  return (
    <HTML style={{ width: `${TOTAL_W}px` }}>
      <div className={classNames('bg-list-bg text-list-cream rounded-card overflow-hidden')}>
        {/* 顶部标题区 */}
        <div className='pt-6 px-7 pb-4 text-center'>
          <div className='inline-block bg-list-bg border-2 border-list-border rounded-lg px-4 py-1 text-[13px] font-bold text-list-cream tracking-widest mb-2.5'>
            洛克王国
          </div>
          <div className='text-4xl font-black text-list-cream tracking-[6px] mb-1' style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
            精灵图鉴
          </div>
          <div className='text-sm text-list-dim'>{element === '全部' ? `全部宠物 · 共 ${pets.length} 只` : `${element}系 · 共 ${pets.length} 只`}</div>
        </div>

        {/* 虚线分隔 */}
        <div className='mx-7 border-t-2 border-dashed border-list-dotted' />

        {/* 宠物网格 */}
        <div className='px-7 pt-[18px] pb-6 flex flex-wrap' style={{ gap: `${GAP}px` }}>
          {pets.map(pet => {
            const elems = getElements(pet);
            const bg = getGradient(elems);

            return (
              <div key={pet.id} className='bg-list-card rounded-xl overflow-hidden shadow-card-md border-2 border-list-tan' style={{ width: `${CARD_W}px` }}>
                {/* 头像区域 */}
                <div className='p-3 flex justify-center items-center' style={{ background: 'linear-gradient(135deg, #D4B896, #F0E6D0)' }}>
                  <div className='rounded-xl p-[3px] shadow-card-sm' style={{ background: bg }}>
                    <img className='w-[100px] h-[100px] rounded-[10px] object-cover bg-white block' src={pet.avatar} alt={pet.name} />
                  </div>
                </div>

                {/* 牛皮纸名牌条 */}
                <div className='bg-list-kraft py-2 px-2.5 text-center border-t-2 border-list-kraft-lt'>
                  <div className='text-base font-black text-white tracking-widest'>{pet.name}</div>
                  <div className='flex gap-1 justify-center mt-1'>
                    {elems.map((e, i) => (
                      <span key={i} className='text-[11px] px-2 py-px rounded-lg text-white font-bold' style={{ background: elementColors[e] || '#888' }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部引用区 */}
        <div className='mx-7 mb-6 border-2 border-dashed border-list-dotted rounded-xl py-3.5 px-5 text-center'>
          <span className='text-[15px] text-list-dim italic tracking-wide'>小洛克，快来收集你的精灵伙伴吧！</span>
        </div>

        {/* 页脚 */}
        <div className='px-7 py-2.5 pb-4 flex justify-between items-center'>
          <span className='text-[13px] font-extrabold text-list-dim tracking-wide'>洛克王国</span>
          <span className='text-[11px] text-white/20'>Powered by alemonjs</span>
        </div>
      </div>
    </HTML>
  );
}
