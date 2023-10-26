<script lang="ts" setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['success'])
const validated = ref(false)
const text = computed(() => validated.value ? '验证完成' : '请拖拽滑块至右侧，以完成验证')
const left = ref('0px')

/** 是否开始移动 */
let moveStart = false
/** 鼠标按下时候X坐标 */
let startX = 0
/** 容器的宽度 */
let cWidth = 0
/** 滑块宽度 */
let bWidth = 40

function onMouseMoving(e: MouseEvent) {
  if (!startX || !moveStart || validated.value || !bWidth)
    return

  if (!cWidth)
    cWidth = (e.currentTarget as HTMLDivElement).clientWidth

  const { pageX } = e
  const moveX = pageX - startX
  if (moveX < 0)
    return onMouseEnd()

  left.value = `${moveX}px`
  // 最小有300px的宽度，超过300开始计算滑块位置
  // if (moveX > 300) {
  // }
  const rightWidht = cWidth - moveX - bWidth
  // 给与10px的缓冲区间
  if (rightWidht < 5 && rightWidht > -5) {
    validated.value = true
    moveStart = false
    left.value = `${cWidth - bWidth}px`
    emit('success')
  }
}

const failed = ref(false)

/** 开始监听移动 */
function handleStart(e: MouseEvent) {
  if (validated.value)
    return
  failed.value = false
  bWidth = (e.currentTarget as HTMLElement).clientWidth
  cWidth = 0
  moveStart = true
  startX = e.x
}

/** 鼠标离开目标，重置状态 */
function onMouseEnd() {
  if (validated.value)
    return
  if (moveStart)
    failed.value = true
}

function onTransitionend() {
  left.value = '0px'
  moveStart = false
  failed.value = false
}
</script>

<template>
  <div
    class="component drag-verify " :class="{ success: validated, fail: failed }" @mousemove="onMouseMoving"
    @mouseup="onMouseEnd" @mouseleave="onMouseEnd"
  >
    <div class="progress-bar" @transitionend="onTransitionend" />
    <div class="verify-text">
      {{ text }}
    </div>
    <div class="eye" />
    <div class="drag-blcok " @mousedown="handleStart">
      <icon-park-outline-check v-if="validated" />
      <icon-park-outline-double-right v-else />
    </div>
  </div>
</template>

<style lang="less" scoped>
.drag-verify {
  @textColor: #333;
  color: @textColor;
  @apply relative border text-center h-10 leading-10 rounded bg-gray-50 select-none overflow-hidden shadow-inner;

  .progress-bar {
    background-color: @color-primary;
    @apply absolute left-0 top-0 h-full;
    width: v-bind(left);
  }

  .verify-text {
    @apply absolute w-full h-full select-none transition-colors;
  }

  .drag-blcok {
    background-color: @color-primary;
    border-color: @color-primary;
    @apply absolute  text-white w-10 h-full  border  top-0 cursor-move inline-flex justify-center items-center text-xl shadow-sm;
    left: v-bind(left);
  }

  &.success {
    .drag-blcok {
      @apply text-green-500 bg-white border-white cursor-auto;
    }

    .verify-text {
      @apply bg-green-500 text-white;
    }
  }

  &.fail {
    .drag-blcok {
      left: 0;
      transition: left linear 0.3s;
    }

    .progress-bar {
      width: 0;
      background-color: var(--el-color-danger);
      transition: width linear 0.3s;
    }
  }

  &:not(.success, .fail) {
    .verify-text {
      background: linear-gradient(to right, @textColor 20%, #fff 30%, @textColor 40%);
      @apply bg-clip-text text-transparent;
      animation: running 4s infinite;
    }
  }
}

@keyframes running {
  from {
    background-position-x: -100px;
    left: 0;
  }

  to {
    background-position-x: 300px;
  }
}
</style>
