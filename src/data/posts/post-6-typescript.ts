import { ContentDetailData } from './types';

export const post6: ContentDetailData = {
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
};
