<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  /** 视频源地址 */
  src: string
  /** 是否禁用 */
  disabled?: boolean
}>()

const emit = defineEmits<{
  /** 获取到视频时长 */
  duration: [duration: number]
  /** 播放点击事件 */
  play: []
  /** 加载失败 */
  error: []
}>()

const durationStr = ref('')
const showError = ref(false)

function onLoaded(e: Event) {
  showError.value = false
  const videoEl = e.target as HTMLVideoElement
  const duration = videoEl.duration
  durationStr.value = getDuration(duration)
  emit('duration', duration)
}

function onLoadError() {
  showError.value = true
  emit('error')
}

/** 计算视频长度 */
function getDuration(duration: number) {
  if (duration < 60) {
    return `${Math.round(duration)}s`
  }
  else {
    const m = Math.round(duration / 60)
    const seconds = duration - m * 60
    const s = Math.ceil(seconds)
    return `${m}min${s}s`
  }
}
</script>

<template>
  <div class="component video-cover" :class="{ fail: showError }">
    <template v-if="!showError">
      <video class="video-player" preload="metadata" :src="src" @loadeddata="onLoaded" @error="onLoadError" />
      <div class="video-cover-mask">
        <icon-park-solid-play v-if="!disabled" class="video-play-icon" @click="$emit('play')" />
        <div class="video-info">
          <div class="video-duration">
            {{ durationStr }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.video-cover {
  @apply relative h-full w-full bg-gray-50 flex justify-center items-center;

  &.fail {
    background: url('/public/images/sorry.jpg') no-repeat center;
  }
}

.video-cover-mask {
  @apply absolute top-0 right-0 bottom-0 left-0;

  &:hover {
    @apply bg-black/10;

    .video-play-icon {
      @apply text-white;
    }
  }
}

.video-play-mask {
  @apply hover:bg-black/20;
}

.video-play-icon {
  @apply text-5xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer text-gray-300;
}

.video-info {
  @apply absolute bottom-0 w-full text-right p-1 pt-4 bg-gradient-to-t from-gray-800/40;

  .video-duration {
    @apply text-sm text-white;
  }
}
</style>
