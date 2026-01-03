import { ContentDetailData } from './types';

export const post2: ContentDetailData = {
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
};
