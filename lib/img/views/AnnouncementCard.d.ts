import type { AnnouncementItem } from '@src/data/announcement.js';
import React from 'react';
interface Props {
    data: {
        announcements: AnnouncementItem[];
        activeTab?: string;
        page?: number;
        totalPages?: number;
    };
}
export default function AnnouncementCard({ data }: Props): React.JSX.Element;
export {};
