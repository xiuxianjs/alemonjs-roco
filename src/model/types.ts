/** 宠物技能 */
export interface PetSkill {
  name: string;
  element: string;
  type: string;
  cost: number;
  power: number;
  desc: string;
}

/** 宠物特性 */
export interface PetTrait {
  name: string;
  desc: string;
}

/** 宠物数据 */
export interface Pet {
  id: number;
  name: string;
  element: string | string[];
  avatar?: string;
  hp: number;
  atk: number;
  mat: number;
  def: number;
  mdf: number;
  spd: number;
  trait: PetTrait;
  skills: PetSkill[];
}
