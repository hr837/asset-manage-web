<script lang="ts" setup>
import dayjs from 'dayjs'
import type { AssetTimeInfo } from '@/types/asset-info.type'

defineProps<AssetTimeInfo>()

function formatTimeSpan(times?: string) {
  if (!times)
    return ''
  const d = dayjs(Number.parseInt(times))
  if (!d.isValid())
    return ''
  return d.format('mm分ss秒')
}
</script>

<template>
  <ul class="component asset-time-info">
    <li>
      <span class="info-title">上传时间：</span>
      <span class="info-content">{{ uploadTime }}</span>
    </li>
    <li v-if="status === 2">
      <span class="info-title"> 已排队时长：</span>
      <span class="info-content">{{ formatTimeSpan(lineAlreadyWaitTime) }}</span>
    </li>
    <li v-if="status === 3">
      <span class="info-title">转换已耗时：</span>
      <span class="info-content">{{ formatTimeSpan(convertAlreadyWaitTime) }}</span>
    </li>
    <li v-if="status === 4">
      <span class="info-title">失败时间：</span>
      <span class="info-content">{{ convertTime }}</span>
    </li>
    <li v-if="status === 5">
      <span class="info-title">转换完成时间：</span>
      <span class="info-content">{{ convertTime }}</span>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.asset-time-info {
  @apply px-2 pt-2 text-sm text-gray-400;

  .info-title {
    color: #606266;
  }

  .info-content {
    color: #C0C4CC;
  }
}
</style>
