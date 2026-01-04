/**
 * @file MarkdownViewer.ts
 * @description Component responsible for rendering parsed Markdown content into the DOM.
 * It acts as the UI orchestration layer that utilizes the 'MarkdownParsing' service
 * to fetch and parse raw markdown files, subsequently handling the domestic rendering 
 * and post-render enhancements like breadcrumbs and code block line numbers.
 */
import { markdownParsing } from '../services/MarkdownParsing';
import 'highlightjs-line-numbers.js';
import '../styles/markdown.css';

export class MarkdownViewer {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    /**
     * Renders a complete markdown document page including hero banner, breadcrumbs, and content.
     * This is the main entry point for displaying markdown files in the application.
     * @param markdownPath - Path to the markdown file to render (e.g., 'ready/guides/setup.md')
     * @returns Promise that resolves when rendering is complete
     */
    public async render(markdownPath: string): Promise<void> {
        this.container.innerHTML = '<div style="padding: 4rem; text-align: center; color: var(--text-secondary);">Loading content...</div>';

        try {
            const { html, metadata, toc } = await markdownParsing.fetchAndParse(markdownPath);

            // Build the full view
            const heroHtml = this.buildHero(metadata);
            const breadcrumbs = this.buildBreadcrumbs(metadata, markdownPath);
            const tocHtml = this.buildToc(toc);

            const bodyHtml = `
                <div class="markdown-layout">
                    <aside class="markdown-sidebar">
                        ${tocHtml}
                    </aside>
                    <main class="markdown-content">
                        <div class="markdown-container">
                            ${breadcrumbs}
                            <div class="markdown-body">${html}</div>
                        </div>
                    </main>
                </div>
            `;

            this.container.innerHTML = heroHtml + bodyHtml;

            // Post-render: Setup Active TOC Highlighting
            this.setupTocHighlighting();

        } catch (err: any) {
            console.error('Markdown Render Error:', err);
            this.container.innerHTML = `
                <div style="padding: 4rem; text-align: center; color: #ff5555;">
                    <h1>Failed to load content</h1>
                    <p>${err.message}</p>
                </div>
            `;
        }
    }

    /**
     * Creates a full-width hero banner (top of the page) for displaying markdown document headers.
     * Features a large background image with overlay, title, subtitle, and optional date.
     * Similar styling to ContentDetail component but generated from markdown metadata.
     * @param metadata - Document metadata containing 'title', 'subtitle', 'image', and 'date' fields
     * @returns HTML string with styled hero section (60vh tall with centered content)
     */
    private buildHero(metadata: Record<string, string>): string {
        const title = metadata.title || 'Untitled';
        const subtitle = metadata.subtitle || '';
        const image = metadata.image || '';
        const date = metadata.date || '';

        // Same styles as ContentDetail but generated from Markdown Metadata
        return `
            <section style="
                height: 60vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                background-image: linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('${image}');
                background-size: cover;
                background-position: center;
                width: 100%;
                margin-bottom: 2rem;
                position: relative;
            ">
                <h1 style="font-size: 4rem; margin-bottom: 1rem; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">${title}</h1>
                <p style="font-size: 1.5rem; opacity: 0.9; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">${subtitle}</p>
                ${date ? `<p style="margin-top: 1rem;  font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${date}</p>` : ''}
            </section>
        `;
    }

    /**
     * Generates an HTML breadcrumb navigation component for every markdown document.
     * Creates a visual path showing: Home / Category / Title
     * @param metadata - Document metadata object that may contain 'category' and 'title' fields
     * @param path - File path of the markdown document (e.g., 'ready/guides/setup.md')
     * @returns HTML string with styled breadcrumb navigation
     */
    private buildBreadcrumbs(metadata: Record<string, string>,
        path: string): string {
        const category = metadata.category || (path.includes('ready/') ? path.split('ready/')[1].split('/')[0] : 'General');
        const title = metadata.title || path.split('/').pop()?.replace('.md', '') || 'Untitled';

        return `
            <div class="markdown-breadcrumbs">
                <a href="#" class="breadcrumb-home">Home</a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-category">${category}</span>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-title">${title}</span>
            </div>
        `;
    }

    /**
     * Builds the Table of Contents sidebar HTML.
     */
    private buildToc(toc: any[]): string {
        if (!toc || toc.length === 0) return '';

        const tocItems = toc.map(item => `
            <div class="toc-item level-${item.level}" data-id="${item.id}">
                <a href="#${item.id}" onclick="event.preventDefault(); document.getElementById('${item.id}').scrollIntoView({behavior: 'smooth'});">
                    ${item.text}
                </a>
            </div>
        `).join('');

        return `
            <div class="toc-container">
                <div class="toc-label">Contents</div>
                <nav class="toc-nav">
                    ${tocItems}
                </nav>
            </div>
        `;
    }

    /**
     * Sets up the Intersection Observer to highlight the active section in the TOC.
     */
    private setupTocHighlighting(): void {
        const headings = Array.from(this.container.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3'));
        const tocItems = Array.from(this.container.querySelectorAll('.toc-item'));

        if (headings.length === 0 || tocItems.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            // Find the heading that is most "active" (intersecting the top area)
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;

                    // Clear all and set the new one
                    tocItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('data-id') === id) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '0px 0px -80% 0px', // Allow detection starting from the very top (0px)
            threshold: 0.1 // Require a tiny bit of the heading to be visible
        });

        headings.forEach(h => observer.observe(h));
    }
}
