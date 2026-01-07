/**
 * @file main.ts
 * @description Initializes the 3D scene and starts the animation loop.
 * This is the bridge between the HTML file and the complex 3D logic (SceneManager).
 * Creates an object from the class SceneManager defined in SceneManager.ts.
 */
import '@/styles/index.css'; // the web's background is defined in CSS
import { SceneManager } from '@/SceneManager'; // Calls the class SceneManager (the complex 3D logic)
import { themeDarkLight } from '@/services/ThemeDarkLight';

// Scoped Theme Access
(window as any).themeDarkLight = themeDarkLight;

// UI Components
import { Navigation } from '@/components/UI/Navigation';
import { HeroSection } from '@/components/UI/HeroSection';
import { IntroSection } from '@/components/UI/IntroSection';
import { ToolsGrid } from '@/components/UI/ToolsGrid';
import { ContentGrid } from '@/components/UI/ContentGrid';
import { ContentDetail } from '@/components/UI/ContentDetail';

// Initialize 3D Scene
const container = document.getElementById('canvas-container') as HTMLElement;
const sceneManagerMVwebsite = new SceneManager(container);
sceneManagerMVwebsite.animate();

// Initialize UI
const navContainerId = 'nav-container';
const mainContent = 'main-content';

new Navigation(navContainerId);
new HeroSection(mainContent);
new IntroSection(mainContent);
new ToolsGrid(mainContent);
new ContentGrid(mainContent);

const detailContainerId = 'detail-container';
const contentDetail = new ContentDetail(detailContainerId);

// --- Simple Router ---
const handleRoute = () => {
    const hash = window.location.hash;
    const contentWrapper = document.getElementById('content-wrapper');
    const canvasContainer = document.getElementById('canvas-container');

    if (hash.startsWith('#content/')) {
        const id = hash.split('/')[1];
        contentDetail.render(id);

        if (contentWrapper) contentWrapper.style.display = 'none';
        if (canvasContainer) {
            canvasContainer.classList.add('fade-out');
        }
        window.scrollTo(0, 0);
    } else {
        contentDetail.hide();
        if (contentWrapper) contentWrapper.style.display = 'block';

        // Anchor Jumping Logic: Scroll to section if hash exists
        if (hash && hash !== '#') {
            const targetId = hash.substring(1).split('&')[0]; // Clean up for potential params
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Short delay to ensure browser has layouted the visible content-wrapper
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }

        // Ensure scene is visible if we're at the top
        if (canvasContainer && window.scrollY < 100) {
            canvasContainer.classList.remove('fade-out');
        }
    }
};

window.addEventListener('hashchange', handleRoute);
handleRoute(); // Run once on load

// State Coordination via Scroll Observer
const heroElement = document.getElementById('hero');
const canvasContainer = document.getElementById('canvas-container');
const navElement = document.getElementById(navContainerId);

if (heroElement && canvasContainer && navElement) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only toggle if we are NOT in a detail view
            if (window.location.hash.startsWith('#content/')) return;

            if (entry.isIntersecting) {
                // At the top (Hero)
                canvasContainer.classList.remove('fade-out');
                navElement.classList.add('hidden');
                (canvasContainer as HTMLElement).style.pointerEvents = 'auto';
            } else {
                // Scrolled down
                canvasContainer.classList.add('fade-out');
                navElement.classList.remove('hidden');
                (canvasContainer as HTMLElement).style.pointerEvents = 'none';
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(heroElement);
}