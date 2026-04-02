export interface AnnouncementItem {
    id: number;
    title: string;
    date: string;
    category: '最新' | '公告' | '资讯' | '活动';
}
export interface AnnouncementDetail {
    id: number;
    title: string;
    date: string;
    author: string;
    content: string;
    coverUrl: string;
    tagIds: string;
}
export declare const CATEGORY_TAG_MAP: Record<string, string>;
export declare function fetchAnnouncements(tagId?: string, page?: number, pageSize?: number): Promise<{
    items: AnnouncementItem[];
    total: number;
    totalPages: number;
}>;
export declare function fetchAnnouncementDetail(id: number): Promise<AnnouncementDetail>;
