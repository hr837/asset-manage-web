<script lang="ts" setup>
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { onMounted, ref } from 'vue'

/** 容器实例 */
const containerRef = ref<HTMLDivElement>()
const videoRef = ref<HTMLVideoElement>()
/** 场景 */
let scene: THREE.Scene
/** 相机 */
let camera: THREE.PerspectiveCamera
/** 渲染器 */
let renderer: THREE.WebGLRenderer

let tvWall: THREE.Object3D

const playing = ref(false)
let gui: GUI

// 执行动画
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

// 检测webgl 是否可用
function checkWebGL() {
  if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    init()
    // 初始化之开始执行动画
    animate()
    addHelp()
    addGround()
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
  const domWidth = containerRef.value!.clientWidth
  const domHeight = containerRef.value!.clientHeight

  // 初始化场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xA0A0A0)
  scene.fog = new THREE.Fog(0xA0A0A0, 10, 50)

  const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x8D8D8D, 3)
  hemiLight.position.set(0, 20, 0)
  scene.add(hemiLight)

  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 3)
  dirLight.position.set(-3, 10, -10)
  dirLight.castShadow = true
  dirLight.shadow.camera.top = 2
  dirLight.shadow.camera.bottom = -2
  dirLight.shadow.camera.left = -2
  dirLight.shadow.camera.right = 2
  dirLight.shadow.camera.near = 0.1
  dirLight.shadow.camera.far = 40
  scene.add(dirLight)

  // 初始化相机
  camera = new THREE.PerspectiveCamera()
  // 设置相机长宽比
  camera.aspect = domWidth / domHeight

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer()
  // 设置渲染器的大小
  renderer.setSize(domWidth, domHeight)
  // 控制器
  const orbitControls = new OrbitControls(camera, renderer.domElement)

  // 添加渲染器dom元素
  containerRef.value!.appendChild(renderer.domElement)
}

/** 增加背景墙 */
function addTV() {
  // 平面几何,放大两倍
  const tvGeometry = new THREE.PlaneGeometry(4, 3)
  // 使用video作为贴面材质
  const texture = new THREE.VideoTexture(videoRef.value!)
  texture.colorSpace = THREE.SRGBColorSpace
  // 材质-side 双面显示，后期可以叠加一个作为背面的
  const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture, side: THREE.DoubleSide })
  tvWall = new THREE.Mesh(tvGeometry, material)
  tvWall.position.y = tvGeometry.parameters.height / 2
  scene.add(tvWall)
}

function addHelp() {
  const axesHelper = new THREE.AxesHelper(100)
  scene.add(axesHelper)
  gui = new GUI()
}

/** 添加地板 */
function addGround() {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xCBCBCB, depthWrite: false }))
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  scene.add(mesh)
}

/** 加载模型 */
function addModel() {
  const loader = new FBXLoader()
  loader.loadAsync('/tmp/test-model.fbx').then((obj) => {
    // 获取物体的宽度
    const { x } = new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3())
    obj.position.set(-x / 2, 0, 3)
    scene.add(obj)
    scene.scale.multiplyScalar(2)
    // 相机距离
    camera.position.set(6, 6, 20)
    camera.lookAt(0, 0, 0)
  })
}

onMounted(() => {
  checkWebGL()
})

function onPlayClick() {
  if (playing.value)
    videoRef.value!.pause()
  else
    videoRef.value!.play()
}
</script>

<template>
  <div class="page fbx-player">
    <el-button class="video-control" @click="onPlayClick">
      {{ playing ? '暂停' : '播放' }}
    </el-button>
    <div id="container" ref="containerRef" />
    <video ref="videoRef" class="fbx-video" src="/tmp/test-video.mp4" loop />
  </div>
</template>

<style lang="less" scoped>
.page{
  @apply p-0 rounded overflow-hidden relative;
}
#container{
  @apply h-full w-full;
}

.fbx-video {
  display: none;
}
.video-control{
  @apply absolute top-2 left-2;
}
</style>
