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
            const { html, metadata } = await markdownParsing.fetchAndParse(markdownPath);

            // Build the full view
            const heroHtml = this.buildHero(metadata);
            const breadcrumbs = this.buildBreadcrumbs(metadata, markdownPath);
            const bodyHtml = `
                <div class="markdown-container" style="max-width: 1000px; margin: 0 auto; padding-bottom: 5rem;">
                    ${breadcrumbs}
                    <div class="markdown-body" style="padding: 0 2rem;">${html}</div>
                </div>
            `;

            this.container.innerHTML = heroHtml + bodyHtml;

            // Line numbers are now handled directly in the renderer in MarkdownParsing.ts

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
            <div class="markdown-breadcrumbs" style="
                padding: 1.5rem 2rem;
                font-size: 0.85rem;
                color: var(--text-secondary);
                font-family: var(--font-heading);
                text-transform: uppercase;
                letter-spacing: 0.1em;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <a href="#" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--accent-blue)'" onmouseout="this.style.color='inherit'">Home</a>
                <span>/</span>
                <span style="background: linear-gradient(to right, var(--accent-blue), var(--accent-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">${category}</span>
                <span>/</span>
                <span style="color: var(--text-primary); opacity: 0.8;">${title}</span>
            </div>
        `;
    }
}
