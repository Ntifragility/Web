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
import { ContentGrid } from '@/components/UI/ContentGrid';

// Initialize 3D Scene
const container = document.getElementById('canvas-container') as HTMLElement;
const sceneManagerMVwebsite = new SceneManager(container);
sceneManagerMVwebsite.animate();

// Initialize UI
const navContainer = 'nav-container';
const mainContent = 'main-content';

new Navigation(navContainer);
new HeroSection(mainContent);
new IntroSection(mainContent);
new ContentGrid(mainContent);