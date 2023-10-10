<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const props = defineProps<{
  /** 视频播放地址 */
  raw: File
}>()

const emit = defineEmits<{ play: [src: string]; error: []; remove: [] }>()

const canvasRef = ref<HTMLCanvasElement>()
const showRefresh = ref(false)

const videoInfo = reactive({
  src: '',
  duration: '--',
  size: '--',
})

onMounted(() => {
  const videoEl = document.createElement('video')
  videoEl.src = URL.createObjectURL(props.raw)
  videoEl.preload = 'auto'
  videoEl.onloadeddata = () => {
    const ctx = canvasRef.value?.getContext('2d')
    if (!ctx)
      return
    const { width, height } = canvasRef.value!
    ctx.drawImage(videoEl, 0, 0, width, height)
    // set value
    videoInfo.src = videoEl.src
    videoInfo.size = getVideoSize(props.raw.size)

    videoInfo.duration = getDuration(videoEl.duration)
  }
  videoEl.onerror = () => {
    ElMessage.error('文件信息不可读取')
    emit('error')
  }
})

// 计算视频长度
function getDuration(duration: number) {
  if (duration < 60) {
    return `${Math.round(duration)}s`
  }
  else {
    const m = Math.round(duration / 60)
    const seconds = duration - m * 60
    const s = Math.round(seconds)
    return `${m}min${s}s`
  }
}

function getVideoSize(size: number) {
  const kb = Math.round(size / 1024)
  if (kb < 1024) {
    return `${kb}KB`
  }
  else {
    const mb = Math.round(size / 1024 / 1024)
    return `${mb}MB`
  }
}

onUnmounted(() => {
  if (videoInfo.src)
    URL.revokeObjectURL(videoInfo.src)
})
</script>

<template>
  <div class="component upload-video-item">
    <div class="video-cover">
      <canvas ref="canvasRef" class="video-cover-canvas" />
      <icon-park-solid-play class="video-cover-icon" @click="$emit('play', videoInfo.src)" />
    </div>
    <div class="video-info">
      <div class="video-info-name">
        {{ raw.name }}
      </div>
      <div class="video-info-inline">
        <div class="video-info-duration">
          视频时长：{{ videoInfo.duration }}
        </div>
        <div class="video-info-size">
          文件大小：{{ videoInfo.size }}
        </div>
      </div>
    </div>
    <div class="video-action">
      <icon-park-outline-delete class="video-action-icon text-red-500" @click="$emit('remove')" />
      <icon-park-outline-refresh v-if="showRefresh" class="video-action-icon text-blue-500" @click="$emit('remove')" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.upload-video-item {
  @apply flex gap-4 rounded shadow;
}

.video-cover {

  @apply bg-gray-200 relative rounded-sm overflow-hidden;

  &-canvas {
    @apply w-20 h-20;
  }

  &-icon {
    @apply text-3xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer text-gray-300 hover:text-gray-500;
  }
}

.video-info {
  @apply flex-1 text-sm ;

  &-inline {
    @apply flex gap-4 text-gray-500 text-xs py-1;
  }

  &-name {
    @apply truncate;
  }
}

.video-action {
  @apply p-2;

  &-icon {
    @apply mt-2 cursor-pointer;
  }

}
</style>
