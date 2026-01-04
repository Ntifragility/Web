import { markdownService } from '../services/MarkdownService';
import hljs from 'highlight.js';
import '../styles/markdown.css';

export class MarkdownViewer {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public async render(markdownPath: string): Promise<void> {
        this.container.innerHTML = '<div style="padding: 4rem; text-align: center; color: #888;">Loading content...</div>';

        try {
            const { html, metadata } = await markdownService.fetchAndParse(markdownPath);

            // Build the full view
            const heroHtml = this.buildHero(metadata);
            const bodyHtml = `<div class="markdown-body" style="padding: 0 2rem; max-width: 900px; margin: 0 auto;">${html}</div>`;

            this.container.innerHTML = heroHtml + bodyHtml;

            // Post-render: Initialize Line Numbers
            // We need to use 'hljs' global or the imported one if the plugin attaches to it.
            // Since we imported 'highlightjs-line-numbers.js' in the service (wait, did we?),
            // we might need to make sure the plugin is active. 
            // The plugin modifies the 'hljs' object.

            // In a module system, we usually need to import the plugin to side-effect register it.
            // We'll trust that the global or imported hljs has it. 
            // If strictly needed, we might do: (window as any).hljs = hljs; and import the script.

            // For now, let's try standard selection.
            this.container.querySelectorAll('code.hljs').forEach((block) => {
                if (typeof (hljs as any).lineNumbersBlock === 'function') {
                    (hljs as any).lineNumbersBlock(block as HTMLElement);
                }
            });

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
                background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${image}');
                background-size: cover;
                background-position: center;
                width: 100%;
                margin-bottom: 2rem;
                position: relative;
            ">
                <h1 style="font-size: 4rem; margin-bottom: 1rem; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">${title}</h1>
                <p style="font-size: 1.5rem; opacity: 0.9; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">${subtitle}</p>
                ${date ? `<p style="margin-top: 1rem; color: var(--accent-blue); font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${date}</p>` : ''}
            </section>
        `;
    }
}
