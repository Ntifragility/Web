/**
 * @file types.ts
 * @description Shared types for content data.
 */

export interface DetailSection {
    type: 'hero' | 'text' | 'image' | 'grid';
    content: any;
}

export interface ContentDetailData {
    id: string;
    title: string;
    sections: DetailSection[];
}
