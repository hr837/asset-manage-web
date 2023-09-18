<script lang="ts" setup>
import { ref } from 'vue'

const url = ref('/tmp/demo.mp4')
</script>

<template>
  <div class="page asset-play">
    <video class="asset-play-video" :src="url" controls />
  </div>
</template>

<style lang="less" scoped>
.asset-play{
  @apply flex justify-center items-center;
  &-video{
    @apply h-full py-4;
  }
}
</style>
