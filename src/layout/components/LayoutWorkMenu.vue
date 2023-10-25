<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'
import { useRoute } from 'vue-router'

withDefaults(defineProps<PropType>(), {
  collapse: false,
})

const route = useRoute()

interface PropType {
  /** 是否折叠菜单 */
  collapse: boolean
}
</script>

<template>
  <el-menu
    :default-active="route.meta.menuPath || route.path" class="component layout-work-menu" router
    :collapse="collapse"
  >
    <el-menu-item index="/index">
      <icon-park-outline-cylinder />
      <template #title>
        <span>资产管理</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/upload">
      <icon-park-outline-upload />
      <template #title>
        <span>上传视频</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less" scoped>
.layout-work-menu {
  @apply h-full overflow-x-hidden overflow-y-auto border-0;

  &:not(.el-menu--collapse) {
    width: 100%;
  }

  --el-menu-item-height: 48px;

  .el-menu-item {
    :deep(.el-menu-tooltip__trigger) {
      justify-content: center;
    }

    span {
      padding-left: 5px;
    }

    &.is-active {
      @apply text-white rounded-lg;
      background-color: @color-primary;
    }
  }
}
</style>
