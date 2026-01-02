/**
 * @file main.ts
 * @description Initializes the 3D scene and starts the animation loop.
 * This is the bridge between the HTML file and the complex 3D logic (SceneManager).
 * Creates an object from the class SceneManager defined in SceneManager.ts.
 */
import '@/styles/index.css'; // the web's background is defined in CSS
import { SceneManager } from '@/SceneManager'; // Calls the class SceneManager (the complex 3D logic)

// UI Components
import { Navigation } from '@/components/UI/Navigation';
import { HeroSection } from '@/components/UI/HeroSection';
import { IntroSection } from '@/components/UI/IntroSection';
import { ToolsGrid } from '@/components/UI/ToolsGrid';
import { ContentGrid } from '@/components/UI/ContentGrid';

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

// State Coordination via Scroll Observer
const heroElement = document.getElementById('hero');
const canvasContainer = document.getElementById('canvas-container');
const navElement = document.getElementById(navContainerId);

if (heroElement && canvasContainer && navElement) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // We are at the HERO section
                canvasContainer.classList.remove('fade-out');
                navElement.classList.add('hidden');

                // Enable 3D rotation only at the top
                (canvasContainer as HTMLElement).style.pointerEvents = 'auto';
            } else {
                // We have left the HERO section
                canvasContainer.classList.add('fade-out');
                navElement.classList.remove('hidden');

                // Disable 3D rotation in content so it doesn't block scrolling/clicks
                (canvasContainer as HTMLElement).style.pointerEvents = 'none';
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(heroElement);
}