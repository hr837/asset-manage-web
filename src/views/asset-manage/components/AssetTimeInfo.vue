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
    <li>上传时间：{{ uploadTime }}</li>
    <li v-if="status === 2">
      已排队时长：{{ formatTimeSpan(lineAlreadyWaitTime) }}
    </li>
    <li v-if="status > 2">
      排队时长：{{ formatTimeSpan(lineTotalTime) }}
    </li>
    <li v-if="status === 3">
      转换已耗时：{{ formatTimeSpan(convertAlreadyWaitTime) }}
    </li>
    <li v-if="status > 3">
      转换耗时：{{ formatTimeSpan(convertTotalTime) }}
    </li>
    <li v-if="status === 4">
      转换失败时间：{{ convertTime }}
    </li>
    <li v-if="status === 5">
      转换完成时间：{{ convertTime }}
    </li>
  </ul>
</template>

<style lang="less" scoped>
.asset-time-info{
  @apply h-20 px-2 pt-2 text-xs text-gray-400 ;
}
</style>
