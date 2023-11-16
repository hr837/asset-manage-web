<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import DigitalPhotoCard from './DigitalPhotoCard.vue'
import type { QueryImageListOutput } from '@/http/models/asset-image.model'
import { AssetStatus } from '@/types/common-enum'
import { getFilePath } from '@/utils/file.util'
const props = defineProps<{
  data: QueryImageListOutput
}>()

const emit = defineEmits<{
  action: [command: 'play' | 'download' | 'delete' | 'generate', id: string]
}>()

const imageSrc = getFilePath(props.data.sourceFileUrl, 'image', '/data/')

function onDeleteClick() {
  if (props.data.status < 4) {
    ElMessage.error('当前作品不能删除')
    return
  }
  ElMessageBox.confirm(`确定要删除草稿【${props.data.name}】吗？`, '删除确认', {
    type: 'warning',
  }).then(() => emit('action', 'delete', props.data.id)).catch(() => { })
}
</script>

<template>
  <DigitalPhotoCard :label="data.name" :image="imageSrc">
    <div class="production-status" :class="{ mask: data.status !== AssetStatus.SUCCESSFUL }">
      <div v-if="data.status === AssetStatus.FAIL" class="text-red-400">
        <icon-park-solid-attention />
        <div>生成失败</div>
      </div>
      <div
        v-else-if="data.status === AssetStatus.SUCCESSFUL" class="is-success"
        @click="$emit('action', 'play', data.id)"
      >
        <icon-park-solid-play-one class=" text-violet-500 text-4xl" />
      </div>
      <div v-else class="text-orange-500">
        <icon-park-solid-hourglass-full />
        生成中
      </div>
    </div>
    <el-button circle type="danger" plain class="card-delete" @click="onDeleteClick">
      <icon-park-outline-delete />
    </el-button>

    <template #extra>
      <div class="extra-button">
        <el-button
          v-if="data.status === AssetStatus.FAIL" type="danger" text
          @click="$emit('action', 'generate', data.id)"
        >
          <icon-park-outline-redo class="mr-1" />
          重新生成
        </el-button>
        <el-button
          v-else-if="data.status === AssetStatus.SUCCESSFUL" type="primary" text
          @click="$emit('action', 'download', data.id)"
        >
          <icon-park-outline-download-four class="mr-1" />
          开始下载
        </el-button>
        <el-button v-else text disabled>
          <icon-park-outline-download class="mr-1" />
          开始下载
        </el-button>
      </div>
    </template>
  </DigitalPhotoCard>
</template>

<style lang="less" scoped>
.production-status {
  @apply absolute h-full w-full flex justify-center items-center;

  &.mask {
    @apply bg-black/50;
  }

  &>div {
    @apply flex flex-col justify-center items-center gap-2;
  }

  .is-success {
    @apply hidden bg-white/80 rounded-full cursor-pointer;
  }
}

.extra-button {
  @apply hidden;

  .el-button {
    @apply h-auto p-0 hover:bg-transparent;
  }
}

.card-delete {
  --el-button-size: 24px;
  @apply absolute hidden text-sm right-1 top-1;
}

.digital-photo-card:hover {

  .is-success,
  .card-delete,
  .extra-button {
    @apply inline-flex;
  }
}
</style>
