<script lang="ts" setup>
import AssetAction from './AssetAction.vue'
import AssetStateTag from './AssetStateTag.vue'
import AssetVideo from './AssetVideo.vue'
import AssetTimeInfo from './AssetTimeInfo.vue'
import type { AssetActionCommand, AssetInfo } from '@/types/asset-info.type'

defineProps<{
  data: AssetInfo[]
}>()

defineEmits<{ play: [path:string]; action: [command:AssetActionCommand, id:string] }>()
</script>

<template>
  <div class="component asset-data-list">
    <template v-for="item of data" :key="item.id">
      <div class="asset-item">
        <div class="asset-item-header">
          <AssetStateTag :state="item.status" />
          <div class="asset-item-name">
            {{ item.name }}
          </div>
        </div>
        <AssetTimeInfo v-bind="item" />
        <AssetVideo @play="() => $emit('play', item.sourceFileUrl)" />
        <div class="asset-item-action">
          <AssetAction :status="item.status" @action="e => $emit('action', e, item.id)" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.asset-data-list {
  @apply grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4;

  .asset-item {
    @apply shadow rounded select-none;

    &-header {
      @apply flex items-center p-2 shadow;
    }

    &-name {
      @apply flex-1 font-semibold px-1 truncate;
    }

    &-action {
      @apply flex justify-end items-center px-2 py-1;
    }
  }
}
</style>
