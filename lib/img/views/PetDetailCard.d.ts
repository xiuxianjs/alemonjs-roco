import type { Pet } from '@src/model/types';
import React from 'react';
interface Props {
    data: {
        pet: Pet;
    };
}
export default function PetDetailCard({ data }: Props): React.JSX.Element;
export {};
