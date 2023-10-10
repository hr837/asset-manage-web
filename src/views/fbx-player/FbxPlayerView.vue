<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { onMounted, onUnmounted, ref } from 'vue'
import { useAppStore } from '@/store/app.store'
/** 容器实例 */
const containerRef = ref<HTMLDivElement>()
const videoRef = ref<HTMLVideoElement>()
/** 场景 */
let scene: THREE.Scene
/** 相机 */
let camera: THREE.PerspectiveCamera
/** 渲染器 */
let renderer: THREE.WebGLRenderer

let objAction: THREE.AnimationAction
let clock: THREE.Clock

const playing = ref(false)
let _gui: GUI

// 执行动画
function animate() {
  requestAnimationFrame(animate)
  const time = clock.getDelta()
  objAction?.getMixer().update(time)
  renderer.render(scene, camera)
}

// 检测webgl 是否可用
function checkWebGL() {
  if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    init()
    // 初始化后开始执行动画(场景更新)
    animate()
    // addHelp()
    addTV()
    addModel()
  }
  else {
    const warning = WebGL.getWebGLErrorMessage()
    containerRef.value!.appendChild(warning)
  }
}

// 初始化场景参数
function init() {
  // 初始化场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xA0A0A0)
  // 场景的雾
  // scene.fog = new THREE.Fog(0xA0A0A0, 10, 50)

  addLight()
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
  containerRef.value!.appendChild(renderer.domElement)
}

/** 设置容器尺寸 */
function setFrameSize() {
  const { clientWidth, clientHeight } = containerRef.value!
  console.log(`Container Size: ${clientWidth}x${clientHeight}`)
  renderer.setSize(clientWidth, clientHeight)
  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()
}

/** 增加背景墙 */
function addTV() {
  // 平面几何,放大两倍
  const tvGeometry = new THREE.PlaneGeometry(6, 3)
  // 使用video作为贴面材质
  const texture = new THREE.VideoTexture(videoRef.value!)
  texture.colorSpace = THREE.SRGBColorSpace
  // 材质-side 双面显示，后期可以叠加一个作为背面的
  const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture, side: THREE.DoubleSide })
  const tvWall = new THREE.Mesh(tvGeometry, material)
  tvWall.position.set(0, tvGeometry.parameters.height / 2, -2)
  scene.add(tvWall)
}

function addHelp() {
  const axesHelper = new THREE.AxesHelper(100)
  scene.add(axesHelper)
  _gui = new GUI()
}

/** 添加光照系统 */
function addLight() {
  // 环境光
  const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 2)
  hemiLight.position.set(0, 200, 0)
  scene.add(hemiLight)

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
  scene.add(dirLight)
}

/** 添加地板 */
function addGround() {
  const material = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material)
  ground.name = 'The Ground'
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const grid = new THREE.GridHelper(10, 10)
  grid.material.opacity = 0.2
  grid.material.transparent = true
  scene.add(grid)
}

/** 加载模型 */
function addModel() {
  const loader = new FBXLoader()
  loader.loadAsync('/tmp/test-model.fbx').then((obj) => {
    // 获取物体的宽度
    const { x, y, z } = new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3())
    // console.log(`模型尺寸：x:${x.toFixed(2)},y:${y.toFixed(2)},z:${z.toFixed(2)}`)
    // 设置模型摆放位置在场景中心
    obj.position.set(-x / 2, 0, z / 2)

    obj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.isMesh)
        child.castShadow = true
    })

    scene.add(obj)
    // 相机距离
    camera.position.set(0, 4, 10)
    camera.lookAt(0, 0, 0)
    // 加载动画
    const [clip] = obj.animations
    if (!clip) {
      ElMessage.info('当前模型未检测到动画帧')
      return
    }
    const mixer = new THREE.AnimationMixer(obj)
    objAction = mixer.clipAction(clip)
  })
}

onMounted(() => {
  checkWebGL()
  window.addEventListener('resize', setFrameSize)
})

let timerId = 0
onUnmounted(() => {
  window.removeEventListener('resize', setFrameSize)
  window.clearTimeout(timerId)
})

const appStore = useAppStore()
appStore.$onAction((a) => {
  if (a.name === 'setWorkMenuVisible')
    timerId = window.setTimeout(setFrameSize, 1000)
})
function onPlayClick() {
  if (playing.value) {
    videoRef.value!.pause()
    objAction && objAction.stop()
  }
  else {
    videoRef.value!.play()
    objAction && objAction.play()
  }
}
</script>

<template>
  <div ref="containerRef" class="page fbx-player">
    <el-button class="video-control" @click="onPlayClick">
      {{ playing ? '暂停' : '播放' }}
    </el-button>
    <!-- <div id="container" ref="containerRef" /> -->
    <video ref="videoRef" class="fbx-video" src="/tmp/test-video.mp4" loop @play="playing = true" @pause="playing = false" />
  </div>
</template>

<style lang="less" scoped>
.page{
  @apply p-0 rounded overflow-hidden relative;
}
#container{
  // @apply h-full w-full;
}

.fbx-video {
  display: none;
}
.video-control{
  @apply absolute top-2 left-2;
}
</style>
