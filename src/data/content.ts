/**
 * @file content.ts
 * @description Mock CMS data layer.
 * Defines the schema for content items (blogs, videos, etc.) and exports a static array of data.
 * This serves as the single source of truth for the Content Grid.
 */

export type ContentType = 'video' | 'podcast' | 'blog' | 'talk';

export interface ContentItem {
    id: string;
    type: ContentType;
    title: string;
    date: string;
    thumbnail: string; // URL to image
    url: string; // Link to content
    source: string; // e.g. "YouTube", "Medium"
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

export const contentData: ContentItem[] = [
    {
        id: '1',
        type: 'video',
        title: 'Building a 3D Earth in Three.js',
        date: '2025-10-15',
        thumbnail: 'https://images.unsplash.com/photo-1614730341194-75c60740a5d3?auto=format&fit=crop&q=80&w=600',
        url: '#content/1',
        source: 'YouTube'
    },
    {
        id: '2',
        type: 'blog',
        title: 'The Future of WebGL Performance',
        date: '2025-09-28',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
        url: '#content/2',
        source: 'Dev.to'
    },
    {
        id: '3',
        type: 'podcast',
        title: 'Tech Talks: Scaling Node.js',
        date: '2025-09-10',
        thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=600',
        url: '#content/3',
        source: 'Spotify'
    },
    {
        id: '4',
        type: 'talk',
        title: 'React vs Vue: A 2025 Perspective',
        date: '2025-08-05',
        thumbnail: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=600',
        url: '#content/4',
        source: 'Conf 2025'
    },
    {
        id: '5',
        type: 'video',
        title: 'CSS Glassmorphism Tutorial',
        date: '2025-07-20',
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600',
        url: '#content/5',
        source: 'YouTube'
    },
    {
        id: '6',
        type: 'blog',
        title: 'Understanding TypeScript Generics',
        date: '2025-06-15',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600',
        url: '#content/6',
        source: 'Medium'
    }
];
