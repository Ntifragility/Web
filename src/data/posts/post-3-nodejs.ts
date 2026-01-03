import { ContentDetailData } from './types';

export const post3: ContentDetailData = {
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
};
