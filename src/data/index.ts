import type { Pet } from '@src/model/types';
import { petList1 } from './pets1';
import { petList10 } from './pets10';
import { petList2 } from './pets2';
import { petList3 } from './pets3';
import { petList4 } from './pets4';
import { petList5 } from './pets5';
import { petList6 } from './pets6';
import { petList7 } from './pets7';
import { petList8 } from './pets8';
import { petList9 } from './pets9';

/** 全部宠物列表 */
export const allPets: Pet[] = [
  ...petList1,
  ...petList2,
  ...petList3,
  ...petList4,
  ...petList5,
  ...petList6,
  ...petList7,
  ...petList8,
  ...petList9,
  ...petList10
];

/** 按名称查找宠物 (模糊匹配) */
export function findPetByName(name: string): Pet | undefined {
  const trimmed = name.trim();

  // 精确匹配
  const exact = allPets.find(p => p.name === trimmed);

  if (exact) {
    return exact;
  }

  // 包含匹配
  return allPets.find(p => p.name.includes(trimmed) || trimmed.includes(p.name));
}

/** 按 ID 查找宠物 */
export function findPetById(id: number): Pet | undefined {
  return allPets.find(p => p.id === id);
}

/** 按属性过滤宠物 */
export function filterPetsByElement(element: string): Pet[] {
  return allPets.filter(p => {
    const el = p.element;

    return Array.isArray(el) ? el.includes(element) : el === element;
  });
}

/** 搜索技能 (按名称模糊匹配, 返回宠物+技能) */
export function searchSkill(skillName: string): Array<{ pet: Pet; skill: Pet['skills'][number] }> {
  const results: Array<{ pet: Pet; skill: Pet['skills'][number] }> = [];
  const trimmed = skillName.trim();

  for (const pet of allPets) {
    for (const skill of pet.skills) {
      if (skill.name === trimmed || skill.name.includes(trimmed)) {
        results.push({ pet, skill });
      }
    }
  }

  return results;
}

/** 获取宠物属性列表 (统一为数组) */
export function getPetElements(pet: Pet): string[] {
  return Array.isArray(pet.element) ? pet.element : [pet.element];
}

/** 计算种族值总和 */
export function getTotalStats(pet: Pet): number {
  return pet.hp + pet.atk + pet.mat + pet.def + pet.mdf + pet.spd;
}
