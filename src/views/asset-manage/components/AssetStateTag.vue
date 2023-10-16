<script lang="ts" setup>
import { computed } from 'vue'
import { AssetStatusDict, TagColors } from '@/config/constant'

const props = defineProps<{
  state: number
  reason?: string
}>()

const current = computed(() => TagColors[props.state])
const tagLabel = computed(() => AssetStatusDict.find(x => x.key === props.state)?.label ?? '--')
</script>

<template>
  <div class="component asset-state-tag" :style="{ backgroundColor: current[0], color: current[1] }">
    <div class="asset-state-tag-text" :title="reason">
      {{ tagLabel }} {{ reason }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-state-tag {
  @apply flex items-center p-1 rounded-tr rounded-br overflow-hidden;

  &-text {
    @apply truncate text-sm block mr-2;
  }
}
</style>
