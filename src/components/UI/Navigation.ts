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
            <nav class="glass" style="
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
                <div class="logo" style="font-weight: 700; font-size: 1.2rem; letter-spacing: 0.1em;">
                    MARCO 
                </div>
                <ul style="
                    display: flex;
                    list-style: none;
                    gap: 2rem;
                    margin: 0;
                    padding: 0;
                ">
                    <li><a href="#" style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em;">Home</a></li>
                    <li><a href="#content" style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em;">Content</a></li>
                    <li><a href="#about" style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em;">About</a></li>
                    <li><a href="#contact" style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em;">Contact</a></li>
                </ul>
            </nav>
        `;
    }
}
