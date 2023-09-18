<script lang="ts" setup>
import { ref } from 'vue'
import type { AssetState } from '@/types/asset-info.type'

defineEmits<{ 'state-change': [command: AssetState] }>()

const state = ref<AssetState | null>(null)
</script>

<template>
  <el-dropdown class="component asset-query-filter" trigger="click" @command="cmd => $emit('update:modelValue', cmd)">
    <div class="dropdown-controller">
      {{ state || '全部' }}
      <icon-park-outline-down />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="仅上传">
          仅上传
        </el-dropdown-item>
        <el-dropdown-item command="排队中">
          排队中
        </el-dropdown-item>
        <el-dropdown-item command="转换中">
          转换中
        </el-dropdown-item>
        <el-dropdown-item command="转换失败">
          转换失败
        </el-dropdown-item>
        <el-dropdown-item command="转换完成">
          转换完成
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="less" scoped>
.dropdown-controller {
  @apply flex items-center;
  color: @color-primary;
}
</style>
