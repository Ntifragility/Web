/**
 * @file index.ts
 * @description Dynamic registry for all content posts.
 * Automatically populated from the auto-scanned vault manifest.
 */

import { ContentDetailData } from './types';
import vaultManifest from '../vault-manifest.json';

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

// Single source of truth for all content details
export const contentDetails: Record<string, ContentDetailData> = vaultPosts;
