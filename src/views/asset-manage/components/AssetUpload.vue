<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadFile, UploadInstance, UploadProgressEvent, UploadProps, UploadRawFile, UploadRequestOptions } from 'element-plus'
import { ElMessage, genFileId } from 'element-plus'
import { FileChunkSize } from '../composable/constant'
import type { FilePart } from '@/utils/file.util'
import { getSliceFileMd5, getVideoDuration } from '@/utils/file.util'
import { FileUploadService } from '@/http/services/FileUploadService'
import type { PartUploadInput } from '@/http/models/upload.model'

const uploadService = new FileUploadService()

const showDialog = ref(false)
const uploadRef = ref<UploadInstance>()
const uploadLoading = ref(false)

// 文件长度
const duration = ref(0)
// 是否可以点击提交
const canSubmit = ref(false)

// 文件改变的回调事件
const handleChange: UploadProps['onChange'] = (file) => {
  canSubmit.value = false
  if (file.status === 'ready') {
    if (/(.mp4)/i.test(file.name)) {
      getVideoDuration(file.raw!)
        .then((d) => {
          duration.value = d
          if (d > 30)
            ElMessage.warning('选择的文件时长超过30s')
          else
            canSubmit.value = true
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

function uploadWithAnalysis() {
  uploadRef.value!.submit()
}

// 自定义上传功能
async function uploadRequest(options: UploadRequestOptions) {
  const file = options.file
  const onProgressChange = (percent: number) => options.onProgress({ percent } as UploadProgressEvent)

  // 切片数据
  let filePartList: FilePart[] = []

  // 文件切片，并获取MD5
  try {
    const { md5, fileParts } = await getSliceFileMd5(file, FileChunkSize, onProgressChange)
    // 暂存文件片段
    filePartList = fileParts
    const res = await uploadService.preUpload({
      fileSize: file.size,
      originFileName: file.name,
      md5,
      parentId: 0,
    })
    if (res.fileExists)
      throw new Error('文件已存在')
    const uploadFileId = res.uploadFileId
    return ({ uploadFileId, filePartList })
  }
  catch (err: any) {
    const message = err.message ?? '上传出错'
    options.onError({ message } as any)
    ElMessage.error(message)
  }
}

// 预上传成功处理
function onPreUploadSuccess(res: { uploadFileId: string; filePartList: FilePart[] }) {
  ElMessage.success('文件秒传成功,开始解析')
  uploadLoading.value = true
  const task = res.filePartList.map((item) => {
    const uploadInput: PartUploadInput = {
      segmentSize: item.size.toString(),
      uploadFileId: res.uploadFileId,
      file: item.part,
      segmentIndex: (item.index + 1).toString(),
    }
    return uploadService.partUpload(uploadInput)
  })
  Promise.all(task)
    .then(() => {
      ElMessage.success('文件解析成功')
      showDialog.value = false
      // 清除文件列表
      uploadRef.value!.clearFiles()
    })
    .catch(({ msg }) => ElMessage.error(msg))
    .finally(() => uploadLoading.value = false)
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
        ref="uploadRef" :http-request="uploadRequest" drag :limit="1" accept=".mp4" :auto-upload="false"
        :on-change="handleChange" class="aseet-upload-controller" :on-exceed="handleExceed" list-type="picture-card" :on-success="onPreUploadSuccess"
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
          <div class="upload-file-cover" :class="[duration > 30 ? 'limited' : '']">
            <icon-park-outline-check-correct v-if="file.status === 'success'" class="upload-file-icon--success" />
            <icon-park-outline-movie class="upload-file-icon--tag" />
          </div>
          <el-progress
            v-if="file.status === 'uploading'" type="circle" :stroke-width="6"
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
            <div v-if="file.status === 'ready'" class="upload-file-actions">
              <icon-park-outline-delete class="upload-file-icon--delete" @click="handleRemove(file)" />
            </div>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <!-- <el-button type="primary" plain :disabled="!canSubmit" @click="upload">
          仅上传
        </el-button> -->
        <el-button type="primary" :disabled="!canSubmit" :loading="uploadLoading" @click="uploadWithAnalysis">
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
    &.el-upload-list--picture-card {
      --el-upload-list-picture-card-size: 220px;

    }

    .el-upload-list__item {
      @apply flex flex-col mr-4 mb-4;
    }

    .el-upload--picture-card {
      --el-upload-picture-card-size: var(--el-upload-list-picture-card-size);
      border: none;
    }
  }

  .upload-file {

    &-icon {
      &--tag {
        @apply text-4xl;
      }

      &--success {
        @apply absolute text-xl top-0 right-0 text-green-600;
      }

      &--delete {
        @apply text-red-400 cursor-pointer hover:text-red-500;
      }
    }

    &-cover {
      @apply h-36 bg-gray-200 flex justify-center items-center relative;
      &.limited {
        @apply bg-red-100;
      }
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
  }
}
</style>
