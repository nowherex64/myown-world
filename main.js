import * as THREE from 'three';
import * as dat from 'lil-gui';
import { DirectionalLight } from 'three';

let toro = null;

window.setup = (scene) => {
    const axes = new THREE.AxesHelper(2);
    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(2, 3, 1);

    const material = new THREE.MeshToonMaterial({
        color: 0xa13f4a,
    });
    toro = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.5, 32, 32),
        material
    );

    scene.add(axes);
    scene.add(directionalLight);
    scene.add(toro);
};

window.draw = (elapsedTime) => {
    toro.rotation.x += 0.01;
    toro.rotation.y += 0.015;
};
