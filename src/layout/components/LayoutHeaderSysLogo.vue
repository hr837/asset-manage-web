<script lang="ts" setup>
</script>

<template>
  <div class="layout-header-logo">
    <icon-park-outline-brain class="sys-log" />
    <span class="sys-name">特赛发</span>
  </div>
</template>

<style lang="less" scoped>
.layout-header-logo {
  @apply bg-white;
  height: 60px;
  line-height: 60px;
  width: 258px;

  .sys-log {
    transform: rotateY(180deg);
    color: var(--el-color-primary-light-3);
    width: 64px;
    @apply align-bottom inline-block text-4xl;
  }

  .sys-name {
    @apply align-text-top text-2xl font-bold px-2;
  }

}
</style>
