<script lang="ts" setup>
import { computed } from 'vue'
import type { AssetInfo } from '@/types/asset-info.type'
import { formatTimeSpan } from '@/utils/date.util'

const props = defineProps<AssetInfo>()

const currentStep = computed(() => {
  if (props.status === 3)
    return 4
  if (props.status > 3)
    return 5
  return props.status
})
</script>

<template>
  <div class="component asset-progress">
    <el-steps direction="vertical" :active="currentStep" finish-status="success">
      <el-step title="上传完成">
        <template #description>
          <div>{{ uploadTime }}</div>
        </template>
      </el-step>
      <el-step title="排队中">
        <template #description>
          <div>预计耗时：{{ predictLineTime }}</div>
          <div>实际耗时：{{ formatTimeSpan(lineAlreadyWaitTime) }}</div>
        </template>
      </el-step>
      <el-step title="排队完成">
        <template #description>
          <div>3333</div>
        </template>
      </el-step>
      <el-step title="转换中">
        <template #description>
          <div>预计耗时：{{ predictLineTime }}</div>
          <div>实际耗时：{{ formatTimeSpan(lineAlreadyWaitTime) }}</div>
          <div>转换进度：{{ processStage }}</div>
        </template>
      </el-step>
      <el-step v-if="props.status === 4" title="转换失败" status="error">
        <template #description>
          <div>{{ convertTime }}</div>
          <div>{{ message }}</div>
        </template>
      </el-step>
      <el-step v-else title="转换完成">
        <template #description>
          <div>{{ convertTime }}</div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<style lang="less" scoped>
.asset-progress {
  min-height: 600px;
  @apply p-6;
}

.el-steps {
  --el-color-success: @color-primary;
  display: block;

  :deep(.el-step__description) {
    @apply pt-1 pb-4;
  }
}
</style>
