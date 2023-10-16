<script lang="ts" setup>
import { computed } from 'vue'
import { AssetStatusDict, TagColors } from '@/config/constant'

const props = defineProps<{ status: number }>()

const current = computed(() => TagColors[props.status])
const tagLabel = computed(() => AssetStatusDict.find(x => x.key === props.status)?.label ?? '--')
</script>

<template>
  <div class="component asset-detail-tag">
    <div class="tag-content" :style="{ backgroundColor: current[0], color: current[1] }">
      <icon-park-solid-tag-one class="tag-icon" />
      <span class="tag-text">{{ tagLabel }}</span>
    </div>
    <div class="tag-tail" :style="{ borderColor: current[0] }" />
  </div>
</template>

<style lang="less" scoped>
.asset-detail-tag {
  @apply flex;
}

.tag-content {
  @apply h-10 flex items-center pl-4 pr-3;

  .tag-icon {
    transform: rotateY(180deg);
  }

  .tag-text {
    @apply block ml-1;
  }
}

.tag-tail {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  border-right-color: transparent !important;
}
</style>
