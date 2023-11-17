<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  modelValue: boolean
  /** 标题 */
  title: string
  /** 视频地址 */
  url: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const videoRef = ref<HTMLVideoElement>()

function onClose() {
  videoRef.value!.pause()
  emit('update:modelValue', false)
}
</script>

<template>
  <el-dialog modal-class="digital-video-player" :model-value="modelValue" :title="title" width="800px" align-center @close="onClose">
    <video
      ref="videoRef" class="video-player" :src="url" controls controlslist="nodownload noremoteplayback"
      disablePictureInPicture
    />
  </el-dialog>
</template>

<style lang="less">
.digital-video-player {
  .el-dialog__body {
    @apply p-0;
  }

  .video-player {
    @apply h-128 bg-black w-full overflow-hidden;
  }
}
</style>
