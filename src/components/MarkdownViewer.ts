/**
 * @file MarkdownViewer.ts
 * @description Component responsible for rendering parsed Markdown content into the DOM.
 * It acts as the UI orchestration layer that utilizes the 'MarkdownParsing' service
 * to fetch and parse raw markdown files, subsequently handling the domestic rendering 
 * and post-render enhancements like breadcrumbs and code block line numbers.
 */
import { markdownParsing } from '../services/MarkdownParsing';
import { PlotMathEngine } from '../services/PlotMathEngine';
import 'highlightjs-line-numbers.js';
import '../styles/markdown.css';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
                <button id="sidebar-toggle" class="sidebar-toggle" aria-label="Toggle Table of Contents">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                </button>
                <div class="markdown-layout">
                    <div id="sidebar-container" class="markdown-sidebar-container">
                        <div class="sidebar-header-mobile">
                            <span>Contents</span>
                            <button id="sidebar-close" class="sidebar-close">&times;</button>
                        </div>
                        <aside class="markdown-sidebar">
                            ${tocHtml}
                        </aside>
                    </div>
                    <div id="sidebar-overlay" class="sidebar-overlay"></div>
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
            this.setupMobileToggles();
            this.renderCharts();
            this.renderDynamicCharts();

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
            <section id="markdown-hero" class="markdown-hero" style="background-image: linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('${image}');">
                <h1 class="markdown-hero-title">${title}</h1>
                <p class="markdown-hero-subtitle">${subtitle}</p>
                ${date ? `<p class="markdown-hero-date">${date}</p>` : ''}
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
     * Sets up the observer to show/hide the sticky header and sidebar toggle.
     */
    private setupStickyHeader(): void {
        const hero = this.container.querySelector('#markdown-hero');
        const stickyNav = this.container.querySelector('#sticky-nav-header');
        const sidebarToggle = this.container.querySelector('#sidebar-toggle') as HTMLElement;

        if (!hero || !stickyNav) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When hero is NOT intersecting (gone from top), make nav sticky and show toggle
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    stickyNav.classList.add('is-sticky');
                    if (sidebarToggle) {
                        sidebarToggle.classList.add('is-visible');
                    }
                } else {
                    stickyNav.classList.remove('is-sticky');
                    if (sidebarToggle) {
                        sidebarToggle.classList.remove('is-visible');
                    }
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

    /**
     * Sets up click listeners for the mobile sidebar toggle and close actions.
     */
    private setupMobileToggles(): void {
        const toggleBtn = this.container.querySelector('#sidebar-toggle');
        const closeBtn = this.container.querySelector('#sidebar-close');
        const overlay = this.container.querySelector('#sidebar-overlay') as HTMLElement;
        const sidebar = this.container.querySelector('#sidebar-container') as HTMLElement;
        const tocLinks = this.container.querySelectorAll('.toc-item a');

        if (!toggleBtn || !sidebar || !overlay) return;

        const toggle = () => {
            sidebar.classList.toggle('is-mobile-open');
            overlay.classList.toggle('is-visible');
            document.body.style.overflow = sidebar.classList.contains('is-mobile-open') ? 'hidden' : '';
        };

        const close = () => {
            sidebar.classList.remove('is-mobile-open');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        };

        toggleBtn.addEventListener('click', toggle);
        if (closeBtn) closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', close);

        // Close sidebar when a TOC link is clicked (on mobile)
        tocLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1100) {
                    close();
                }
            });
        });

        // Swipe/Drag to close (swipe left) OR open (edge swipe right)
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let isOpening = false;
        const dragThreshold = 50;
        const edgeThreshold = 30; // Px from left edge to start swipe-open

        const startDrag = (x: number, isSidebarEvent: boolean) => {
            const isOpen = sidebar.classList.contains('is-mobile-open');

            if (isOpen && isSidebarEvent) {
                // Start closing drag
                isOpening = false;
                startX = x;
                isDragging = true;
                sidebar.style.transition = 'none';
            } else if (!isOpen && x <= edgeThreshold) {
                // Start opening drag (from edge)
                isOpening = true;
                startX = x;
                isDragging = true;
                sidebar.style.transition = 'none';

                // Prepare visuals for opening
                sidebar.style.visibility = 'visible';
                overlay.classList.add('is-visible'); // Show overlay container
                overlay.style.opacity = '0'; // Start invisible
            }
        };

        const moveDrag = (x: number) => {
            if (!isDragging) return;
            currentX = x;
            const resistance = 0.5;

            if (isOpening) {
                const deltaX = Math.max(0, currentX - startX); // Only drag right
                sidebar.style.transform = `translateX(${deltaX * resistance}px)`;

                // Fade in overlay
                const opacity = Math.min(1, (deltaX * resistance) / 200);
                overlay.style.opacity = opacity.toString();
            } else {
                // Closing dragging
                const deltaX = Math.min(0, currentX - startX); // Only drag left
                sidebar.style.transform = `translateX(calc(100% + ${deltaX * resistance}px))`;
            }
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            const deltaX = currentX - startX;

            // Clean up inline styles
            sidebar.style.transition = '';
            sidebar.style.transform = '';
            sidebar.style.visibility = '';
            overlay.style.opacity = '';

            if (isOpening) {
                if (deltaX * 0.5 > dragThreshold) {
                    // Complete opening
                    sidebar.classList.add('is-mobile-open');
                    overlay.classList.add('is-visible');
                    document.body.style.overflow = 'hidden';
                } else {
                    // Cancel opening
                    overlay.classList.remove('is-visible');
                }
            } else {
                // Closing
                if (deltaX < -dragThreshold) {
                    close();
                } else {
                    // Cancel closing (snap back)
                    // Nothing to do, classes remain
                }
            }
        };

        // Touch events
        sidebar.addEventListener('touchstart', (e: TouchEvent) => startDrag(e.touches[0].clientX, true), { passive: true });
        window.addEventListener('touchstart', (e: TouchEvent) => {
            // Only trigger window touch if not touching sidebar (handled above) 
            // OR if sidebar is closed (handled here for edge swipe)
            if (!sidebar.contains(e.target as Node)) {
                startDrag(e.touches[0].clientX, false);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e: TouchEvent) => moveDrag(e.touches[0].clientX), { passive: false } as EventListenerOptions);
        window.addEventListener('touchend', endDrag);

        // Mouse events (for desktop testing)
        sidebar.addEventListener('mousedown', (e: MouseEvent) => startDrag(e.clientX, true));
        window.addEventListener('mousedown', (e: MouseEvent) => {
            if (!sidebar.contains(e.target as Node)) {
                startDrag(e.clientX, false);
            }
        });
        window.addEventListener('mousemove', (e: MouseEvent) => moveDrag(e.clientX));
        window.addEventListener('mouseup', endDrag);
    }

    /**
     * Initializes any Chart.js charts found in the rendered markdown.
     */
    private renderCharts(): void {
        const canvases = this.container.querySelectorAll('canvas[data-chart]');
        canvases.forEach((canvas) => {
            const ctx = (canvas as HTMLCanvasElement).getContext('2d');
            const dataChart = canvas.getAttribute('data-chart');
            if (ctx && dataChart) {
                try {
                    // Unescape JSON
                    const configStr = dataChart.replace(/&quot;/g, '"');
                    const config = JSON.parse(configStr);

                    new Chart(ctx, config);
                } catch (err) {
                    console.error('Failed to render chart:', err);
                    const errorMsg = document.createElement('div');
                    errorMsg.style.color = 'red';
                    errorMsg.textContent = `Chart Error: ${err}`;
                    canvas.replaceWith(errorMsg);
                }
            }
        });
    }

    /**
     * Initializes Interactive Parametric Charts (Sliders) found in the rendered markdown.
     * This method "hydrates" the static HTML placeholders with real-time logic.
     */
    private renderDynamicCharts(): void {
        const containers = this.container.querySelectorAll('.dynamic-chart-wrapper');

        containers.forEach((container) => {
            const encodedData = container.getAttribute('data-code');
            const type = container.getAttribute('data-type') || 'dynamic';
            if (!encodedData) return;

            try {
                const rawData = decodeURIComponent(escape(atob(encodedData)));
                let setup: any;

                if (type === 'blueprint') {
                    setup = PlotMathEngine.parseBlueprint(rawData);
                } else {
                    const setupFn = new Function(rawData);
                    setup = setupFn();
                }

                if (!setup || typeof setup !== 'object') {
                    throw new Error('Dynamic chart script must return an object structure.');
                }

                /** 
                 * 3. BUILDING THE UI SCAFFOLDING
                 * Construct the 2-column layout: Visual Chart on the left, Control Panel on the right.
                 */
                container.innerHTML = `
                    <div class="dynamic-chart-canvas-container">
                        <canvas id="canvas-${container.id}"></canvas>
                    </div>
                    <div class="dynamic-chart-controls">
                        <h4>${setup.title || 'Parameters'}</h4>
                        <div class="sliders-list"></div>
                    </div>
                `;

                const canvas = container.querySelector('canvas') as HTMLCanvasElement;
                const slidersList = container.querySelector('.sliders-list') as HTMLElement;
                const ctx = canvas.getContext('2d')!;

                /** 
                 * 4. MANAGING PARAMETER STATE
                 * Extract initial values to create the current 'live' state object.
                 */
                const params: Record<string, number> = {};
                for (const key in setup.parameters) {
                    params[key] = setup.parameters[key].value;
                }

                /** 
                 * 5. GENERATING SLIDERS (The Factory)
                 * Loop through user-defined parameters to build interactive HTML sliders.
                 */
                for (const key in setup.parameters) {
                    const p = setup.parameters[key];
                    const sliderId = `slider-${container.id}-${key}`;
                    const valueId = `value-${container.id}-${key}`;

                    const sliderGroup = document.createElement('div');
                    sliderGroup.className = 'dynamic-chart-slider-group';
                    sliderGroup.innerHTML = `
                        <div class="dynamic-chart-label-row">
                            <span class="dynamic-chart-label">${p.label || key}</span>
                            <span class="dynamic-chart-value" id="${valueId}">${p.value}</span>
                        </div>
                        <input type="range" class="dynamic-chart-slider" id="${sliderId}" 
                            min="${p.min}" max="${p.max}" step="${p.step || 1}" value="${p.value}">
                    `;

                    const input = sliderGroup.querySelector('input')!;
                    const valueSpan = sliderGroup.querySelector(`#${valueId}`)!;

                    // WIRING: The event listener that bridges HTML controls and JS logic
                    input.addEventListener('input', () => {
                        const newVal = parseFloat(input.value);
                        params[key] = newVal;
                        valueSpan.textContent = newVal.toString();

                        // Execute user-defined update logic
                        if (setup.update) {
                            // High-performance update (modifying existing chart data)
                            setup.update(chart, params);
                        } else {
                            // Standard blueprint auto-update
                            const newConfig = setup.init(params);
                            chart.data = newConfig.data;
                            chart.update('none'); // Update without flickering transition
                        }
                    });

                    slidersList.appendChild(sliderGroup);
                }

                /** 
                 * 6. INITIALIZING CHART.JS
                 * Build the initial chart instance using the user's 'init' logic.
                 */
                const chartConfig = setup.init(params);

                // Ensure responsiveness is ON and animations are optimized for real-time dragging
                if (chartConfig.options) {
                    chartConfig.options.responsive = true;
                    chartConfig.options.maintainAspectRatio = false;
                }

                const chart = new Chart(ctx, chartConfig);

                /**
                 * 7. WINDOW RESIZE HANDLING
                 * Ensure the chart expands/shrinks if the user resizes their browser.
                 */
                const resizeHandler = () => chart.resize();
                window.addEventListener('resize', resizeHandler);

                // Cleanup: Stop observing if the container is removed (prevent memory leaks)
                const observer = new MutationObserver(() => {
                    if (!document.body.contains(container)) {
                        window.removeEventListener('resize', resizeHandler);
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });

            } catch (err) {
                console.error('Plot Runtime Error:', err);
                container.innerHTML = `
                    <div class="dynamic-chart-error" style="background: rgba(255,50,50,0.1); border: 1px dashed rgba(255,50,50,0.3); border-radius: 12px; padding: 1.5rem; text-align: center; color: #ff5555; font-family: 'JetBrains Mono'; margin: 1rem 0;">
                        <strong style="font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Simulation Error</strong>
                        <span style="font-size: 0.9rem; opacity: 0.8;">${(err as Error).message}</span>
                    </div>
                `;
            }
        });
    }
}
