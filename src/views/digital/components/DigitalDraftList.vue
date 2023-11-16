<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import DigitalPhotoCard from './DigitalPhotoCard.vue'
import type { QueryImageListOutput } from '@/http/models/asset-image.model'
import { getFilePath } from '@/utils/file.util'

defineProps<{
  data: QueryImageListOutput[]
}>()

const emit = defineEmits<{
  action: [command: 'edit' | 'delete' | 'generate', id: string]
}>()

function onDeleteClick(item: QueryImageListOutput) {
  ElMessageBox.confirm(`确定要删除草稿【${item.name}】吗？`, '删除确认', {
    type: 'warning',
  }).then(() => emit('action', 'delete', item.id)).catch(() => { })
}
</script>

<template>
  <div class="component digital-draft-list">
    <template v-for="item of data" :key="item.id">
      <DigitalPhotoCard :label="item.name ?? '作品1'" :image="getFilePath(item.sourceFileUrl, 'image', '/data/')">
        <el-button class="card-edit" circle size="large" @click="$emit('action', 'edit', item.id)">
          <icon-park-outline-edit />
        </el-button>
        <el-button circle type="danger" plain class="card-delete" @click="onDeleteClick(item)">
          <icon-park-outline-delete />
        </el-button>

        <template #extra>
          <el-button text type="primary" class="card-generate" @click="$emit('action', 'generate', item.id)">
            <icon-park-outline-upload-one class="mr-1" />
            开始生成
          </el-button>
        </template>
      </DigitalPhotoCard>
    </template>
  </div>
</template>

<style lang="less" scoped>
.digital-draft-list {
  @apply grid grid-cols-4 gap-3;

  .card-edit {
    --el-button-size: 48px;
    @apply absolute hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 text-2xl;

  }

  .card-delete {
    --el-button-size: 24px;
    @apply absolute hidden text-sm right-1 top-1;
  }

  .card-generate {
    @apply hidden h-auto p-0 hover:bg-transparent;
  }

  .digital-photo-card:hover {

    .card-edit,
    .card-delete,
    .card-generate {
      @apply inline-flex;
    }
  }
}
</style>
