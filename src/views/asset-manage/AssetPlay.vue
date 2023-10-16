<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { SessionKey_Asset_PLAY_PATH } from './composable/constant'

const url = ref<string | null>(null)
const hasError = ref(false)

onMounted(() => {
  url.value = sessionStorage.getItem(SessionKey_Asset_PLAY_PATH)
})
</script>

<template>
  <div class="page asset-play">
    <video v-if="url && !hasError" class="asset-play-video" :src="`/asset/video/${url}`" controls @error="hasError = true" />
    <el-empty v-else description="视频资源不见了" />
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
