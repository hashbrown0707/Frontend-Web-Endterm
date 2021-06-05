import * as THREE from "../node_modules/three/build/three.module.js";
import {GLTFLoader} from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {gsap} from "../node_modules/gsap/index.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({antialias: true});
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const geometry = new THREE.PlaneBufferGeometry(1, 1.3);
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const camMax = new THREE.Vector3(0, 2.5, 2);
const camMin = new THREE.Vector3(0, -7.8, 2);

let objs = [];

let y = 0;
let position = 0;

window.addEventListener("wheel", OnMouseWheel);

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX / window.innerWidth * 2 - 1; 
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; 
});

function Init() {
    scene.add(camera);
    camera.position.set(0, 0, 2);
    $("#canvas").append(renderer.domElement);

    let light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    // console.log(light);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

function Animate() {
    requestAnimationFrame(Animate);

    y *= 0.9;
    position += y;

    if(position > 2.5)
        position = 2.5;
    else if(position < -7.8)
        position = -7.8;

    camera.position.y = position;

    // console.log(camera.position.y);

    ray.setFromCamera(mouse, camera);
    const intersects = ray.intersectObjects(objs);

    for(const intersect of intersects){
        gsap.to(intersect.object.scale, {x:1.7, y:1.7});
        gsap.to(intersect.object.rotation, {y:-0.5});
        gsap.to(intersect.object.position, {z:-0.9});
    }

    for(const obj of objs){
        if(!intersects.find(intersect => intersect.object === obj)){
            gsap.to(obj.scale, {x:1, y:1});
            gsap.to(obj.rotation, {y:0});
            gsap.to(obj.position, {z:0});
        }
    }

    renderer.render(scene, camera);
}

function LoadModel(){
    loader.load("../models/burger.glb", (gltf) => {
        // scene.add(gltf.scene);
        gltf.scene.position.set(0, 0, 0);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    });
}

function LoadImage(){
    for(let i = 0; i < 4; ++i){
        const material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(`../images/${i}.jpg`)
        });
    
        const img = new THREE.Mesh(geometry, material);
        img.position.set(Math.random() + 0.5, i * -1.8);
    
        scene.add(img);
    }

    scene.traverse((object) => {
        if(object.isMesh)
            objs.push(object);
    });
}

function OnMouseWheel(event){
    y = -event.deltaY * 0.001;
}

Init();
LoadImage();
Animate();
