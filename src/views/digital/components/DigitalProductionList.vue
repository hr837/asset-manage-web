<script lang="ts" setup>
import DigitalPhotoCard from './DigitalPhotoCard.vue'
import type { QueryImageListOutput } from '@/http/models/asset-image.model'
import { getFilePath } from '@/utils/file.util'
import { AssetStatus } from '@/types/common-enum'

defineProps<{
  data: QueryImageListOutput[]
}>()
</script>

<template>
  <div class="component digital-production-list">
    <template v-for="item of data" :key="item.id">
      <DigitalPhotoCard :label="item.name" :image="getFilePath(item.sourceFileUrl, 'image', '/data/')">
        <template #extra>
          <el-button type="danger" text>
            <icon-park-outline-redo class="mr-1" />
            重新生成
          </el-button>
          <el-button :type="item.status === AssetStatus.SUCCESSFUL ? 'primary' : 'info'" text :disabled="item.status !== AssetStatus.SUCCESSFUL">
            <icon-park-outline-redo class="mr-1" />
            开始下载
          </el-button>
        </template>
      </DigitalPhotoCard>
    </template>
  </div>
</template>

<style lang="less" scoped>
.digital-production-list {
  @apply grid grid-cols-4 gap-3;
}
</style>
