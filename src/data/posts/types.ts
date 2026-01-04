/**
 * @file types.ts
 * @description TypeScript interfaces for post data types.
 */

export interface DetailSection {
    type: 'hero' | 'text' | 'image' | 'grid';
    content: any;
}

export interface ContentDetailData {
    id: string;
    title: string;
    sourceType?: 'hardcoded' | 'markdown';
    markdownPath?: string;
    sections?: DetailSection[];
}
