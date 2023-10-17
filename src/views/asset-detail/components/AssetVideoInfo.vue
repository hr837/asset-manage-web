<script lang="ts" setup>
const props = defineProps<{
  name: string
  duration: number
  size: number
  src: string
}>()
</script>

<template>
  <div class="component asset-video-info">
    <div class="video-detail">
      <div class="video-name">
        {{ name }}
      </div>
      <div class="file-info">
        <div class="video-druation">
          视频时长：{{ duration }}
        </div>
        <div class="video-size">
          视频大小：{{ size }}
        </div>
      </div>
    </div>
    <slot />

    <video class="video-player" :src="src" controls controlslist="nodownload noremoteplayback" disablePictureInPicture />
  </div>
</template>

<style lang="less" scoped>
.asset-video-info {
  @apply p-6 flex flex-col;

  .video-name {
    @apply text-2xl text-gray-700 font-semibold;
  }

  .file-info {
    @apply flex gap-8 text-sm text-gray-500 my-4;
  }

  .video-aciton {
    @apply text-right my-5;
  }

  .video-player {
    flex: 1;
    max-width: 100%;
    max-height: 100%;
    justify-self: center;
    align-self: flex-start;
  }
}
</style>
