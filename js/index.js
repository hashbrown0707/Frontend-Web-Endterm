import * as THREE from "../node_modules/three/build/three.module.js";
import {GLTFLoader} from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({antialias: true});
const loader = new GLTFLoader();
const control = new OrbitControls(camera, renderer.domElement);

function Init() {
    scene.background = new THREE.Color(0xdddddd);
    control.update();

    scene.add(camera);
    camera.position.set(2, 10, 300);
    $("#canvas").append(renderer.domElement);

    loader.load("../models/burger.glb", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.position.set(0, 0, 0);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        });

    let light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    console.log(light);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

Init();
animate();