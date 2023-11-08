<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import HeaderAction from './HeaderAction.vue'
import workspaceRoutes from '@/router/routes/workspace.routes'

const currentRoute = useRoute()

const title = ref('')

watch(() => currentRoute.path, () => {
  const menuPath = currentRoute.meta?.menuPath
  if (menuPath)
    title.value = workspaceRoutes.find(x => x.path === menuPath)?.meta?.title ?? ''
  else
    title.value = currentRoute.meta?.title ?? ''
}, { immediate: true })
</script>

<template>
  <div class="layout-header">
    <icon-park-outline-brain class="sys-log" />
    <span class="sys-name">特赛发</span>
    <div class="sys-title">
      {{ title }}
    </div>
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

  .sys-title {
    color: @color-primary;
    box-shadow: 0px 0px 6px 0px #F0F3F7, 0px 4px 4px 0px rgba(157, 113, 255, 0.08);
    @apply ml-10 rounded-3xl px-3 py-1 text-sm;
  }
}
</style>
