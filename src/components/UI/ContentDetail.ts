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
        detailView.style.backgroundColor = 'var(--detail-bg)';
        detailView.style.color = 'var(--text-primary)';
        detailView.style.transition = 'var(--theme-transition)';
        detailView.style.zIndex = '2000';
        detailView.style.overflowY = 'auto';
        detailView.style.padding = '0';

        // Mobile hamburger menu (visible only on mobile via CSS)
        const mobileMenuHTML = `
            <button id="mobile-menu-hamburger" class="mobile-menu-hamburger" aria-label="Open menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div id="mobile-menu-overlay" class="mobile-menu-overlay">
                <div class="mobile-menu-content">
                    <button id="mobile-home-btn" class="mobile-menu-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>Home</span>
                    </button>
                    <button id="mobile-contents-btn" class="mobile-menu-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                        <span>Contents</span>
                    </button>
                    <div id="mobile-theme-container" class="mobile-menu-item mobile-theme-item" style="border: none; background: none; padding: 0;">
                        <div class="theme-toggle-btn" id="mobile-theme-toggle" style="margin: 0 auto;">
                            <div class="circle">
                                <svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
                                <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        detailView.insertAdjacentHTML('beforeend', mobileMenuHTML);

        // 1. Back to Home Button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-home-btn';
        backBtn.innerHTML = `
            <svg class="chevron-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"/>
            </svg>
            <span class="btn-text">Back to Home</span>
        `;
        backBtn.onclick = () => { window.location.hash = ''; };

        detailView.appendChild(backBtn);

        // --- MARKDOWN BRANCH ---
        if (data.sourceType === 'markdown' && data.markdownPath) {
            // Apply current theme locally to this container
            const tm = (window as any).themeDarkLight;
            if (tm) {
                detailView.classList.add(tm.getThemeClass());
            }

            // Create Refined Pill Toggle (DARK/LIGHT BUTTON) Only for Obsidian posts
            const toggleWrapper = document.createElement('div');
            toggleWrapper.className = 'theme-toggle-wrap';
            toggleWrapper.innerHTML = `
                <div class="theme-toggle-btn" id="theme-toggle">
                    <div class="circle">
                        <svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
                        <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </div>
                </div>
            `;

            // Update icons based on theme
            const updateIcons = () => {
                const isDark = detailView.classList.contains('dark-theme');

                // Update Desktop Toggle
                const desktopMoon = toggleWrapper.querySelector('.moon-icon') as HTMLElement;
                const desktopSun = toggleWrapper.querySelector('.sun-icon') as HTMLElement;

                // Update Mobile Toggle (find it inside detailView)
                const mobileBtn = detailView.querySelector('#mobile-theme-toggle');
                const mobileMoon = mobileBtn?.querySelector('.moon-icon') as HTMLElement;
                const mobileSun = mobileBtn?.querySelector('.sun-icon') as HTMLElement;

                if (isDark) {
                    if (desktopMoon) desktopMoon.style.display = 'block';
                    if (desktopSun) desktopSun.style.display = 'none';
                    if (mobileMoon) mobileMoon.style.display = 'block';
                    if (mobileSun) mobileSun.style.display = 'none';
                } else {
                    if (desktopMoon) desktopMoon.style.display = 'none';
                    if (desktopSun) desktopSun.style.display = 'block';
                    if (mobileMoon) mobileMoon.style.display = 'none';
                    if (mobileSun) mobileSun.style.display = 'block';
                }
            };

            // Add toggle button to detail view
            const toggleBtn = toggleWrapper.querySelector('#theme-toggle') as HTMLElement;
            toggleBtn.onclick = () => {
                if (tm) {
                    detailView.classList.remove(tm.getThemeClass());
                    tm.toggleTheme();
                    detailView.classList.add(tm.getThemeClass());
                    updateIcons();
                }
            };

            updateIcons();
            detailView.appendChild(toggleWrapper);

            const contentArea = document.createElement('div');
            // Add base styles if needed
            detailView.appendChild(contentArea);

            this.container.innerHTML = '';
            this.container.appendChild(detailView);

            const viewer = new MarkdownViewer(contentArea);
            viewer.render(data.markdownPath);

            // Setup mobile menu event listeners
            this.setupMobileMenu(detailView, tm, updateIcons);
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

    /**
     * Sets up the mobile hamburger menu for post pages.
     */
    private setupMobileMenu(detailView: HTMLElement, tm: any, updateIcons: () => void): void {
        const hamburger = detailView.querySelector('#mobile-menu-hamburger');
        const overlay = detailView.querySelector('#mobile-menu-overlay');
        const homeBtn = detailView.querySelector('#mobile-home-btn');
        const contentsBtn = detailView.querySelector('#mobile-contents-btn');
        const themeBtn = detailView.querySelector('#mobile-theme-toggle');

        if (!hamburger || !overlay) return;

        const closeMenu = () => {
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
        };

        // Toggle menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        // Home button
        homeBtn?.addEventListener('click', () => {
            closeMenu();
            window.location.hash = '';
        });

        // Contents button - trigger the existing sidebar toggle
        contentsBtn?.addEventListener('click', () => {
            closeMenu();
            // Find and click the existing sidebar-toggle button
            const sidebarToggle = detailView.querySelector('#sidebar-toggle') as HTMLButtonElement;
            if (sidebarToggle) {
                sidebarToggle.click();
            }
        });

        // Theme button - trigger the existing theme toggle
        themeBtn?.addEventListener('click', () => {
            closeMenu();
            if (tm) {
                detailView.classList.remove(tm.getThemeClass());
                tm.toggleTheme();
                detailView.classList.add(tm.getThemeClass());
                updateIcons();
            }
        });

        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeMenu();
            }
        });
    }
}
