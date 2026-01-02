/**
 * @file HeroSection.ts
 * @description Renders the initial Hero section that overlays the 3D text.
 * Contains the main title, subtitle, and a scroll down indicator.
 * Designed to be 100vh height to showcase the 3D background.
 */

export class HeroSection {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Element with id ${containerId} not found`);
        this.container = element;
        this.render();
    }

    private render(): void {
        const section = document.createElement('section');
        section.id = 'hero';
        section.style.height = '100vh';
        section.style.display = 'flex';
        section.style.flexDirection = 'column';
        section.style.justifyContent = 'center';
        section.style.alignItems = 'center';
        section.style.textAlign = 'center';
        section.style.color = 'var(--text-primary)';
        section.style.position = 'relative';

        section.innerHTML = `         
            <div style="
                position: absolute;
                bottom: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                opacity: 0.8;
            ">
                <button id="scroll-btn" class="glass" style="
                    padding: 0.8rem 1.5rem;
                    border-radius: 30px;
                    color: var(--text-primary);
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 1px solid var(--glass-border);
                ">
                    Scroll to Explore
                </button>
                <div style="animation: bounce 2s infinite;">
                    &#8595;
                </div>
            </div>

            <style>
                #scroll-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                    border-color: var(--accent-blue);
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
            </style>
        `;

        this.container.appendChild(section);

        // Add scroll logic
        const scrollBtn = section.querySelector('#scroll-btn');
        scrollBtn?.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            aboutSection?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}
