import { ContentDetailData } from './types';

export const post1: ContentDetailData = {
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
};
