<script lang="ts" setup>
import { reactive } from 'vue'
import UploadDescription from './components/UploadDescription.vue'
import UploadVideoItem from './components/UploadVideoItem.vue'

const model = reactive({
  name: '',
})
</script>

<template>
  <div class="page video-upload">
    <UploadDescription class="row-span-2" />

    <div class="video-upload-right">
      <el-upload :auto-upload="false" drag :limit="5" accept=".mp4">
        <div class="text-gray-300">
          <icon-park-outline-upload-one class="text-6xl inline-block" />
          <div>
            点击/拖拽至此处添加视频<br>
            限定格式:MP4
          </div>
        </div>
        <template #file="{ file }">
          <UploadVideoItem :raw="file.raw" />
        </template>
      </el-upload>

      <div class="video-upload-action">
        <el-button type="primary" plain>
          仅上传
        </el-button>
        <el-button type="primary">
          上传并转换
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.video-upload {
  @apply flex gap-4;

  &-right {
    @apply flex-1 flex flex-col justify-between;
  }

  &-action {
    @apply text-right p-4;
  }

  &-control {
    @apply inline-block;
  }

  :deep(.el-upload-list) {
    .el-upload-list__item {
      margin-bottom: 10px;
    }
  }

}
</style>
