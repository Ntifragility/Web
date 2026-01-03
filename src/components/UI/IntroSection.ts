import { introData } from '@/data/intro';

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
        section.style.minHeight = '100vh';
        section.style.display = 'flex';
        section.style.flexDirection = 'column';
        section.style.justifyContent = 'center';
        section.style.alignItems = 'center'; // Center children horizontally
        section.style.padding = 'var(--section-spacing) 2rem';
        section.style.maxWidth = '900px'; // Slightly wider for centered look
        section.style.margin = '0 auto';
        section.style.textAlign = 'center';

        // Glassmorphic card for the intro
        section.className = 'glass';
        section.style.borderRadius = '20px';
        section.style.marginTop = '2rem'; // Space from hero
        section.style.background = 'rgba(10, 10, 15, 0.8)'; // Darker background

        const buttonsHTML = introData.buttons.map(btn => `
            <button class="intro-btn-${btn.primary ? 'primary' : 'secondary'}" style="
                padding: 1rem 2rem;
                background: ${btn.primary ? 'var(--accent-blue)' : 'transparent'};
                color: ${btn.primary ? 'black' : 'var(--text-primary)'};
                border: ${btn.primary ? 'none' : '1px solid var(--text-primary)'};
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            ">
                ${btn.label}
            </button>
        `).join('');

        section.innerHTML = `
            <h2 style="
                font-size: 2.5rem; 
                margin-bottom: 1.5rem; 
                color: var(--accent-blue);
            ">
                ${introData.title}
            </h2>
            <p style="
                font-size: 1.1rem; 
                line-height: 1.8; 
                color: var(--text-secondary);
                margin-bottom: 2rem;
            ">
                ${introData.bio}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; width: 100%;">
                ${buttonsHTML}
            </div>
        `;

        this.container.appendChild(section);

        // Bind button events
        const buttons = section.querySelectorAll('button');
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', introData.buttons[index].onClick);
        });
    }
}
