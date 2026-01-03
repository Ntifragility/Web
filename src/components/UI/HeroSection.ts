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
            <button id="scroll-btn" style="
                position: absolute;
                bottom: 65px; /* Scroll button position */
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.8rem;
                cursor: pointer;
                transition: opacity 0.3s ease;
                background: none;
                border: none;
                padding: 0;
                outline: none;
                color: inherit;
            ">

                <div class="chevron-container" style="animation: bounce 2s infinite ease-in-out;">
                    <svg width="50" height="25" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2L20 18L38 2" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </button>

            <style>
                #scroll-btn {
                    opacity: 0.6;
                }
                #scroll-btn:hover {
                    opacity: 1;
                }
                #scroll-btn:hover .chevron-container {
                    animation-play-state: paused;
                    transform: translateY(5px);
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(10px); }
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
