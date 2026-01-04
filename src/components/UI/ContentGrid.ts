/**
 * @file ContentGrid.ts
 * @description Grid display for blog posts and projects.
 */
import { contentData, ContentType, contentSectionData } from '@/data/content';

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

        const filterButtons = contentSectionData.filters
            .map(f => this.createFilterButton(f.id as any, f.label))
            .join('');

        header.innerHTML = `
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">${contentSectionData.title}</h2>
            <div id="filter-container" style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                ${filterButtons}
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
            card.className = 'reveal-item';
            card.style.background = '#121212'; // Charcoal off-black
            card.style.borderRadius = '20px'; // Increased for premium feel
            card.style.overflow = 'hidden';
            card.style.cursor = 'pointer';
            card.style.border = '1px solid #1e1e1e'; // Subtle border

            // Sequential Row Stagger:
            // This ensures row N is mostly visible before row N+1 starts.
            const rowIndex = Math.floor(index / 3);
            const colIndex = index % 3;
            const delay = (rowIndex * 0.25) + (colIndex * 0.1);
            card.style.transitionDelay = `${delay}s`;

            card.onclick = () => {
                window.open(item.url, '_blank');
            };

            card.innerHTML = `
                <div class="card-inner" style="padding: 12px; display: flex; flex-direction: column; height: 100%;">
                    <!-- Framed Image Container (Cleaner) -->
                    <div class="card-image-wrap" style="
                        position: relative; 
                        width: 100%; 
                        height: 220px; 
                        border-radius: 12px; 
                        background: #000;
                    ">
                        <img src="${item.thumbnail}" alt="${item.title}" style="
                            width: 100%; 
                            height: 100%; 
                            object-fit: cover;
                            display: block;
                        ">
                    </div>
                    
                    <!-- Details & Metadata (Title First) -->
                    <div style="padding: 1.5rem 0.5rem 0.8rem 0.5rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: flex-start;">
                        <h3 style="
                            font-size: 1.3rem; 
                            line-height: 1.3; 
                            margin: 0 0 0.8rem 0; 
                            color: #fff;
                            font-weight: 700;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        ">
                            ${item.title}
                        </h3>
                        <div style="color: #888; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 0.8rem;">
                            <span>${item.source} &bull; ${this.formatDate(item.date)}</span>
                            <span style="
                                color: var(--accent-blue); 
                                font-size: 0.7rem; 
                                font-weight: 700; 
                                letter-spacing: 0.1em;
                                text-transform: uppercase;">
                                ${item.type}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
            observer.observe(card); // Start observing
        });
    }

    private formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
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
