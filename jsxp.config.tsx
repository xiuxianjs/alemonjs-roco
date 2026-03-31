import ActiveDate from '@src/img/views/ActiveDate';
import RocoHelp from '@src/img/views/Help';
import PetDetailCard from '@src/img/views/PetDetailCard';
import PetListCard from '@src/img/views/PetListCard';
import { defineConfig } from 'jsxp';
import React from 'react';

export default defineConfig({
  routes: {
    '/roco-help': {
      component: <RocoHelp />
    },
    '/pet-detail': {
      component: (
        <PetDetailCard
          data={{
            pet: {
              id: 1,
              name: '迪莫',
              element: '光',
              hp: 120,
              atk: 80,
              mat: 80,
              def: 105,
              mdf: 105,
              spd: 92,
              trait: { name: '最好的伙伴', desc: '造成克制伤害后，获得攻防速+20%，并回复2能量。' },
              skills: [
                { name: '猛烈撞击', element: '普通', type: '物攻', cost: 1, power: 60, desc: '对敌方精灵造成物理伤害。' },
                { name: '闪光', element: '光', type: '魔攻', cost: 1, power: 60, desc: '对敌方精灵造成魔法伤害。' },
                { name: '光球', element: '光', type: '魔攻', cost: 2, power: 80, desc: '对敌方精灵造成魔法伤害。' },
                { name: '放晴', element: '光', type: '状态', cost: 0, power: 0, desc: '光系技能威力永久+40%，应对防御：改为永久+80%。' }
              ]
            }
          }}
        />
      )
    },
    '/pet-list': {
      component: (
        <PetListCard
          data={{
            pets: [
              { id: 1, name: '迪莫', element: '光', hp: 120, atk: 80, mat: 80, def: 105, mdf: 105, spd: 92, trait: { name: '最好的伙伴', desc: '' }, skills: [] },
              { id: 2, name: '喵喵', element: '草', hp: 63, atk: 57, mat: 57, def: 56, mdf: 59, spd: 33, trait: { name: '氧循环', desc: '' }, skills: [] },
              { id: 5, name: '火花', element: '火', hp: 65, atk: 64, mat: 58, def: 53, mdf: 55, spd: 60, trait: { name: '烈焰', desc: '' }, skills: [] }
            ],
            element: '全部'
          }}
        />
      )
    },
    '/active-date': {
      component: <ActiveDate />
    }
  }
});
