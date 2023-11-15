<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const openedMenus = ['ai', 'virtual']
</script>

<template>
  <el-menu
    :default-active="route.meta.menuPath || route.path" class="component layout-work-menu" router
    :default-openeds="openedMenus" text-color="#666"
  >
    <el-sub-menu index="ai">
      <template #title>
        <icon-park-outline-adobe-illustrate />
        <span>AI动捕</span>
      </template>
      <el-menu-item index="/index">
        <icon-park-solid-data />
        <template #title>
          <span>资产管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/upload">
        <icon-park-solid-inbox-upload-r />
        <template #title>
          <span>上传视频</span>
        </template>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="virtual">
      <template #title>
        <icon-park-outline-people />
        <span>虚拟人</span>
      </template>
      <el-menu-item index="/digital">
        <icon-park-solid-at-sign />
        <template #title>
          <span>数字中心</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/zone">
        <icon-park-solid-arena />
        <template #title>
          <span>创作空间</span>
        </template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style lang="less" scoped>
.layout-work-menu {
  @apply h-full overflow-x-hidden overflow-y-auto border-0 py-4 px-2;

  .iconify {
    @apply mr-2;
  }

  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      @apply rounded;
    }

    &.is-active {
      .el-sub-menu__title {
        --el-menu-text-color: @color-primary;
      }
    }
  }

  .el-menu-item {
    @apply rounded my-1;

    &.is-active {
      --el-menu-active-color: @color-primary;
      @apply bg-violet-100;
    }
  }
}
</style>
