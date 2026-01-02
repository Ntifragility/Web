/**
 * @file tools.ts
 * @description Mock data for the Tools section.
 */

export type ToolCategory = 'development' | 'design' | 'productivity' | 'learning';

export interface ToolItem {
    id: string;
    category: ToolCategory;
    title: string;
    description: string;
    icon: string; // URL to icon
    url: string;
}

export const toolsData: ToolItem[] = [
    {
        id: '1',
        category: 'development',
        title: 'Three.js',
        description: 'Powerful 3D library for browser-based visualizations.',
        icon: 'https://threejs.org/files/icon.png',
        url: 'https://threejs.org/'
    },
    {
        id: '2',
        category: 'development',
        title: 'TypeScript',
        description: 'Typed superset of JavaScript that scales.',
        icon: 'https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png',
        url: 'https://www.typescriptlang.org/'
    },
    {
        id: '3',
        category: 'design',
        title: 'Figma',
        description: 'The industry-standard for collaborative design.',
        icon: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb49105ed418c63fb57a50ca5e64-1024x1024.png',
        url: 'https://www.figma.com/'
    },
    {
        id: '4',
        category: 'productivity',
        title: 'Notion',
        description: 'All-in-one workspace for notes, tasks, and wikis.',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
        url: 'https://www.notion.so/'
    }
];
