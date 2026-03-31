import type { Pet } from '@src/model/types';
export declare const allPets: Pet[];
export declare function findPetByName(name: string): Pet | undefined;
export declare function findPetById(id: number): Pet | undefined;
export declare function filterPetsByElement(element: string): Pet[];
export declare function searchSkill(skillName: string): Array<{
    pet: Pet;
    skill: Pet['skills'][number];
}>;
export declare function getPetElements(pet: Pet): string[];
export declare function getTotalStats(pet: Pet): number;
