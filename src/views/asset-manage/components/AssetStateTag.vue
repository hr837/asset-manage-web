<script lang="ts" setup>
import { computed } from 'vue'
import type { AssetState } from '@/types/asset-info.type'

const props = defineProps<{ state: AssetState }>()

// [背景，前景]
const colors: Record<AssetState, [string, string]> = {
  仅上传: ['#FFF2E5', '#FDC298'],
  排队中: ['#DBF2FF', '#8ED6FF'],
  转换中: ['#D6F8DD', '#77E28E'],
  转换失败: ['#FFE5E5', '#fd9898'],
  转换完成: ['#EAE5FF', '#AA98FD'],
}

const current = computed(() => colors[props.state])
</script>

<template>
  <div class="component asset-state-tag" :style="{ backgroundColor: current[0] }">
    <icon-park-solid-tag-one :style="{ color: current[1] }" />
    <span class="asset-state-tag-text">{{ state }}</span>
  </div>
</template>

<style lang="less" scoped>
.asset-state-tag {
  @apply flex items-center rounded p-1;
  &-text{
    @apply text-sm text-gray-500 block mx-2;
  }
}
</style>
