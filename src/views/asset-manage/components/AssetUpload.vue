<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadFile, UploadInstance, UploadProgressEvent, UploadProps, UploadRawFile, UploadRequestOptions } from 'element-plus'
import { ElMessage, genFileId } from 'element-plus'
import { calculateMD5, fileSlice, getVideoDuration } from '@/utils/file.util'

const showDialog = ref(true)
const uploadRef = ref<UploadInstance>()
const duration = ref(0)

// 文件改变的回调事件
const handleChange: UploadProps['onChange'] = (file) => {
  if (file.status === 'ready') {
    if (/(.mp4)/i.test(file.name)) {
      getVideoDuration(file.raw!)
        .then((d) => {
          duration.value = d
          if (d > 30)
            ElMessage.warning('选择的文件时长超过30s')
        })
        .catch((err: Error) => ElMessage.error(err.message))
    }
    else {
      ElMessage.error('请选择MP4格式的文件')
      uploadRef.value!.handleRemove(file)
    }
  }
}

// 重新上传文件时删除原来的文件
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
// 手动删除文件
function handleRemove(file: UploadFile) {
  uploadRef.value!.handleRemove(file)
  duration.value = 0
}

function upload() {
  uploadRef.value!.submit()
}

function uploadWithAnliase() {

}

function uploadRequest(options: UploadRequestOptions) {
  const list = fileSlice(options.file)
  const partPercent = (1 / list.length) * 100
  let totalPercent = 0
  calculateMD5(list.map(x => x.part), (partIndex) => {
    totalPercent += partPercent
    options.onProgress({ percent: totalPercent } as UploadProgressEvent)
  }).then((md5) => {
    console.log(md5)
    options.onSuccess({ md5 })
  })
}
</script>

<template>
  <div class="component asset-upload">
    <el-button type="primary" @click="showDialog = true">
      上传文件
    </el-button>
    <el-dialog
      v-model="showDialog" width="800px" title="上传文件" :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :http-request="uploadRequest" drag :limit="1" accept=".mp4" :auto-upload="false" :on-change="handleChange"
        class="aseet-upload-controller" :on-exceed="handleExceed" list-type="picture-card"
      >
        <div class="upload-description">
          <icon-park-outline-upload-one class="text-6xl text-gray-300 inline-block" />
          <div class="text-gray-400 text-md">
            点击/拖拽至此处添加视频<br>
            限定格式:MP4,<br>
            时长不超过30秒.
          </div>
        </div>
        <template #file="{ file }">
          <div class="upload-file-cover">
            <icon-park-outline-movie class="text-4xl" />
          </div>
          <el-progress
            v-if="file.status === 'uploading'"
            type="circle"
            :stroke-width="6"
            :percentage="Number(file.percentage)"
          />
          <div class="upload-file-bottom">
            <div class="upload-file-info">
              <div class="upload-file-name">
                {{ file.name }}
              </div>
              <div class="upload-file-duration">
                {{ duration }}s
              </div>
            </div>
            <div class="upload-file-actions">
              <icon-park-outline-delete
                class="upload-file-action--delete hover:text-red-500"
                @click="handleRemove(file)"
              />
            </div>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button type="primary" plain @click="upload">
          仅上传
        </el-button>
        <el-button type="primary" @click="uploadWithAnliase">
          上传并解析
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.asset-upload {
  :deep(.el-dialog) {
    .el-dialog {
      &__header {
        @apply text-center border-b mr-0 font-semibold;
      }

      &__title {
        @apply text-gray-600 text-base;
      }
    }

  }

  :deep(.el-upload-list) {
    &.el-upload-list--picture-card{
      --el-upload-list-picture-card-size: 220px;

    }

    .el-upload-list__item {
      @apply flex flex-col mr-4 mb-4;
    }
    .el-upload--picture-card{
      --el-upload-picture-card-size: var(--el-upload-list-picture-card-size);
      border: none;
    }
  }

  .upload-file {

    &-cover {
      @apply h-36 bg-gray-200 flex justify-center items-center;
    }

    &-bottom {
      @apply flex justify-between items-center;
    }

    &-info {
      @apply flex-1 p-1 text-center;
    }

    &-name {
      @apply text-gray-600;
    }

    &-duration {
      @apply text-xs text-gray-400;
    }

    &-actions {
      @apply p-1;
    }

    &-action--delete {
      @apply text-red-400 cursor-pointer;
    }
  }
}
</style>
