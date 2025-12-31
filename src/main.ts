/**
 * @file main.ts
 * @description Initializes the 3D scene and starts the animation loop.
 * This is the bridge between the HTML file and the complex 3D logic (SceneManager).
 * Creates an object from the class SceneManager defined in SceneManager.ts.
 */

import '@/styles/index.css'; // the web's background is defined in CSS
import { SceneManager } from '@/SceneManager'; // Calls the class SceneManager (the complex 3D logic)

const sceneManagerMVwebsite = new SceneManager(document.body);// Creates an object. Attaches the 3D canvas to the webpage
sceneManagerMVwebsite.animate(); // Pushes the "Start" button (begins the animation, render loop, move the camera)