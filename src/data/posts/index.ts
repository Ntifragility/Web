/**
 * @file index.ts
 * @description Registry for all content posts.
 * Aggregates individual post files into a single lookup object.
 */

import { ContentDetailData } from './types';
import { post1 } from './post-1-earth-3d';
import { post2 } from './post-2-webgl';
import { post3 } from './post-3-nodejs';
import { post4 } from './post-4-react-vue';
import { post5 } from './post-5-glassmorphism';
import { post6 } from './post-6-typescript';

import { post7 } from './post-7-obsidian';
import { post8 } from './post-8-cloud-run';

export const contentDetails: Record<string, ContentDetailData> = {
    [post1.id]: post1,
    [post2.id]: post2,
    [post3.id]: post3,
    [post4.id]: post4,
    [post5.id]: post5,
    [post6.id]: post6,
    [post7.id]: post7,
    [post8.id]: post8,
};
