<script lang="ts" setup>
import { computed } from 'vue'
import type { AssetTimeInfo } from '@/types/asset-info.type'
import { TagColors } from '@/config/constant'
const props = defineProps<AssetTimeInfo>()

const current = computed(() => TagColors[props.status])
const textColor = computed(() => current.value[1])
const bgColor = computed(() => current.value[0])
</script>

<template>
  <ul class="component asset-time-info">
    <li>
      <span class="info-title">上传时间：</span>
      <span class="info-content">{{ uploadTime }}</span>
    </li>
    <li v-if="status === 2">
      <span class="info-title"> 预计排队耗时：</span>
      <span class="info-content tag">{{ predictLineTime }}</span>
    </li>
    <li v-if="status === 3">
      <span class="info-title">转换进度：</span>
      <span class="info-content tag">{{ processStage || 0 }}%</span>
    </li>
    <li v-if="status === 4">
      <span class="info-title">失败时间：</span>
      <span class="info-content">{{ convertEndTime }}</span>
    </li>
    <li v-if="status === 5">
      <span class="info-title">完成时间：</span>
      <span class="info-content">{{ convertEndTime }}</span>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.asset-time-info {
  @apply px-2 pt-2 text-xs text-gray-400;

  .info-title {
    color: #606266;
  }

  .info-content {
    color: #C0C4CC;

    &.tag {
      @apply rounded px-2;
      color: v-bind(textColor);
      background-color: v-bind(bgColor);
    }
  }
}
</style>
