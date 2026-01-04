import { marked } from 'marked';
import hljs from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import katex from 'katex';

// Import Styles
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';

// Register Languages
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('dockerfile', dockerfile);

export interface ParsedPost {
    metadata: Record<string, string>;
    html: string;
}

export class MarkdownService {

    constructor() {
        this.configureMarked();
    }

    private configureMarked() {
        // 1. KaTeX Tokenizers (Pre-parsing protection)
        const mathBlock = {
            name: 'math',
            level: 'block',
            start(src: string) { return src.match(/\$\$/)?.index; },
            tokenizer(src: string) {
                const match = /^\$\$([\s\S]*?)\$\$/.exec(src);
                if (match) {
                    return {
                        type: 'math',
                        raw: match[0],
                        text: match[1].trim(),
                        displayMode: true
                    };
                }
                return;
            },
            renderer(token: any) {
                try {
                    return katex.renderToString(token.text, { displayMode: true });
                } catch (err: any) {
                    return `<div style="color:red">${err.message}</div>`;
                }
            }
        };

        const mathInline = {
            name: 'mathInline',
            level: 'inline',
            start(src: string) { return src.match(/\$/)?.index; },
            tokenizer(src: string) {
                const match = /^\$([^$\n]+?)\$/.exec(src);
                if (match) {
                    return {
                        type: 'mathInline',
                        raw: match[0],
                        text: match[1].trim(),
                        displayMode: false
                    };
                }
                return;
            },
            renderer(token: any) {
                try {
                    return katex.renderToString(token.text, { displayMode: false });
                } catch (err: any) {
                    return `<span style="color:red">${err.message}</span>`;
                }
            }
        };

        marked.use({ extensions: [mathBlock as any, mathInline as any] });

        // 2. Custom Renderer (Code Blocks & Images)
        const renderer = new marked.Renderer();

        renderer.code = (code, language) => {
            const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';
            const highlighted = hljs.highlight(code, { language: validLang }).value;

            // We return the structure that supports our "Premium Terminal" look
            return `
                <div class="code-wrapper">
                    <div class="code-header">
                        <span class="lang-badge">${validLang.toUpperCase()}</span>
                        <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText).then(() => { this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000); })">Copy</button>
                    </div>
                    <pre><code class="xml hljs language-${validLang}">${highlighted}</code></pre>
                </div>
            `;
        };

        // Obsidian Image Renderer is handled via Regex Pre-processing, 
        // but standard markdown images should also be caught if needed.
        // For now, we rely on the pre-processing step for ![[wikilinks]].

        marked.setOptions({
            renderer,
            highlight: (code, _lang) => code // We handle highlighting in renderer.code
        });
    }

    public async fetchAndParse(url: string): Promise<ParsedPost> {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch post: ${response.statusText}`);
        const text = await response.text();
        return this.parse(text, url);
    }

    public parse(rawMarkdown: string, url: string = ''): ParsedPost {
        // 1. Front Matter Extraction
        const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = rawMarkdown.match(frontMatterRegex);

        let metadata: Record<string, string> = {};
        let body = rawMarkdown;

        if (match) {
            const yamlBlock = match[1];
            yamlBlock.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts) {
                    metadata[key.trim()] = valueParts.join(':').trim();
                }
            });
            body = rawMarkdown.replace(frontMatterRegex, '').trim();
        }

        // 2. Obsidian Image Pre-processing
        // Transforms ![[image.png | 300x200]] to <img src="..." width="300" />
        body = body.replace(/!\[\[(.*?)(?:\|\s*(.*?))?\]\]/g, (_match, filename, size) => {
            const cleanName = filename.trim();
            // Obsidian sizes can be "300" or "300x200". We take the first part.
            const width = size ? size.split('x')[0].trim() : '';
            const widthAttr = width ? `width="${width}"` : '';

            // 1. If it's already an absolute or external link, use it
            if (cleanName.startsWith('/') || cleanName.startsWith('http')) {
                return `<img src="${cleanName}" ${widthAttr} alt="${cleanName}" />`;
            }

            // 2. Determine base path from the post URL (e.g., /vault-harmonics/)
            const basePath = url.substring(0, url.lastIndexOf('/') + 1);

            // 3. Image Resolution Strategy:
            // Obsidian images can be in the same folder, /img/, or /attachments/
            let filenameEncoded = encodeURIComponent(cleanName);
            let src = `${basePath}${filenameEncoded}`;

            // If we're in a vault junction, apply subfolder heuristics
            if (url.includes('vault/')) {
                // Heuristic: Many Obsidian users (including this one) use an /img/ subfolder
                // for images. We default to checking /img/ if it's not in the root of the folder.
                // In a more complex app, we'd use a fallback <img onerror="...">.

                // For the Harmonics case specifically:
                if (url.includes('NEMA - ARMONICOS')) {
                    src = `${basePath}img/${filenameEncoded}`;
                }
                // We'll keep this heuristic extensible.
            }

            return `<img src="${src}" ${widthAttr} alt="${cleanName}" />`;
        });

        // 3. WikiLink Pre-processing
        // Transforms [[PostID]] to <a href="#content/PostID">PostID</a>
        body = body.replace(/(?<!!)\[\[(.*?)(?:\|\s*(.*?))?\]\]/g, (_match, linkTarget, linkAlias) => {
            const cleanTarget = linkTarget.trim();
            const display = linkAlias ? linkAlias.trim() : cleanTarget;
            return `<a href="#content/${cleanTarget}" class="wiki-link">${display}</a>`;
        });

        // 4. Mark Parsing
        const html = marked.parse(body);

        return { metadata, html };
    }
}

export const markdownService = new MarkdownService();
