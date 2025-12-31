// pretty usuful channel
// https://www.youtube.com/watch?v=1UTqFAjYx1k

/**
 * @file SceneManager.ts
 * @description Core engine for the 3D Earth visualization. 
 * Manages the Three.js lifecycle: Scene, Camera, Renderer, and Animation Loop.
 * Handles responsive window scaling and component orchestration.
 */

import * as THREE from 'three'; // the 3D library three.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // the camera controls
import { createGalaxy } from '@/components/Galaxy'; // the galaxy component
import { createEarth } from '@/components/Earth'; // the earth component
import { createAtmosphere } from '@/components/Atmosphere'; // the atmosphere component

/**
 * SceneManager orchestrates the 3D environment.
 * It serves as the main entry point for all Three.js logic.
 */
export class SceneManager {
    // --- Properties (State) ---
    private scene: THREE.Scene; // the main scene
    private camera: THREE.PerspectiveCamera; // the camera
    private renderer: THREE.WebGLRenderer; // the renderer
    private controls: OrbitControls; // the controls
    private earthGroup: THREE.Group; // the earth group
    private earth: THREE.Mesh; // the earth
    private clouds: THREE.Mesh; // the clouds

    /**
     * Initializes the 3D world.
     * @param canvasContainer The HTML element where the 3D canvas will be injected.
     */
    constructor(canvasContainer: HTMLElement) { // constructor 
        // 1. Initialize the Container (The "Void")
        this.scene = new THREE.Scene();

        // 2. Setup the Eyes (Camera)
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 2.5;

        // 3. Setup the Engine (Renderer)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        canvasContainer.appendChild(this.renderer.domElement);

        // 4. Setup the Interactions (Controls)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 1.5;
        this.controls.maxDistance = 5;

        // 5. Build the Universe (Components)
        createGalaxy(this.scene); // Calling from Galaxy.ts

        this.earthGroup = new THREE.Group();
        this.earthGroup.rotation.z = 23.5 * Math.PI / 180; // Tilt
        this.scene.add(this.earthGroup);

        const earthObj = createEarth(this.earthGroup); // Calling from Earth.ts
        this.earth = earthObj.earth;
        this.clouds = earthObj.clouds;

        const atmosphere = createAtmosphere(); // Calling from Atmosphere.ts
        this.scene.add(atmosphere);

        // 6. Setup the Lighting
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5); // Sun light 
        sunLight.position.set(5, 3, 5); // Sun position
        this.scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Ambient light
        this.scene.add(ambientLight);

        // 7. Setup the Events
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() { // handles window resize
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() { // handles animation
        requestAnimationFrame(this.animate.bind(this));

        this.earth.rotation.y += 0.001;
        this.clouds.rotation.y += 0.0013;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
