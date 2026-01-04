/**
 * @file content.ts
 * @description Dynamic CMS data layer.
 * Automatically populated from scanned Obsidian vault entries.
 */

import vaultManifest from './vault-manifest.json';

export type ContentType = 'video' | 'podcast' | 'blog' | 'talk';

export interface ContentItem {
    id: string;
    type: ContentType;
    title: string;
    date: string;
    thumbnail: string;
    url: string;
    source: string;
}

export const contentSectionData = {
    title: 'Content',
    filters: [
        { id: 'all', label: 'All' },
        { id: 'video', label: 'Videos' },
        { id: 'podcast', label: 'Podcasts' },
        { id: 'blog', label: 'Articles' },
        { id: 'talk', label: 'Talks' }
    ]
};

// Convert vault manifest entries to ContentItem format
export const contentData: ContentItem[] = vaultManifest.map(entry => ({
    id: entry.id,
    type: 'blog' as ContentType,
    title: entry.title,
    date: entry.date,
    thumbnail: entry.image,
    url: `#content/${entry.id}`,
    source: entry.category
}));
