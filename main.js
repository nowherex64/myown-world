import * as THREE from 'three';
import * as dat from 'lil-gui';
import { DirectionalLight } from 'three';

let toro = null;
const cursor = {
    x: 0,
    y: 0,
};

window.setup = (scene) => {

    window.addEventListener('mousemove', (event) => {
        cursor.x = (event.clientX / window.innerWidth) - 0.5;
        cursor.y = (event.clientY / window.innerHeight) - 0.5;
    });

    const axes = new THREE.AxesHelper(2);
    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(2, 3, 1);

    const material = new THREE.MeshToonMaterial({
        color: 0xa13f4a,
    });
    toro = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 32, 32),
        material
    );
    toro.position.x = 1.5;

    scene.add(axes);
    scene.add(directionalLight);
    scene.add(toro);
};

window.draw = (elapsedTime, camera, cameraGroup) => {
    toro.rotation.x += 0.005;
    toro.rotation.y += 0.0055;

    cameraGroup.position.x += (cursor.x - cameraGroup.position.x)*0.1;
    cameraGroup.position.y += (cursor.y - cameraGroup.position.x)*0.1;
};
