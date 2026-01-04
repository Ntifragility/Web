/**
 * @file ThemeDarkLight.ts
 * @description Manages the Dark/Light theme state and persistence.
 */

export class ThemeDarkLight {
    private static instance: ThemeDarkLight;
    private isDark: boolean = true;
    private readonly STORAGE_KEY = 'v-website-theme';

    private constructor() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        if (savedTheme) {
            this.isDark = savedTheme === 'dark';
        } else {
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    public static getInstance(): ThemeDarkLight {
        if (!ThemeDarkLight.instance) {
            ThemeDarkLight.instance = new ThemeDarkLight();
        }
        return ThemeDarkLight.instance;
    }

    public toggleTheme(): void {
        this.isDark = !this.isDark;
        localStorage.setItem(this.STORAGE_KEY, this.isDark ? 'dark' : 'light');
    }

    public getIsDark(): boolean {
        return this.isDark;
    }

    public getThemeClass(): string {
        return this.isDark ? 'dark-theme' : 'light-theme';
    }
}

export const themeDarkLight = ThemeDarkLight.getInstance();
