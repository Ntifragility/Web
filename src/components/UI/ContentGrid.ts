/**
 * @file ContentGrid.ts
 * @description Renders the grid of content items (videos, blogs, etc.) with filtering capabilities.
 * Fetches data from the content layer and creates interactive cards.
 */

import { contentData, ContentType } from '@/data/content';

export class ContentGrid {
    private container: HTMLElement;
    private currentFilter: ContentType | 'all' = 'all';

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Element with id ${containerId} not found`);
        this.container = element;
        this.render();
    }

    private render(): void {
        const section = document.createElement('section');
        section.id = 'content';
        section.style.minHeight = '100vh';
        section.style.padding = 'var(--section-spacing) 2rem';
        section.style.maxWidth = 'var(--container-width)';
        section.style.margin = '0 auto';

        // 1. Header & Filters
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '3rem';
        header.innerHTML = `
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">Latest Content</h2>
            <div id="filter-container" style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                ${this.createFilterButton('all', 'All')}
                ${this.createFilterButton('video', 'Videos')}
                ${this.createFilterButton('podcast', 'Podcasts')}
                ${this.createFilterButton('blog', 'Articles')}
                ${this.createFilterButton('talk', 'Talks')}
            </div>
        `;

        // 2. Grid Container
        const grid = document.createElement('div');
        grid.id = 'content-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        grid.style.gap = '2rem';

        section.appendChild(header);
        section.appendChild(grid);
        this.container.appendChild(section);

        // 3. Initial Render of Items
        this.renderItems(grid);

        // 4. Bind Events
        this.bindEvents(section);
    }

    private createFilterButton(type: string, label: string): string {
        const isActive = this.currentFilter === type;
        const style = `
            padding: 0.5rem 1.5rem;
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            background: ${isActive ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)'};
            color: ${isActive ? '#000' : 'var(--text-primary)'};
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        `;
        return `<button data-filter="${type}" class="filter-btn" style="${style}">${label}</button>`;
    }

    private renderItems(grid: HTMLElement): void {
        grid.innerHTML = ''; // Clear existing
        const filtered = this.currentFilter === 'all'
            ? contentData
            : contentData.filter(item => item.type === this.currentFilter);

        filtered.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'glass';
            card.style.borderRadius = '15px';
            card.style.overflow = 'hidden';
            card.style.transition = 'transform 0.3s ease';
            card.style.cursor = 'pointer';
            card.style.opacity = '0';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;

            // Hover effect logic needed in CSS or JS events, using inline styles for now
            card.onmouseenter = () => card.style.transform = 'translateY(-10px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';

            card.innerHTML = `
                <div style="height: 200px; background-image: url('${item.thumbnail}'); background-size: cover; background-position: center; position: relative;">
                    <div style="
                        position: absolute; 
                        top: 10px; 
                        right: 10px; 
                        background: rgba(0,0,0,0.7); 
                        padding: 0.2rem 0.5rem; 
                        border-radius: 5px; 
                        font-size: 0.7rem; 
                        text-transform: uppercase;">
                        ${item.type}
                    </div>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="color: var(--accent-purple); font-size: 0.8rem; margin-bottom: 0.5rem;">${item.source} &bull; ${item.date}</div>
                    <h3 style="font-size: 1.2rem; line-height: 1.4; margin-bottom: 1rem;">${item.title}</h3>
                </div>
            `;
            grid.appendChild(card);
        });

        // Add Keyframe if not exists (hacky but works for this scope)
        if (!document.getElementById('anim-style')) {
            const style = document.createElement('style');
            style.id = 'anim-style';
            style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
            document.head.appendChild(style);
        }
    }

    private bindEvents(section: HTMLElement): void {
        const buttons = section.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const type = target.dataset.filter as ContentType | 'all';
                this.currentFilter = type;

                // Update UI of buttons
                buttons.forEach(b => {
                    const el = b as HTMLElement;
                    if (el.dataset.filter === type) {
                        el.style.background = 'var(--accent-blue)';
                        el.style.color = '#000';
                    } else {
                        el.style.background = 'rgba(255,255,255,0.05)';
                        el.style.color = 'var(--text-primary)';
                    }
                });

                // Re-render grid
                const grid = section.querySelector('#content-grid') as HTMLElement;
                this.renderItems(grid);
            });
        });
    }
}
