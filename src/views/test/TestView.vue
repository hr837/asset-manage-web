<script lang="ts" setup>
</script>

<template>
  <div class="page test-view">
    <div class="h1">
      h1
    </div>
    <div class="v1">
      v1
    </div>
    <div class="v2">
      v2
    </div>
  </div>
</template>

<style lang="less" scoped>
.test-view {
  @apply grid overflow-hidden;
  grid-template: 60px 1fr / 200px 1fr;

  .h1 {
    @apply bg-green-400 col-span-2;
  }

  .v1 {
    @apply bg-red-400;
  }

  .v2 {
    @apply bg-violet-400;
  }
}
</style>
