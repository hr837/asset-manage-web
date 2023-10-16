<script lang="ts" setup>
import AssetAction from './AssetAction.vue'
import AssetTimeInfo from './AssetTimeInfo.vue'
import AssetStateTag from './AssetStateTag.vue'
import type { AssetActionCommand, AssetInfo } from '@/types/asset-info.type'
defineProps<{
  data: AssetInfo[]
}>()

defineEmits<{ play: [path: string]; action: [command: AssetActionCommand, id: string] }>()
</script>

<template>
  <div class="component asset-data-list">
    <template v-for="item of data" :key="item.id">
      <div class="asset-item">
        <div class="asset-item-header">
          <div class="asset-item-name" :title="item.name">
            {{ item.name }}
          </div>
          <AssetAction :status="item.status" @action="e => $emit('action', e, item.id)" />
        </div>
        <div class="asset-item-center">
          <VideoCover src="blob:http://localhost:8080/97af0213-dd57-4ea1-b46f-8a8251c9fcc3" />
          <AssetStateTag class="asset-item-tag" :state="item.status" :reason="item.message" />
        </div>

        <AssetTimeInfo v-bind="item" />
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.asset-data-list {
  column-gap: 14px;
  row-gap: 10px;
  @apply grid grid-cols-4;

  .asset-item {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
    @apply overflow-hidden rounded select-none;

    &-header {
      @apply flex items-center p-2;
    }

    &-center {
      @apply relative h-36 bg-gray-100;
    }

    &-name {
      @apply flex-1 text-gray-700 font-semibold truncate;
    }

    &-tag {
      max-width: 100%;
      @apply absolute top-4 left-0;
    }

    &-action {
      @apply flex justify-end items-center px-2 py-1;
    }
  }

  .asset-time-info {
    height: 60px;
  }
}
</style>
