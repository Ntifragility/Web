/**
 * @file Atmosphere.ts
 * @description 3D atmospheric glow and weather effects for earth.
 */
import * as THREE from 'three';

export function createAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(1.2, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 7.0);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false
    });
    return new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
}
