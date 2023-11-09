<script lang="ts" setup>
import HeaderAction from './HeaderAction.vue'
</script>

<template>
  <div class="layout-header">
    <icon-park-outline-brain class="sys-log" />
    <span class="sys-name">特赛发</span>
    <HeaderAction class="flex-1" />
  </div>
</template>

<style lang="less" scoped>
.layout-header {
  @apply h-full flex items-center;

  .sys-log {
    transform: rotateY(180deg);
    color: var(--el-color-primary-light-3);
    @apply align-bottom inline-block text-4xl;
  }

  .sys-name {
    @apply ml-2 text-2xl font-bold;
  }
}
</style>
