/**
 * @file Navigation.ts
 * @description Renders the sticky top navigation bar using the glassmorphism style.
 * Provides links to Home, Content, About, and Contact sections.
 */

export class Navigation {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Element with id ${containerId} not found`);
        this.container = element;
        this.render();
    }

    private render(): void {
        this.container.innerHTML = `
            <nav style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 2rem;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 100;
            ">
                <div class="logo" style="font-weight: 600; font-size: 1.4rem; letter-spacing: -0.02em; font-family: var(--font-heading);">
                    Marco
                </div>
                
                <!-- Desktop Menu -->
                <ul class="nav-links-desktop" style="
                    display: flex;
                    list-style: none;
                    gap: 2.5rem;
                    margin: 0;
                    padding: 0;
                ">
                    <li><a href="#about" style="font-size: 0.95rem; text-transform: none; letter-spacing: 0;">About</a></li>
                    <li><a href="#tools" style="font-size: 0.95rem; text-transform: none; letter-spacing: 0;">Tools</a></li>
                    <li><a href="#content" style="font-size: 0.95rem; text-transform: none; letter-spacing: 0;">Content</a></li>
                </ul>

                <!-- Hamburger Button -->
                <div id="mobile-toggle" class="mobile-menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>

            <!-- Mobile Sidebar -->
            <div id="sidebar-overlay" class="sidebar-overlay"></div>
            <div id="sidebar" class="sidebar">
                <ul>
                    <li><a href="#about" class="sidebar-link" style="font-family: var(--font-heading);">About</a></li>
                    <li><a href="#tools" class="sidebar-link" style="font-family: var(--font-heading);">Tools</a></li>
                    <li><a href="#content" class="sidebar-link" style="font-family: var(--font-heading);">Content</a></li>
                </ul>
            </div>
        `;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const toggle = document.getElementById('mobile-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const links = document.querySelectorAll('.sidebar-link');

        const toggleMenu = () => {
            toggle?.classList.toggle('active');
            sidebar?.classList.toggle('active');
            overlay?.classList.toggle('active');

            // Prevent background scroll when sidebar is open
            if (sidebar?.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                // Return to auto if not at the very top (controlled by IntersectionObserver anyway)
                // but setting to auto here ensures it's unlocked when closing sidebar.
                document.body.style.overflow = 'auto';
            }
        };

        toggle?.addEventListener('click', toggleMenu);
        overlay?.addEventListener('click', toggleMenu);

        links.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu when a link is clicked
                toggleMenu();
            });
        });
    }
}
