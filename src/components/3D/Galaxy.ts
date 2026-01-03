/**
 * @file Galaxy.ts
 * @description The background with stars.
 * Is created using a loop that creates 5000 random points.
 */

import * as THREE from 'three';

export function createGalaxy(scene: THREE.Scene) {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {          // 10000 stars
        const x = (Math.random() - 0.5) * 200; // random distance  - x
        const y = (Math.random() - 0.5) * 200; // random distance  - y
        const z = (Math.random() - 0.5) * 200; // random distance  - z
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    return stars;
}
