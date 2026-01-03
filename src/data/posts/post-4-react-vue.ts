import { ContentDetailData } from './types';

export const post4: ContentDetailData = {
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
};
