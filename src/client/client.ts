import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Timer } from 'three/examples/jsm/misc/Timer'
import { GUI } from 'dat.gui'

const frustumSize = 100

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(100))

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// )
// const camera = new THREE.OrthographicCamera(-10, 10,10,-10)
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000 );
camera.position.x = 50
camera.position.y = 25
camera.position.z = 100

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const stats = new Stats()
document.body.appendChild(stats.dom)

// const controls = new OrbitControls(camera, renderer.domElement)

class Ball {
    mesh: THREE.Mesh
    initPos: THREE.Vector3
    initVelocity: THREE.Vector3
    time = 0
    isLaunched = false
    constructor(initPos: THREE.Vector3, initVelocity: THREE.Vector3){
        this.initPos = initPos
        this.initVelocity = initVelocity
        const geometry = new THREE.SphereGeometry(1)
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        })

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.x = initPos.x
        this.mesh.position.y = initPos.y
        this.mesh.position.z = initPos.z
    }
}

const balls: Ball[] = []


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
const options = {
    angle: 70,
    power: 20
}
gui.add(options, "angle", 0, 180)
gui.add(options, "power", 0, 100)


function launch() {
    console.log("Called launch")
    // timer.reset()
    const ball = new Ball(new THREE.Vector3(0,0,0), new THREE.Vector3(Math.cos(degrees_to_radians(options.angle)), Math.sin(degrees_to_radians(options.angle)),0).multiplyScalar(options.power))
    ball.isLaunched = true
    scene.add(ball.mesh)
    balls.push(ball)
}


window.addEventListener('click', (event) => {
    launch()
}, true)


const timer = new Timer();

function update() {
    timer.update()
    // console.log(options)
    // Get Passed Time
    
    balls.forEach(ball => {
        if (ball.isLaunched) {
            console.log("dfnjksn")
            const delta = timer.getDelta();
            ball.time += delta
            // console.log(time)
    
            const newPosX = kinematicEq(0, ball.initVelocity.x, ball.time, ball.initPos.x)
            const newPosY = kinematicEq(-9.8, ball.initVelocity.y, ball.time, ball.initPos.y)
    
            ball.mesh.position.x = newPosX
            ball.mesh.position.y = newPosY
        }
    })


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