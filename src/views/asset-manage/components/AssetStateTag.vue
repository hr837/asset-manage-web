<script lang="ts" setup>
import { computed } from 'vue'
import { AssetStatusDict, TagColors } from '@/config/constant'

const props = defineProps<{
  state: number
  reason?: string
}>()

const current = computed(() => TagColors[props.state])
const tagLabel = computed(() => AssetStatusDict.find(x => x.key === props.state)?.label ?? '--')
const backgroundColor = computed(() => `${current.value[0]}CC`)
</script>

<template>
  <div class="component asset-state-tag" :style="{ backgroundColor, color: current[1] }">
    <div class="asset-state-tag-text" :title="reason">
      {{ tagLabel }} {{ reason }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-state-tag {
  @apply flex items-center p-px rounded-tr rounded-br overflow-hidden;

  &-text {
    @apply truncate text-sm block mr-2;
  }
}
</style>
