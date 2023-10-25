<script lang="ts" setup>
import { computed } from 'vue'
import type { AssetActionCommand } from '@/types/asset-info.type'

const props = defineProps<{ status: number }>()
defineEmits<{ action: [command: AssetActionCommand] }>()

const canDownload = computed(() => props.status === 5)
const canTransform = computed(() => props.status === 1 || props.status === 4)
</script>

<template>
  <el-dropdown
    class="component asset-action" trigger="click" popper-class="asset-action-popper"
    @command="(e: AssetActionCommand) => $emit('action', e)"
  >
    <icon-park-outline-more class="action-icon" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="download">
          <icon-park-outline-download class="mr-1" />
          下载MP4文件
        </el-dropdown-item>
        <el-dropdown-item :disabled="!canDownload" divided command="downloadFbx">
          <icon-park-outline-database-download class="mr-1" />
          下载FBX文件
        </el-dropdown-item>
        <el-dropdown-item :disabled="!canTransform" divided command="transfrom">
          <icon-park-outline-effects class="mr-1" />
          转换文件
        </el-dropdown-item>
        <el-dropdown-item divided command="delete">
          <icon-park-outline-delete class="mr-1" />
          删除文件
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="less" scoped>
.action-icon {
  @apply text-xl text-gray-400 focus:outline-dashed outline-1 outline-gray-300 hover:text-violet-500;
}
</style>

<style lang="less">
.asset-action-popper {
  .el-dropdown-menu__item--divided {
    @apply m-0;
  }
}
</style>
