<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, type UploadFile, type UploadInstance } from 'element-plus'
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

interface FileListItem {
  uid: number
  uploaded: boolean
}
const fileList = ref<FileListItem[]>([])

// 单个文件上传成功
function onFileuploadSuccess(file: UploadFile) {
  ElMessage.success(`${file.name}上传成功`)
  const fileInfo = fileList.value.find(x => x.uid === file.uid)
  fileInfo!.uploaded = true
}

/** 选择的文件发生改变 */
function onUploadFileChange(file: UploadFile) {
  if (!/.mp4/i.test(file.name)) {
    ElMessage.error('请选择mp4格式文件')
    uploadRef.value!.handleRemove(file)
    return
  }
  fileList.value.push({
    uid: file.uid,
    uploaded: false,
  })
}

onMounted(() => {
  const el = uploadRef.value!.$el.querySelector('.el-upload') as HTMLDivElement
  el && el.addEventListener('click', checkFileExceed)
})

/** 删除一个文件 */
function onRemoveClick(file: UploadFile) {
  const fileIndex = fileList.value.findIndex(x => x.uid === file.uid)
  fileList.value.splice(fileIndex)
  uploadRef.value!.handleRemove(file)
  if (fileList.value.length === 0)
    uploadStart.value = false
}

// 检测文件数量
function checkFileExceed() {
  const fileLength = fileList.value.length
  if (uploadStart.value && fileLength) {
    ElMessage.info('请先移除上传过的视频')
    return
  }

  if (fileList.value.length >= 5)
    ElMessage.info('最多上传5个视频')
}

const canSubmit = computed(() => {
  const hasFile = fileList.value.length > 0
  const ready = fileList.value.every(x => !x.uploaded)
  return hasFile && ready
})

const disableUpload = computed(() => fileList.value.length >= 5 || uploadStart.value)
</script>

<template>
  <div class="page video-upload">
    <div class="page-content">
      <!-- control -->
      <el-upload
        ref="uploadRef" class="video-upload-control" :auto-upload="false" drag :limit="5" accept=".mp4"
        :disabled="disableUpload" :on-change="onUploadFileChange"
      >
        <el-button type="primary" :disabled="disableUpload" class="action-button px-6">
          上传视频
        </el-button>
        <div class="action-split-line mx-6 h-8 w-0.5 bg-gray-200" />
        <icon-park-outline-upload-one class="action-icon text-gray-300 text-5xl" />
        <div class="action-description text-left ml-4">
          <div class="text-base">
            拖动至此处也可上传
          </div>
          <div class="text-xs text-gray-400 leading-5">
            限定格式:.mp4
          </div>
        </div>

        <template #file="{ file }">
          <UploadVideoItem
            :start="uploadStart" :transfrom="transfrom" :raw="file.raw"
            @play="src => onPlay(src, file.name)" @success="() => onFileuploadSuccess(file)"
            @remove="() => onRemoveClick(file)"
          />
        </template>
      </el-upload>
      <!-- right -->
      <UploadDescription class="video-upload-description" />
      <!-- bottom -->
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
  @apply p-0;

  .page-content {
    width: 1150px;
    @apply p-4 mx-auto grid;
    grid-template: 1fr auto / 830px 1fr;
  }

  &-description {
    margin-left: 20px;
  }

  &-action {
    @apply col-span-2 text-right mt-3 pt-3 border-t;
  }

  // 上传控制器描述
  :deep(.el-upload-dragger) {
    @apply flex justify-center items-center mb-6;
    background-color: #FBFAFF;
  }

  :deep(.el-upload-list) {
    column-gap: 10px;
    row-gap: 14px;
    @apply grid grid-cols-3;

    &__item {
      width: 270px;
      overflow: hidden;
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