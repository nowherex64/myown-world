import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let oldElapsedTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Se prepara el canvas
    const canvas = document.createElement('canvas');
    canvas.classList.add('webgl');
    const body = document.body;
    body.prepend(canvas);

    // Se crea objeto para calcular el tiempo de ejecución de la aplicación
    const clock = new THREE.Clock();

    // Se crean los objetos para renderizar
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    });
    const scene = new THREE.Scene();
    const cameraGroup = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight
    );
    cameraGroup.add(camera);
    const controls = new OrbitControls(camera, canvas);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

    // Se configura el renderizador
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);

    // Se configura la cámara
    camera.position.z = 5;

    // Se configuran los controles
    controls.enabled = true;
    controls.enableDamping = true;

    window.addEventListener('resize', () => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();

        renderer.setSize(canvas.width, canvas.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Se agregan los objetos a la escena
    scene.add(cameraGroup);
    scene.add(ambientLight);

    // Se agrega la función de configuración
    if (window.setup) {
        window.setup(scene);
    }

    // Se configura el loop de renderizado
    const render = () => {
        if (window.draw) {
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - oldElapsedTime;
            oldElapsedTime = elapsedTime;

            window.draw({ time: elapsedTime, delta: deltaTime }, camera, cameraGroup);
        }

        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
    };

    render();
});
