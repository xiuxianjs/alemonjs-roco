import type { AnnouncementDetail } from '@src/data/announcement.js';
import React from 'react';
interface Props {
    data: {
        detail: AnnouncementDetail;
    };
}
export default function AnnouncementDetailCard({ data }: Props): React.JSX.Element;
export {};
