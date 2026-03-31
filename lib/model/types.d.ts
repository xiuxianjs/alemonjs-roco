export interface PetSkill {
    name: string;
    element: string;
    type: string;
    cost: number;
    power: number;
    desc: string;
}
export interface PetTrait {
    name: string;
    desc: string;
}
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
