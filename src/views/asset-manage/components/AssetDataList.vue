<script lang="ts" setup>
import AssetAction from './AssetAction.vue'
import AssetStateTag from './AssetStateTag.vue'
import AssetVideo from './AssetVideo.vue'
import AssetTimeInfo from './AssetTimeInfo.vue'
import type { AssetInfo } from '@/types/asset-info.type'

defineProps<{
  data: AssetInfo[]
}>()
</script>

<template>
  <div class="component asset-data-list">
    <template v-for="item of data" :key="item.id">
      <div class="asset-item">
        <div class="asset-item-header">
          <AssetStateTag :state="item.state" />
          <div class="asset-item-name">
            {{ item.name }}
          </div>
        </div>
        <AssetTimeInfo />
        <AssetVideo />
        <div class="asset-item-action">
          <AssetAction :state="item.state" />
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
