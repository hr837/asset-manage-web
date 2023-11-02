import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { ref } from 'vue'
import { getFilePath } from '@/utils/file.util'
/** 容器实例 */
let containerEl: HTMLDivElement
let videoEl: HTMLVideoElement
/** 场景 */
let scene: THREE.Scene | null = null
/** 相机 */
let camera: THREE.PerspectiveCamera
/** 渲染器 */
let renderer: THREE.WebGLRenderer | null = null

let objAction: THREE.AnimationAction
let clock: THREE.Clock
let fbxModelUrl = ''
const playing = ref(false)
let _gui: GUI

// 执行动画
function animate() {
  requestAnimationFrame(animate)
  const time = clock.getDelta()
  objAction?.getMixer().update(time)
  renderer?.render(scene!, camera)
}

// 检测webgl 是否可用
async function checkWebGL() {
  const isOk = WebGL.isWebGLAvailable()
  if (!isOk) {
    const warning = WebGL.getWebGLErrorMessage()
    videoEl!.appendChild(warning)
  }
  return isOk
}

// 初始化场景参数
function init() {
  // 初始化场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xA0A0A0)
  // 场景的雾
  // scene.fog = new THREE.Fog(0xA0A0A0, 10, 50)

  // 添加灯光
  addLight()
  // 添加大地
  addGround()

  // 初始化全局时钟
  clock = new THREE.Clock()

  // 初始化相机
  camera = new THREE.PerspectiveCamera()

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  renderer.shadowMap.enabled = true

  // 控制器
  const _orbitControls = new OrbitControls(camera, renderer.domElement)
  _orbitControls.maxPolarAngle = 0.9 * Math.PI / 2
  _orbitControls.minDistance = 6
  _orbitControls.maxDistance = 20

  setFrameSize()

  // 添加渲染器dom元素
  containerEl.appendChild(renderer.domElement)
}

/** 设置容器尺寸 */
function setFrameSize() {
  const { clientWidth, clientHeight } = containerEl
  // console.log(`Container Size: ${clientWidth}x${clientHeight}`)
  renderer!.setSize(clientWidth, clientHeight)
  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()
}

const wallHeight = 3
const wallWidth = 6

/** 增加videoMesh */
function addVideoMesh(group: THREE.Group) {
  // 贴图
  const videoTexture = new THREE.VideoTexture(videoEl)
  videoTexture.colorSpace = THREE.SRGBColorSpace
  // 材质
  const material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.FrontSide })
  // 物体
  const videoGeometry = new THREE.PlaneGeometry(videoEl.videoWidth, videoEl.videoHeight)
  const videoMesh = new THREE.Mesh(videoGeometry, material)
  const wallScale = wallHeight / videoEl.videoHeight
  videoMesh.scale.set(wallScale, wallScale, 1)
  group.add(videoMesh)
  // 相机距离
  camera.position.set(0, 2, 8)
  camera.lookAt(0, 0, 0)
}

/** 增加背景墙 */
function addTV() {
  // 电视背景
  const tvGeometry = new THREE.PlaneGeometry(wallWidth, wallHeight)
  // // 材质-side 双面显示，后期可以叠加一个作为背面的
  const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
  const tvWall = new THREE.Mesh(tvGeometry, material)
  tvWall.position.z = -0.01
  // 创建组，组合电视背景和视频
  const group = new THREE.Group()
  group.add(tvWall)
  group.position.set(0, wallHeight / 2, -1)
  scene!.add(group)
  return group
}

/** 添加光照系统 */
function addLight() {
  // 环境光
  const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 2)
  hemiLight.position.set(0, 200, 0)
  scene!.add(hemiLight)

  // 平行光，为了产生阴影
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 5)
  dirLight.name = 'dirLight'
  dirLight.position.set(0, 3, -2)
  dirLight.castShadow = true
  const d = 1
  dirLight.shadow.camera.left = -d
  dirLight.shadow.camera.right = d
  dirLight.shadow.camera.top = d * 2
  dirLight.shadow.camera.bottom = -d
  dirLight.shadow.camera.far = 10 // 最大值设置10即可
  scene!.add(dirLight)
}

/** 添加地板 */
function addGround() {
  const material = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material)
  ground.name = 'The Ground'
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene!.add(ground)

  const grid = new THREE.GridHelper(10, 10)
  grid.material.opacity = 0.2
  grid.material.transparent = true
  scene!.add(grid)
}

/** 加载模型 */
function addModel() {
  const loader = new FBXLoader()
  loader.loadAsync(fbxModelUrl).then((obj) => {
    // 获取物体的宽度
    const { x, y, z } = new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3())
    // console.log(`模型尺寸：x:${x.toFixed(2)},y:${y.toFixed(2)},z:${z.toFixed(2)}`)
    // 设定的默认高度
    const baseHeight = 4
    // 以高度为基准，计算模型缩放比例
    const scaleVal = baseHeight / y
    // console.log('模型缩放比例：', scaleVal)
    // 缩放模型
    obj.scale.set(scaleVal, scaleVal, scaleVal)
    obj.position.z = 1
    // 设置模型摆放位置在场景中心
    // obj.position.set(-x / 2, 0, z / 2)

    obj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.isMesh)
        child.castShadow = true
    })

    scene!.add(obj)

    // 加载动画
    const [clip] = obj.animations
    if (!clip) {
      ElMessage.info('当前模型未检测到动画帧')
      return
    }
    const mixer = new THREE.AnimationMixer(obj)
    objAction = mixer.clipAction(clip)
    registerVideoEvent()
  })
}

function registerVideoEvent() {
  const playing = false
  // 视频播放时，开始动画
  videoEl.onplay = () => objAction.play()
  videoEl.onplaying = () => objAction.paused = false
  videoEl.onpause = () => objAction.paused = true
  // 视频播放完毕后需要主动调用停止播放
  videoEl.onended = () => objAction.stop()
  // 视频播放速度变化，设置控制器的时间比例
  videoEl.onratechange = () => objAction.timeScale = videoEl.playbackRate
  videoEl.onseeking = () => objAction.paused = true
  videoEl.onseeked = () => objAction.time = videoEl.currentTime
}

export function loadFbx(container: HTMLDivElement, video: HTMLVideoElement, fbxPath: string) {
  containerEl = container
  videoEl = video
  fbxModelUrl = getFilePath(fbxPath, 'fbx')

  return checkWebGL().then(() => {
    init()
    // 初始化后开始执行动画(场景更新)
    animate()
    // 添加电视墙
    const group = addTV()
    // 等待视频媒体信息确认后加载视频
    videoEl.onloadedmetadata = () => addVideoMesh(group)
    // 添加模型
    addModel()
    window.addEventListener('resize', setFrameSize)
  })
}

export function unloadFbx() {
  if (scene)
    scene.clear()
  if (renderer)
    renderer.dispose()
  scene = null
  renderer = null
  window.removeEventListener('resize', setFrameSize)
}
