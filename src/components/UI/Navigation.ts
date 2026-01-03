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
            .map(link => `<li><a href="${link.href}" style="font-size: 0.95rem; text-transform: none; letter-spacing: 0;">${link.label}</a></li>`)
            .join('');

        const mobileLinks = navigationData.links
            .map(link => `<li><a href="${link.href}" class="sidebar-link" style="font-family: var(--font-heading);">${link.label}</a></li>`)
            .join('');

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
                    ${navigationData.logo}
                </div>
                
                <!-- Desktop Menu -->
                <ul class="nav-links-desktop" style="
                    display: flex;
                    list-style: none;
                    gap: 2.5rem;
                    margin: 0;
                    padding: 0;
                ">
                    ${desktopLinks}
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
                    ${mobileLinks}
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

        if (!toggle || !sidebar || !overlay) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        const dragThreshold = 50; // Pixels to drag before closing

        const openMenu = () => {
            toggle.classList.add('active');
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            sidebar.style.transform = ''; // Clear any drag transforms
        };

        const closeMenu = () => {
            toggle.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            sidebar.style.transform = ''; // Clear any drag transforms
        };

        const toggleMenu = () => {
            if (sidebar.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        // Click handlers
        toggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        links.forEach(link => link.addEventListener('click', closeMenu));

        // Swipe/Drag to close logic
        const startDrag = (x: number) => {
            if (!sidebar.classList.contains('active')) return;
            startX = x;
            isDragging = true;
            sidebar.style.transition = 'none'; // Instant feedback
        };

        const moveDrag = (x: number) => {
            if (!isDragging) return;
            currentX = x;
            const deltaX = Math.max(0, currentX - startX); // Only drag to the right
            sidebar.style.transform = `translateX(${deltaX}px)`;

            // Fade out overlay slightly as we drag
            const opacity = Math.max(0, 1 - (deltaX / 150));
            overlay.style.opacity = opacity.toString();
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            sidebar.style.transition = ''; // Restore CSS transitions
            overlay.style.opacity = ''; // Restore CSS transitions

            const deltaX = currentX - startX;
            if (deltaX > dragThreshold) {
                closeMenu();
            } else {
                sidebar.style.transform = 'translateX(0)';
            }
        };

        // Touch events
        sidebar.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: false });
        window.addEventListener('touchend', endDrag);

        // Mouse events (Desktop testing)
        sidebar.addEventListener('mousedown', (e) => startDrag(e.clientX));
        window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
        window.addEventListener('mouseup', endDrag);
    }
}
