import type { Pet } from '@src/model/types';
import React from 'react';
interface Props {
    data: {
        pets: Pet[];
        element: string;
    };
}
export default function PetListCard({ data }: Props): React.JSX.Element;
export {};
