<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { UploadFile, UploadInstance } from 'element-plus'
import UploadDescription from './components/UploadDescription.vue'
import UploadVideoItem from './components/UploadVideoItem.vue'

const uploadRef = ref<UploadInstance>()
const uploadStart = ref(false)
const transfrom = ref(false)

const playInfo = reactive({
  show: false,
  src: '',
  title: '',
})

// 播放视频
function onPlay(src: string, title: string) {
  playInfo.src = src
  playInfo.title = title
  playInfo.show = true
}

// 关闭播放弹窗
function onPlayerClose() {
  playInfo.src = ''
  playInfo.title = ''
  playInfo.show = false
}

// 点击上传文件按钮
function onUploadClick(trans = false) {
  uploadStart.value = true
  transfrom.value = trans
}

// 单个文件上传成功
function onFileuploadSuccess(file: UploadFile) {
  ElMessage.success(`${file.name}上传成功`)
  uploadRef.value?.handleRemove(file)
}

interface FileListItem {
  uid: number
  canSubmit: boolean
  uploaded: boolean
}
const fileList = ref<FileListItem[]>([])

/** 选择的文件发生改变 */
function onUploadFileChange(file: UploadFile) {
  fileList.value.push({
    uid: file.uid,
    canSubmit: /(.mp4)/i.test(file.name),
    uploaded: false,
  })
}

/** 选择的文件发生错误 */
function onFileError(file: UploadFile) {
  const fileInfo = fileList.value.find(x => x.uid === file.uid)
  fileInfo!.canSubmit = false
}

/** 删除一个文件 */
function onRemoveClick(file: UploadFile) {
  const fileIndex = fileList.value.findIndex(x => x.uid === file.uid)
  fileList.value.splice(fileIndex)
  uploadRef.value!.handleRemove(file)
}

const canSubmit = computed(() => {
  const hasFile = fileList.value.length > 0
  const hasError = fileList.value.some(x => !x.canSubmit)
  return hasFile && !hasError
})
</script>

<template>
  <div class="page video-upload">
    <UploadDescription class="row-span-2" />

    <div class="video-upload-right">
      <el-upload
        ref="uploadRef" :auto-upload="false" drag :limit="5" accept=".mp4" :disabled="uploadStart"
        :on-change="onUploadFileChange"
      >
        <div class="text-gray-300">
          <icon-park-outline-upload-one class="text-6xl inline-block" />
          <div>
            点击/拖拽至此处添加视频<br>
            限定格式:MP4，单次最多传5个
          </div>
        </div>
        <template #file="{ file }">
          <UploadVideoItem
            :start="uploadStart" :transfrom="transfrom" :raw="file.raw"
            @play="src => onPlay(src, file.name)" @success="() => onFileuploadSuccess(file)"
            @remove="() => onRemoveClick(file)" @error="() => onFileError(file)"
          />
        </template>
      </el-upload>

      <div class="video-upload-action">
        <el-button type="primary" plain :disabled="!canSubmit" @click="() => onUploadClick()">
          仅上传
        </el-button>
        <el-button type="primary" :disabled="!canSubmit" @click="() => onUploadClick(true)">
          上传并转换
        </el-button>
      </div>
    </div>

    <!-- video player -->
    <el-dialog
      v-model="playInfo.show" :title="playInfo.title" :close-on-click-modal="false"
      :close-on-press-escape="false" @closed="onPlayerClose"
    >
      <video
        :src="playInfo.src" class="video-player" autoplay controls
        controlslist="nodownload noremoteplayback nofullscreen noplaybackrate " disablepictureinpicture
      />
    </el-dialog>
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

  :deep(.el-dialog) {
    .el-dialog__body {
      @apply flex justify-center items-center p-0;
    }
  }

  .video-player {
    height: 500px;
    width: 100%;
  }

}
</style>
