import * as THREE from 'three';
import CANNON from 'cannon';
import * as dat from 'lil-gui';

let esfera;
let esferaFisica;
const personaje = {
    mesh: null,
    fisica: null,
};
let world;
const teclado = {
    adelante: false,
    atras: false,
    derecha: false,
    izquierda: false,
};

const velocidad = 0.05;

window.setup = (scene) => {

    const axes = new THREE.AxesHelper(2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 3, 1);
    directionalLight.shadow.camera.left = -10; // Límite izquierdo del frustum de la cámara de sombras
    directionalLight.shadow.camera.right = 10; // Límite derecho del frustum de la cámara de sombras
    directionalLight.shadow.camera.top = 10; // Límite superior del frustum de la cámara de sombras
    directionalLight.shadow.camera.bottom = -10; // Límite inferior del frustum de la cámara de sombras
    directionalLight.shadow.camera.near = 0.5; // Distancia cercana del frustum de la cámara de sombras
    directionalLight.shadow.camera.far = 200; // Distancia lejana del frustum de la cámara de sombras

    const material = new THREE.MeshToonMaterial({
        color: 0xa13f4a,
    });
    const plano = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        material,
    );

    plano.rotation.x = -Math.PI * 0.5;

    esfera = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        material
    );

    personaje.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshToonMaterial({
            color: 0x3f4aa1,
        })
    );

    personaje.mesh.position.x = 3;
    personaje.mesh.position.y = 0.5;

    esfera.position.y = 3;
    esfera.castShadow = true;
    plano.castShadow = true;
    plano.receiveShadow = true;

    scene.add(axes);
    scene.add(directionalLight);
    scene.add(esfera);
    scene.add(personaje.mesh);
    scene.add(plano);

    world = new CANNON.World();
    world.gravity.set(0, -9.8, 0);

    const eShape = new CANNON.Sphere(1);
    esferaFisica = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 6, 0),
        shape: eShape,
    });

    const suelo = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, -1.0, 0),
        shape: new CANNON.Box(new CANNON.Vec3(10, 1, 10))
    });

    personaje.fisica = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(3, 0.5, 0),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
    });
    personaje.fisica.addEventListener('collide', (event) => {
        if (event.body == esferaFisica) {
            console.log('Choca contra la esfera');
        }
    });

    world.addBody(esferaFisica);
    world.addBody(suelo);
    world.addBody(personaje.fisica);
};

window.draw = (elapsedTime) => {
    world.step(1 / 60, elapsedTime.delta, 3);

    if (esferaFisica.position.y < -10) {
        esferaFisica.velocity.set(0,0,0);
        esferaFisica.angularVelocity.set(0,0,0);

        esferaFisica.position.x = 0;
        esferaFisica.position.y = 10;
        esferaFisica.position.z = 0;
    }

    esfera.position.x = esferaFisica.position.x;
    esfera.position.y = esferaFisica.position.y;
    esfera.position.z = esferaFisica.position.z;

    personaje.mesh.position.x = personaje.fisica.position.x;
    personaje.mesh.position.y = personaje.fisica.position.y;
    personaje.mesh.position.z = personaje.fisica.position.z;

    if (teclado.adelante) {
        personaje.fisica.position.x += velocidad;
    }

    if (teclado.atras) {
        personaje.fisica.position.x -= velocidad;
    }

    if (teclado.derecha) {
        personaje.fisica.position.z += velocidad;
    }

    if (teclado.izquierda) {
        personaje.fisica.position.z -= velocidad;
    }
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        teclado.adelante = true;
    } else if (event.key === 's') {
        teclado.atras = true;
    } else if (event.key === 'a') {
        teclado.izquierda = true;
    } else if (event.key === 'd') {
        teclado.derecha = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        teclado.adelante = false;
    } else if (event.key === 's') {
        teclado.atras = false;
    } else if (event.key === 'a') {
        teclado.izquierda = false;
    } else if (event.key === 'd') {
        teclado.derecha = false;
    }
});