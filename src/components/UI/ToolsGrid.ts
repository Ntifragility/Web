/**
 * @file ToolsGrid.ts
 * @description Renders a grid of tools with categories and links.
 */

import { toolsData, ToolCategory } from '@/data/tools';

export class ToolsGrid {
    private container: HTMLElement;
    private currentFilter: ToolCategory | 'all' = 'all';

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Element with id ${containerId} not found`);
        this.container = element;
        this.render();
    }

    private render(): void {
        const section = document.createElement('section');
        section.id = 'tools';
        section.style.minHeight = '100vh';
        section.style.padding = 'var(--section-spacing) 2rem';
        section.style.maxWidth = 'var(--container-width)';
        section.style.margin = '0 auto';

        // 1. Header & Filters
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '3rem';
        header.innerHTML = `
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">Tools</h2>
            <div id="tool-filter-container" style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                ${this.createFilterButton('all', 'All')}
                ${this.createFilterButton('development', 'Development')}
                ${this.createFilterButton('design', 'Design')}
                ${this.createFilterButton('productivity', 'Productivity')}
            </div>
        `;

        // 2. Grid Container
        const grid = document.createElement('div');
        grid.id = 'tools-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        grid.style.gap = '2rem';

        section.appendChild(header);
        section.appendChild(grid);
        this.container.appendChild(section);

        this.renderItems(grid);
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
        return `<button data-filter="${type}" class="tool-filter-btn" style="${style}">${label}</button>`;
    }

    private renderItems(grid: HTMLElement): void {
        grid.innerHTML = '';
        const filtered = this.currentFilter === 'all'
            ? toolsData
            : toolsData.filter(item => item.category === this.currentFilter);

        // Observer for scroll reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        filtered.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'glass reveal-item'; // Added reveal-item
            card.style.borderRadius = '15px';
            card.style.padding = '2rem';
            card.style.textAlign = 'center';
            card.style.cursor = 'pointer';

            // Sequential Row Stagger:
            // This ensures row N is mostly visible before row N+1 starts.
            const rowIndex = Math.floor(index / 3);
            const colIndex = index % 3;
            const delay = (rowIndex * 0.6) + (colIndex * 0.15);
            card.style.transitionDelay = `${delay}s`;

            card.innerHTML = `
                <div class="card-inner">
                    <img src="${item.icon}" alt="${item.title}" style="width: 64px; height: 64px; margin-bottom: 1.5rem; border-radius: 12px;">
                    <h3 style="margin-bottom: 0.5rem;">${item.title}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">${item.description}</p>
                </div>
            `;

            card.onclick = () => window.open(item.url, '_blank');
            grid.appendChild(card);
            observer.observe(card); // Start observing
        });
    }

    private bindEvents(section: HTMLElement): void {
        const buttons = section.querySelectorAll('.tool-filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const type = target.dataset.filter as ToolCategory | 'all';
                this.currentFilter = type;

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

                const grid = section.querySelector('#tools-grid') as HTMLElement;
                this.renderItems(grid);
            });
        });
    }
}
