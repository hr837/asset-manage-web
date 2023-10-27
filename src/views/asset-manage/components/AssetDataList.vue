<script lang="ts" setup>
import AssetAction from './AssetAction.vue'
import AssetTimeInfo from './AssetTimeInfo.vue'
import AssetStateTag from './AssetStateTag.vue'
import type { AssetActionCommand, AssetInfo } from '@/types/asset-info.type'
import { getFilePath } from '@/utils/file.util'
import { getVideoDuration } from '@/utils/date.util'

defineProps<{
  data: AssetInfo[]
}>()

const emit = defineEmits<{
  detail: [id: string]
  action: [command: AssetActionCommand, id: string]
}>()
</script>

<template>
  <div class="component asset-data-list">
    <template v-for="item of data" :key="item.id">
      <div class="asset-item" @click="$emit('detail', item.id)">
        <div class="asset-item-header">
          <el-tooltip effect="dark" :content="item.name" placement="bottom" popper-class="file-name-popper">
            <div class="asset-item-name" :title="item.name">
              {{ item.name }}
            </div>
          </el-tooltip>
          <div @click="e => e.stopPropagation()">
            <AssetAction :status="item.status" @action="cmd => emit('action', cmd, item.id)" />
          </div>
        </div>
        <div class="asset-item-center">
          <img v-if="item.coverImage" class="video-cover" :src="getFilePath(item.coverImage, 'image')" alt="视频封面">
          <div class="video-mask">
            <AssetStateTag class="asset-item-tag" :state="item.status" :reason="item.message" />
            <icon-park-solid-play-one class="video-play-icon" />
            <div class="video-duration">
              {{ getVideoDuration(item.duration) }}
            </div>
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
  row-gap: 20px;
  @apply grid grid-cols-4;

  .asset-item {
    box-shadow: var(--el-box-shadow-lighter);
    @apply overflow-hidden rounded cursor-pointer;

    &-header {
      @apply flex items-center p-2;
    }

    &-center {
      padding-bottom: 56%;
      @apply relative h-0 w-full overflow-hidden bg-white flex justify-center items-center select-none;

      .video-mask {
        @apply absolute top-0 left-0 w-full h-full bg-black/20 flex flex-col justify-between items-center;
      }

      .video-play-icon {
        @apply text-4xl text-white;
      }

      .video-duration {
        @apply w-full text-sm px-2 pt-4 pb-px text-right text-white bg-gradient-to-t from-gray-600/20;
      }

      .video-cover {
        @apply absolute top-0 left-0 bottom-0 right-0 bg-gray-50 h-full w-full object-cover;
      }
    }

    &-name {
      @apply flex-1 text-gray-700 font-semibold truncate;
    }

    &-tag {
      max-width: 100%;
      @apply mt-4 self-start;
    }

    &-action {
      @apply flex justify-end items-center px-2 py-1;
    }
  }

  .asset-time-info {
    height: 48px;
  }

}
</style>
