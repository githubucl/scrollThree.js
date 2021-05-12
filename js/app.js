import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import anime from 'animejs/lib/anime.es.js';

export default class Sketch {
    constructor(options) {
        this.time = 0
        this.container = options.dom
        this.divContainer = options.page
        this.scrollY = 0
        this._event = {
            y: 0,
            deltaY: 0
        }

        this.timeline = null
        this.percentage = 0
        this.scene = new THREE.Scene();

        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight

        this.maxHeight = (this.divContainer.clientHeight || this.divContainer.offsetHeight) - window.innerHeight


        this.camera = new THREE.PerspectiveCamera(20, this.width / this.height, 0.01, 10);
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.resize()
        this.setupResize()
        this.addObjects()
        this.initTimeline()
        this.divContainer.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

        this.render()

    }

    addObjects() {


        this.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 0.1, 0.1), new THREE.MeshNormalMaterial());
        this.mesh.position.y = 0
        // this.mesh.position.z = 0
        this.scene.add(this.mesh);
    }
    render() {

        this.time += 5
        // console.log(this.time);
        this.mesh.rotation.x = this.time / 4000;
        this.mesh.rotation.y = this.time / 2000;

        this.renderer.render(this.scene, this.camera);

        this.percentage = this.lerp(this.percentage, document.documentElement.scrollTop, 0.1);
        this.timeline.seek(this.percentage * 4500 / this.maxHeight)
        window.requestAnimationFrame(this.render.bind(this))

    }

    onWheel(e) {
        e.stopImmediatePropagation();
        // e.preventDefault();
        e.stopPropagation();

        // this.percentage = document.documentElement.scrollTop / this.maxHeight

    }
    lerp(a, b, t) {
        return ((1 - t) * a + t * b);
    }
    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }
    resize() {

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.maxHeight = (this.divContainer.clientHeight || this.divContainer.offsetHeight) - window.innerHeight

        this.camera.updateProjectionMatrix();
    }

    initTimeline() {
        this.timeline = anime.timeline({
            autoplay: false,
            duration: 4500,
            easing: 'easeOutSine'
        });

        this.timeline.add({
            targets: this.mesh.position,
            x: 0.1,
            y: 0.00,
            z: 0.5,
            duration: 2250,
            // we need to update the camera projection matrix, otherwise we won't see anything happens
            update: this.camera.updateProjectionMatrix()
        })
        this.timeline.add({
            targets: this.mesh.position,
            x: 0,
            y: 0.00,
            z: 0.9,
            duration: 2250,
            // we need to update the camera projection matrix, otherwise we won't see anything happens
            update: this.camera.updateProjectionMatrix()
        })

        const value = new THREE.Color(0xF)
        const initial = new THREE.Color(0xFFFCFC)
        this.timeline.add({
            targets: initial,
            r: [initial.r, value.r],
            g: [initial.g, value.g],
            b: [initial.b, value.b],
            duration: 4500,
            update: () => {
                this.renderer.setClearColor(initial);
            }
        }, 0);
    }


}

new Sketch({
    dom: document.getElementById('container'),
    page: document.querySelector('main')
})

