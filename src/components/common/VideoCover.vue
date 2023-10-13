<script lang="ts" setup>
defineProps<{
  /** 资源路径 */
  src: string
}>()
</script>

<template>
  <div class="component video-cover">
    <video :src="src" />
  </div>
</template>

<style lang="less" scoped></style>
