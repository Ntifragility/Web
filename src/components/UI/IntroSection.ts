/**
 * @file IntroSection.ts
 * @description Renders the 'About Me' section.
 * Provides a brief introduction with a dark background to contrast with the Hero.
 */

export class IntroSection {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Element with id ${containerId} not found`);
        this.container = element;
        this.render();
    }

    private render(): void {
        const section = document.createElement('section');
        section.id = 'about';
        section.style.padding = 'var(--section-spacing) 2rem';
        section.style.maxWidth = '800px';
        section.style.margin = '0 auto';
        section.style.textAlign = 'left';

        // Glassmorphic card for the intro
        section.className = 'glass';
        section.style.borderRadius = '20px';
        section.style.marginTop = '2rem'; // Space from hero
        section.style.background = 'rgba(10, 10, 15, 0.8)'; // Darker background

        section.innerHTML = `
            <h2 style="
                font-size: 2.5rem; 
                margin-bottom: 1.5rem; 
                color: var(--accent-blue);
            ">
                Hey, I'm Marco.
            </h2>
            <p style="
                font-size: 1.1rem; 
                line-height: 1.8; 
                color: var(--text-secondary);
                margin-bottom: 2rem;
            ">
                I am a Software Engineer passionate about 3D data visualization and building immersive web experiences. 
                I bridge the gap between complex technical systems and engaging user interfaces.
            </p>
            <div style="display: flex; gap: 1rem;">
                <button style="
                    padding: 1rem 2rem;
                    background: var(--accent-blue);
                    color: black;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                ">
                    Get in Touch
                </button>
                <button style="
                    padding: 1rem 2rem;
                    background: transparent;
                    color: var(--text-primary);
                    border: 1px solid var(--text-primary);
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                ">
                    View Resume
                </button>
            </div>
        `;

        this.container.appendChild(section);
    }
}
