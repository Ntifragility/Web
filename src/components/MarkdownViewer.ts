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
            const tocHtml = this.buildToc(toc);
            const title = metadata.title || 'Untitled';
            const stickyNavHtml = this.buildStickyNav(title);

            const bodyHtml = `
                ${stickyNavHtml}
                <div class="markdown-layout">
                    <div class="markdown-sidebar-container">
                        <aside class="markdown-sidebar">
                            ${tocHtml}
                        </aside>
                    </div>
                    <main class="markdown-content">
                        <div class="markdown-container">
                            <div class="static-breadcrumbs">${this.buildBreadcrumbs(metadata, markdownPath)}</div>
                            <div class="markdown-body">${html}</div>
                        </div>
                    </main>
                </div>
            `;

            this.container.innerHTML = heroHtml + bodyHtml;

            // Post-render: Initialize interactive features
            this.setupTocHighlighting();
            this.setupStickyHeader();

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

        return `
            <section id="markdown-hero" style="
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
     * Builds the persistent navigation bar with a centered title.
     */
    private buildStickyNav(title: string): string {
        return `
            <div id="sticky-nav-header" class="sticky-nav-header">
                <div class="sticky-nav-content">
                    <div class="sticky-nav-left"></div>
                    <div class="sticky-nav-title">${title}</div>
                    <div class="sticky-nav-right"></div>
                </div>
            </div>
        `;
    }

    /**
     * Sets up the observer to show/hide the sticky header.
     */
    private setupStickyHeader(): void {
        const hero = this.container.querySelector('#markdown-hero');
        const stickyNav = this.container.querySelector('#sticky-nav-header');

        if (!hero || !stickyNav) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When hero is NOT intersecting (gone from top), make nav sticky
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    stickyNav.classList.add('is-sticky');
                } else {
                    stickyNav.classList.remove('is-sticky');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '-80px 0px 0px 0px'
        });

        observer.observe(hero);
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
            rootMargin: '0px 0px -80% 0px',
            threshold: 0.1
        });

        headings.forEach(h => observer.observe(h));
    }
}
