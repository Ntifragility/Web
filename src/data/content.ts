/**
 * @file content.ts
 * @description Dynamic CMS data layer.
 * Automatically populated from scanned Obsidian vault entries.
 * 
 * Link generation for each Obsidian/Vault/ready
 */

import vaultManifest from './vault-manifest.json';

export type ContentType = 'video' | 'podcast' | 'blog' | 'talk';

/**
 * Content item interface representing a piece of media content (video, podcast, article, etc.)
 * Used throughout the application to display content cards in grids and lists.
 */
export interface ContentItem {
    id: string;
    type: ContentType;
    title: string;
    date: string;
    thumbnail: string;
    url: string;
    source: string;
}

/**
 * Configuration data for the content section component.
 * Defines the section title and available filter options for content types.
 */
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

/**
 * Main content data array generated from the vault manifest.
 * Transforms vault markdown entries into ContentItem format for display.
 * Each entry becomes a clickable content card linking to its detail page.
 * Convert vault manifest entries to ContentItem format
 */

export const contentData: ContentItem[] = vaultManifest.map(entry => ({
    id: entry.id,
    type: 'blog' as ContentType,
    title: entry.title,
    date: entry.date,
    thumbnail: entry.image,
    url: `#content/${entry.id}`, // link generation for each Obsidian/Vault/ready
    source: entry.category
}));
