/**
 * @file navigation.ts
 * @description Centralized data for the navigation bar.
 */

export interface NavLink {
    label: string;
    href: string;
}

export const navigationData = {
    logo: 'Marco',
    links: [
        { label: 'About', href: '#about' },
        { label: 'Tools', href: '#tools' },
        { label: 'Content', href: '#content' }
    ] as NavLink[]
};
