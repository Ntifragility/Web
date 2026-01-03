import { ContentDetailData } from './types';

export const post5: ContentDetailData = {
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
};
