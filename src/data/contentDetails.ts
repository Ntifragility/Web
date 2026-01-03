/**
 * @file contentDetails.ts
 * @description Detailed data for individual "mock website" pages.
 * Each entry corresponds to a ContentItem's ID.
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

export const contentDetails: Record<string, ContentDetailData> = {
    '1': {
        id: '1',
        title: 'Building a 3D Earth in Three.js',
        sections: [
            {
                type: 'hero',
                content: {
                    title: 'The Journey of a Thousand Vertices',
                    subtitle: 'Mastering the art of WebGL through terrestrial simulation.',
                    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200'
                }
            },
            {
                type: 'text',
                content: 'Developing a high-performance 3D planet requires more than just a sphere and a texture. It involves complex shader math to simulate atmospheric scattering, cloud layers that rotate at different speeds, and optimized geometry to ensure smooth frame rates on mobile devices.'
            },
            {
                type: 'grid',
                content: [
                    { title: 'Optimization', desc: 'Frustum culling and LOD (Level of Detail) systems.' },
                    { title: 'Shaders', desc: 'Custom GLSL code for the blue atmospheric glow.' },
                    { title: 'Textures', desc: '8K displacement maps for realistic mountain ranges.' }
                ]
            }
        ]
    },
    '2': {
        id: '2',
        title: 'The Future of WebGL Performance',
        sections: [
            {
                type: 'hero',
                content: {
                    title: 'Zero Latency Rendering',
                    subtitle: 'Why the next decade of the web is accelerated.',
                    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'
                }
            },
            {
                type: 'text',
                content: 'As WebGPU begins to roll out, the performance gap between native applications and the web is closing. This article explores how parallel computing on the GPU is changing everything from data visualization to video editing in the browser.'
            }
        ]
    },
    '3': {
        id: '3',
        title: 'Tech Talks: Scaling Node.js',
        sections: [
            {
                type: 'hero',
                content: {
                    title: 'Beyond the Event Loop',
                    subtitle: 'Architecture patterns for high-concurrency systems.',
                    bgImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=1200'
                }
            },
            {
                type: 'text',
                content: 'Scaling Node.js is often misunderstood as simply adding more CPU cores. In this talk, we dive into worker threads, microservices orchestration, and the critical importance of a non-blocking I/O strategy when your user base grows from thousands to millions.'
            }
        ]
    },
    '4': {
        id: '4',
        title: 'React vs Vue: A 2025 Perspective',
        sections: [
            {
                type: 'hero',
                content: {
                    title: 'The Framework Wars Reconsidered',
                    subtitle: 'Choosing the right tool for the next era of development.',
                    bgImage: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1200'
                }
            },
            {
                type: 'text',
                content: 'In 2025, the choice between React and Vue is less about syntax and more about ecosystem philosophy. We look at Server Components vs. Composition API and how both have converged on similar performance benchmarks.'
            }
        ]
    },
    '5': {
        id: '5',
        title: 'CSS Glassmorphism Tutorial',
        sections: [
            {
                type: 'hero',
                content: {
                    title: 'Ethereal Interfaces',
                    subtitle: 'A guide to modern transparency and blur effects.',
                    bgImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200'
                }
            },
            {
                type: 'text',
                content: 'Glassmorphism is more than just a `backdrop-filter`. It requires careful attention to border-radius, light-source simulation with gradients, and accessibility considerations to ensure text remains readable over complex backgrounds.'
            }
        ]
    },
    '6': {
        id: '6',
        title: 'Understanding TypeScript Generics',
        sections: [
            {
                type: 'hero',
                content: {
                    title: 'Flexible Typing',
                    subtitle: 'Removing redundancy through abstraction.',
                    bgImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1200'
                }
            },
            {
                type: 'text',
                content: 'The "T" can be intimidating, but generics are the key to building reusable components that don\'t sacrifice type safety. We explore utility types, constraints, and mapped types to level up your TypeScript game.'
            }
        ]
    }
};
