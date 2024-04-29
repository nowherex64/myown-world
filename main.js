import * as THREE from 'three';
import CANNON from 'cannon';
import * as dat from 'lil-gui';

let esfera;
let world;

window.setup = (scene) => {

    const axes = new THREE.AxesHelper(2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 3, 1);

    const material = new THREE.MeshToonMaterial({
        color: 0xa13f4a,
    });
    const plano = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        material,
    );

    plano.rotation.x = -Math.PI * 0.5;

    esfera = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({color: 0xa13f4a,})
    );

    esfera.position.y = 3;
    esfera.castShadow = true;
    plano.castShadow = true;
    plano.receiveShadow = true;

    scene.add(axes);
    scene.add(directionalLight);
    scene.add(esfera);
    scene.add(plano);

    world = new CANNON.World();
    world.gravity.set(0, -9.8, 0);
    const esferaShape = CANNON.Sphere(1);
    const esferaBody = CANNON.Body({
        mass: 1,
        position: CANNON.Vec3(0, 3, 0),
        shape: esferaShape,
    });
    world.addBody(esferaBody);
};

window.draw = (elapsedTime) => {
    world.step(1 / 60, elapsedTime.delta, 3);
};
