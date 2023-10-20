<script lang="ts" setup>
import AssetAction from './AssetAction.vue'
import AssetTimeInfo from './AssetTimeInfo.vue'
import AssetStateTag from './AssetStateTag.vue'
import type { AssetActionCommand, AssetInfo } from '@/types/asset-info.type'
import { getDuration, getFilePath } from '@/utils/file.util'

defineProps<{
  data: AssetInfo[]
}>()

defineEmits<{ detail: [id: string]; action: [command: AssetActionCommand, id: string] }>()
</script>

<template>
  <div class="component asset-data-list">
    <template v-for="item of data" :key="item.id">
      <div class="asset-item">
        <div class="asset-item-header">
          <el-tooltip effect="dark" :content="item.name" placement="bottom" popper-class="file-name-popper">
            <div class="asset-item-name" :title="item.name">
              {{ item.name }}
            </div>
          </el-tooltip>
          <AssetAction :status="item.status" @action="e => $emit('action', e, item.id)" />
        </div>
        <div class="asset-item-center" @click="$emit('detail', item.id)">
          <img class="video-cover" :src="getFilePath(item.coverImage, 'image')" alt="视频封面">
          <icon-park-solid-play class="video-play-icon" />
          <AssetStateTag class="asset-item-tag" :state="item.status" :reason="item.message" />
          <div class="video-duration">
            {{ getDuration(item.duration) }}
          </div>
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
    @apply overflow-hidden rounded;

    &-header {
      @apply flex items-center p-2;
    }

    &-center {
      @apply relative h-36 overflow-hidden bg-gray-100 flex justify-center items-center cursor-pointer;

      &:hover .video-play-icon {
        @apply text-gray-400;
      }

      .video-play-icon {
        @apply text-5xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer text-gray-300;
      }

      .video-duration {
        @apply absolute bottom-0 right-0 w-full p-2 pt-4 text-right text-white bg-gradient-to-t from-gray-800/40;
      }

      .video-cover {
        @apply bg-gray-50 h-full w-full object-contain;
      }
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
