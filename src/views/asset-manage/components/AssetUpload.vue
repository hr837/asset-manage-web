<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadFile, UploadFiles, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'

const showDialog = ref(true)
const uploadRef = ref()
const duration = ref(0)

// 获取video文件的时长
function getVideoDuration(file: UploadRawFile) {
  const url = URL.createObjectURL(file)
  // 内存创建视频对象
  const video = document.createElement('video')
  return new Promise<number>((resolve) => {
    video.src = url
    video.oncanplay = () => {
      resolve(Math.round(video.duration))
    }
    video.onerror = () => {
      ElMessage.error('文件时长不可读取')
      resolve(0)
    }
  }).finally(() => {
    // 始终释放资源
    URL.revokeObjectURL(url)
  })
}

// 文件改变的回调事件
function onFileChange(file: UploadFile, uploadFiles: UploadFiles) {
  if (file.status === 'ready') {
    if (/(.mp4)/i.test(file.name)) {
      getVideoDuration(file.raw!).then(d => duration.value = d)
    }
    else {
      ElMessage.error('请选择MP4格式的文件')
      uploadFiles.pop()
    }
  }
}

// 手动删除文件
function handleRemove(file: UploadFile) {
  uploadRef.value.handleRemove(file)
  duration.value = 0
}

function upload() {

}

function uploadWithAnliase() {

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
        ref="uploadRef" drag :limit="1" accept=".mp4" :auto-upload="false"
        :on-change="onFileChange" class="aseet-upload-controller"
      >
        <div class="upload-description">
          <icon-park-outline-upload-one class="text-6xl text-gray-300 inline-block" />
          <div class="text-gray-400 text-md">
            点击/拖拽至此处添加视频<br>
            限定格式:MP4,时长不超过30秒.
          </div>
        </div>
        <template #file="{ file }">
          <div class="upload-file-cover">
            <icon-park-outline-movie class="text-4xl" />
          </div>
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
    @apply grid grid-cols-3 gap-3;

    .el-upload-list__item {
      @apply border rounded;
    }
  }

  .upload-file {

    &-cover {
      @apply h-32 bg-gray-200 flex justify-center items-center;
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
      @apply text-xs text-gray-400 ;
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
