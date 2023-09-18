<script lang="ts" setup>
defineEmits(['play'])
</script>

<template>
  <div class="component asset-video">
    <div class="asset-video-cover">
      <icon-park-solid-play class="asset-video-icon" @click="$emit('play')" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-video{
  height: 150px;
  &-cover{
    @apply h-full bg-gray-200 flex justify-center items-center;
  }
  &-icon{
    @apply h-12 w-12 text-gray-400 hover:text-gray-500 cursor-pointer;
  }
}
</style>
