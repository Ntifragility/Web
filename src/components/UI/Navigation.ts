/**
 * @file Navigation.ts
 * @description Navigation with desktop links and mobile hamburger menu.
 */
import { navigationData } from '@/data/navigation';

export class Navigation {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Element with id ${containerId} not found`);
        this.container = element;
        this.render();
    }

    private render(): void {
        const desktopLinks = navigationData.links
            .map(link => `<li><a href="${link.href}" class="nav-link-item" style="font-size: 0.95rem; text-transform: none; letter-spacing: 0;">${link.label}</a></li>`)
            .join('');

        const mobileLinks = navigationData.links
            .map(link => `<li><a href="${link.href}" class="mobile-nav-link">${link.label}</a></li>`)
            .join('');

        this.container.innerHTML = `
            <nav class="main-nav">
                <div class="logo" style="font-weight: 600; font-size: 1.4rem; letter-spacing: -0.02em; font-family: var(--font-heading);">
                    ${navigationData.logo}
                </div>
                
                <!-- Desktop Menu -->
                <ul class="nav-links-desktop">
                    ${desktopLinks}
                </ul>

                <!-- Mobile Hamburger -->
                <button id="hamburger-btn" class="hamburger-btn" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

            <!-- Mobile Menu Overlay -->
            <div id="mobile-menu" class="mobile-menu">
                <ul>
                    ${mobileLinks}
                </ul>
            </div>
        `;

        this.setupMobileMenu();
    }

    private setupMobileMenu(): void {
        const hamburger = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!hamburger || !mobileMenu) return;

        // Toggle menu on hamburger click
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link - let native anchor behavior work
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Just close the menu - native <a href="#about"> will handle scroll
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}
