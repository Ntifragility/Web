/**
 * @file index.ts
 * @description Dynamic registry for all content posts.
 * Merges static posts with auto-scanned vault entries.
 */

import { ContentDetailData } from './types';
import { post1 } from './post-1-earth-3d';
import { post2 } from './post-2-webgl';
import { post3 } from './post-3-nodejs';
import { post4 } from './post-4-react-vue';
import { post5 } from './post-5-glassmorphism';
import { post6 } from './post-6-typescript';
import vaultManifest from '../vault-manifest.json';

// Static posts (non-markdown content with detailed sections)
const staticPosts: Record<string, ContentDetailData> = {
    [post1.id]: post1,
    [post2.id]: post2,
    [post3.id]: post3,
    [post4.id]: post4,
    [post5.id]: post5,
    [post6.id]: post6,
};

// Dynamic vault posts (auto-generated from manifest)
const vaultPosts: Record<string, ContentDetailData> = {};
vaultManifest.forEach(entry => {
    vaultPosts[entry.id] = {
        id: entry.id,
        title: entry.title,
        sourceType: 'markdown',
        markdownPath: entry.markdownPath,
        sections: []
    };
});

// Merge static and vault posts
export const contentDetails: Record<string, ContentDetailData> = {
    ...staticPosts,
    ...vaultPosts
};
