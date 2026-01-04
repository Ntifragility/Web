/**
 * @file ContentDetail.ts
 * @description Detailed view component for individual post content.
 */

import { contentDetails } from '@/data/posts';
import { MarkdownViewer } from '../MarkdownViewer';

export class ContentDetail {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Element with id ${containerId} not found`);
        this.container = element;
    }

    public render(id: string): void {
        const data = contentDetails[id];
        if (!data) {
            this.container.innerHTML = '<h1>Content Not Found</h1>';
            return;
        }

        // Create the detail page structure
        const detailView = document.createElement('div');
        detailView.className = 'content-detail-view';
        detailView.style.position = 'fixed';
        detailView.style.top = '0';
        detailView.style.left = '0';
        detailView.style.width = '100vw';
        detailView.style.height = '100vh';
        detailView.style.backgroundColor = '#0a0a0a';
        detailView.style.color = '#fff';
        detailView.style.zIndex = '2000';
        detailView.style.overflowY = 'auto';
        detailView.style.padding = '0';

        // 1. Back Button
        const backBtn = document.createElement('button');
        backBtn.innerHTML = '← Back to Home';
        backBtn.style.position = 'fixed';
        backBtn.style.top = '2rem';
        backBtn.style.left = '2rem';
        backBtn.style.zIndex = '10';
        backBtn.style.padding = '0.8rem 1.5rem';
        backBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        backBtn.style.border = '1px solid rgba(255,255,255,0.2)';
        backBtn.style.color = '#fff';
        backBtn.style.borderRadius = '30px';
        backBtn.style.cursor = 'pointer';
        backBtn.style.backdropFilter = 'blur(10px)';
        backBtn.onclick = () => { window.location.hash = ''; };

        detailView.appendChild(backBtn);

        // --- MARKDOWN BRANCH ---
        if (data.sourceType === 'markdown' && data.markdownPath) {
            const contentArea = document.createElement('div');
            // Add base styles if needed
            detailView.appendChild(contentArea);

            this.container.innerHTML = '';
            this.container.appendChild(detailView);

            const viewer = new MarkdownViewer(contentArea);
            viewer.render(data.markdownPath);
            return;
        }

        // --- STANDARD BRANCH ---
        // 2. Render Sections
        const contentArea = document.createElement('div');

        if (data.sections) {
            data.sections.forEach(section => {
                const sectionEl = document.createElement('section');
                sectionEl.style.padding = '4rem 2rem';
                sectionEl.style.maxWidth = '1000px';
                sectionEl.style.margin = '0 auto';

                if (section.type === 'hero') {
                    sectionEl.style.height = '70vh';
                    sectionEl.style.display = 'flex';
                    sectionEl.style.flexDirection = 'column';
                    sectionEl.style.justifyContent = 'center';
                    sectionEl.style.alignItems = 'center';
                    sectionEl.style.textAlign = 'center';
                    sectionEl.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${section.content.bgImage})`;
                    sectionEl.style.backgroundSize = 'cover';
                    sectionEl.style.backgroundPosition = 'center';
                    sectionEl.style.width = '100%';
                    sectionEl.style.maxWidth = 'none';

                    sectionEl.innerHTML = `
                        <h1 style="font-size: 4rem; margin-bottom: 1rem;">${section.content.title}</h1>
                        <p style="font-size: 1.5rem; opacity: 0.8;">${section.content.subtitle}</p>
                    `;
                } else if (section.type === 'text') {
                    sectionEl.innerHTML = `
                        <p style="font-size: 1.25rem; line-height: 1.8; color: #ccc;">${section.content}</p>
                    `;
                } else if (section.type === 'grid') {
                    const grid = document.createElement('div');
                    grid.style.display = 'grid';
                    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
                    grid.style.gap = '2rem';
                    grid.style.marginTop = '2rem';

                    section.content.forEach((item: any) => {
                        grid.innerHTML += `
                            <div style="padding: 2rem; background: #121212; border: 1px solid #1e1e1e; border-radius: 12px;">
                                <h3 style="margin-bottom: 1rem; color: var(--accent-blue);">${item.title}</h3>
                                <p style="opacity: 0.7; font-size: 0.95rem;">${item.desc}</p>
                            </div>
                        `;
                    });
                    sectionEl.appendChild(grid);
                }

                contentArea.appendChild(sectionEl);
            });
        }

        detailView.appendChild(contentArea);

        // Finalize
        this.container.innerHTML = '';
        this.container.appendChild(detailView);
    }

    public hide(): void {
        this.container.innerHTML = '';
    }
}
