import { elementColors } from '@src/data/config.js';
import type { Pet } from '@src/model/types';
import classNames from 'classnames';
import React from 'react';
import HTML from './HTML.js';

interface Props {
  data: {
    pet: Pet;
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

export default function PetDetailCard({ data }: Props) {
  const { pet } = data;
  const elems = getElements(pet);
  const bg = getGradient(elems);
  const total = pet.hp + pet.atk + pet.mat + pet.def + pet.mdf + pet.spd;

  const stats = [
    { label: '血量', value: pet.hp },
    { label: '攻击', value: pet.atk },
    { label: '魔攻', value: pet.mat },
    { label: '防御', value: pet.def },
    { label: '魔抗', value: pet.mdf },
    { label: '速度', value: pet.spd }
  ];

  return (
    <HTML>
      <div className={classNames('w-[680px] bg-pet-bg rounded-card overflow-hidden text-pet-text')} style={{ border: '1px solid rgba(180,160,130,0.3)' }}>
        {/* 顶部：头像 + 基础信息 */}
        <div className='flex items-start gap-6 p-7 pb-5'>
          {/* 头像 */}
          <div className='rounded-avatar p-1 shadow-avatar shrink-0' style={{ background: bg }}>
            <img className='w-[120px] h-[120px] rounded-[14px] object-cover bg-white block' src={pet.avatar} alt={pet.name} />
          </div>

          {/* 右侧信息 */}
          <div className='flex-1 min-w-0 pt-1'>
            <div className='flex items-baseline gap-2.5'>
              <div className='text-[32px] font-black text-pet-text tracking-wide'>{pet.name}</div>
              <div className='text-sm text-pet-text-dim'>No.{pet.id}</div>
            </div>

            <div className='flex gap-2 mt-2'>
              {elems.map((e, i) => (
                <span
                  key={i}
                  className='inline-flex items-center gap-1 px-3.5 py-1 rounded-[14px] text-[13px] font-bold text-white'
                  style={{ background: elementColors[e] || '#888' }}
                >
                  {e}
                </span>
              ))}
            </div>

            <div className='mt-3.5 bg-pet-panel rounded-[10px] p-2.5 px-3.5' style={{ border: '1px solid rgba(180,160,130,0.3)' }}>
              <div className='text-sm font-bold text-pet-accent'>{pet.trait?.name || '无特性'}</div>
              <div className='text-xs text-pet-text-sec mt-1 leading-relaxed'>{pet.trait?.desc || ''}</div>
            </div>
          </div>
        </div>

        {/* 种族值 */}
        <div className='px-7 pb-5'>
          <div className='flex items-center mb-2.5 gap-2'>
            <div className='text-base font-extrabold text-pet-text'>种族值</div>
            <div className='flex-1 h-px bg-pet-border' />
            <div className='text-xs text-pet-text-dim'>总和 {total}</div>
          </div>

          <div className='grid grid-cols-3 gap-2'>
            {stats.map((stat, i) => (
              <div
                key={i}
                className='bg-pet-stat rounded-[10px] py-2.5 px-3.5 flex justify-between items-center'
                style={{ border: '1px solid rgba(180,160,130,0.3)' }}
              >
                <span className='text-[13px] text-pet-text-sec'>{stat.label}</span>
                <span className='text-lg font-bold text-pet-text'>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 技能 */}
        <div className='px-7 pb-7'>
          <div className='flex items-center mb-2.5 gap-2'>
            <div className='text-base font-extrabold text-pet-text'>技能</div>
            <div className='flex-1 h-px bg-pet-border' />
            <div className='text-xs text-pet-text-dim'>{pet.skills.length} 个技能</div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            {pet.skills.map((s, idx) => (
              <div key={idx} className='bg-pet-skill rounded-[10px] py-2.5 px-3.5 min-w-0' style={{ border: '1px solid rgba(180,160,130,0.3)' }}>
                <div className='flex items-center gap-1.5 mb-1'>
                  <span className='text-sm font-bold text-pet-text'>{s.name}</span>
                  <span className='text-[11px] px-2 py-px rounded-lg text-white' style={{ background: elementColors[s.element] || '#888' }}>
                    {s.element}
                  </span>
                </div>
                {s.desc && <div className='text-[11px] text-pet-text-sec leading-snug mb-1'>{s.desc}</div>}
                <div className='flex gap-2.5 text-[11px] text-pet-text-dim'>
                  <span>{s.type}</span>
                  <span>威力 {s.power}</span>
                  <span>能量 {s.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 页脚 */}
        <div className='px-7 py-2.5 pb-3.5 flex justify-between items-center' style={{ borderTop: '1px solid rgba(180,160,130,0.3)' }}>
          <span className='text-[13px] font-extrabold text-pet-text-dim tracking-wide'>洛克王国</span>
          <span className='text-[11px] text-pet-text-dim'>Powered by alemonjs</span>
        </div>
      </div>
    </HTML>
  );
}
