import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Timer } from 'three/examples/jsm/misc/Timer'
import { GUI } from 'dat.gui'

const frustumSize = 100

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(20))

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// )
// const camera = new THREE.OrthographicCamera(-10, 10,10,-10)
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const stats = new Stats()
document.body.appendChild(stats.dom)

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.SphereGeometry(1)
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    // camera.aspect = aspect
    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}



const gui = new GUI()
// const cubeFolder = gui.addFolder('Cube')
// const cubeRotationFolder = cubeFolder.addFolder('Rotation')
// cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
// cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
// cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
// cubeFolder.open()
// cubeRotationFolder.open()
// const cubePositionFolder = cubeFolder.addFolder('Position')
// cubePositionFolder.add(cube.position, 'x', -10, 10, 2)
// cubePositionFolder.add(cube.position, 'y', -10, 10, 2)
// cubePositionFolder.add(cube.position, 'z', -10, 10, 2)
// cubeFolder.open()
// cubePositionFolder.open()
// const cubeScaleFolder = cubeFolder.addFolder('Scale')
// cubeScaleFolder.add(cube.scale, 'x', -5, 5)
// cubeScaleFolder.add(cube.scale, 'y', -5, 5)
// cubeScaleFolder.add(cube.scale, 'z', -5, 5)
// cubeFolder.add(cube, 'visible')
// cubeFolder.open()
// cubeScaleFolder.open()

const options = {
    angle: 70,
    power: 20
}


gui.add(options, "angle", 0, 90)
gui.add(options, "power", 0, 10)



let initPos: THREE.Vector3
let initVelocity: THREE.Vector3
let isLaunched = false



function launch() {
    timer.reset()
    initPos = new THREE.Vector3(0,0,0)
    cube.position.x = initPos.x
    cube.position.y = initPos.y
    cube.position.z = 0
    initVelocity = new THREE.Vector3(Math.cos(degrees_to_radians(options.angle)), Math.sin(degrees_to_radians(options.angle)),0).multiplyScalar(options.power)
    
    isLaunched = true
}



// const clock = new THREE.Clock()
// clock.getDelta()


window.addEventListener('click', (event) => {
    launch()
}, false)

let time = 0

const timer = new Timer();

function update() {
    timer.update()
    // console.log(options)
    // Get Passed Time
    
    if (isLaunched) {
        // const _time = clock.getDelta()
        // const deltaTime = (Date.now() - start) / 10000
        const delta = timer.getDelta();
        time += delta
        // console.log(time)

        const newPosX = kinematicEq(0, initVelocity.x, time, initPos.x)
        const newPosY = kinematicEq(-9.8, initVelocity.y, time, initPos.y)

        cube.position.x = newPosX
        cube.position.y = newPosY
    }


    requestAnimationFrame(update)
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

update()


function kinematicEq(acceleration: number, velocity: number, time: number, position: number){
    return (0.5 * acceleration * time * time) + (velocity * time) + position
}

function degrees_to_radians(degrees: number)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}