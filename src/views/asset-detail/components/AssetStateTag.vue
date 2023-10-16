<script lang="ts" setup>
import { computed } from 'vue'
import { AssetStatusDict } from '@/config/constant'

const props = defineProps<{ state: number }>()

// [背景，前景]
const colors: Record<number, [string, string]> = {
  1: ['#FFF2E5', '#FDC298'],
  2: ['#DBF2FF', '#8ED6FF'],
  3: ['#D6F8DD', '#77E28E'],
  4: ['#FFE5E5', '#fd9898'],
  5: ['#EAE5FF', '#AA98FD'],
}

const current = computed(() => colors[props.state])
const tagLabel = computed(() => AssetStatusDict.find(x => x.key === props.state)?.label ?? '--')
</script>

<template>
  <div class="component asset-state-tag" :style="{ backgroundColor: current[0] }">
    <icon-park-solid-tag-one :style="{ color: current[1] }" />
    <span class="asset-state-tag-text">{{ tagLabel }}</span>
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
