<script lang="ts" setup>
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { type FilePart, getSliceFileMd5, getVideoSize } from '@/utils/file.util'
import { FileUploadService } from '@/http/services/FileUploadService'
import { getVideoDuration } from '@/utils/date.util'
const props = defineProps<{
  /** 视频播放地址 */
  raw: File
  /** 是否开始上传 */
  start: boolean
  /** 是否需要转换 */
  transfrom: boolean
}>()
const emit = defineEmits<{
  /** 文件播放 */
  play: [src: string]
  /** 发生错误 */
  error: []
  /** 移除文件 */
  remove: []
  /** 文件上传成功 */
  success: []
  /** 文件准备好了。可以上传标识 */
  ready: []
}>()
defineComponent({
  name: 'UploadVideoItem',
})

const videoInfo = reactive({
  src: '',
  durationStr: '',
  duration: 0,
  size: '--',
  fileId: '',
  coverSrc: '',
})

/** 视频封面blob */
let coverBlob: Blob | null = null

onMounted(() => {
  const videoEl = document.createElement('video')
  videoInfo.src = URL.createObjectURL(props.raw)
  videoEl.src = videoInfo.src
  videoEl.preload = 'auto'
  videoEl.onloadedmetadata = () => {
    videoInfo.duration = Math.floor(videoEl.duration)
    videoInfo.durationStr = getVideoDuration(videoEl.duration)
    videoInfo.size = getVideoSize(props.raw.size)
  }
  videoEl.onloadeddata = () => {
    const { videoWidth, videoHeight } = videoEl
    const canvas = document.createElement('canvas')
    canvas.width = videoWidth
    canvas.height = videoHeight
    canvas.getContext('2d')!.drawImage(videoEl, 0, 0, videoWidth, videoHeight)
    videoInfo.coverSrc = canvas.toDataURL()
    canvas.toBlob(blob => coverBlob = blob)
    emit('ready')
  }
  videoEl.onerror = () => {
    ElMessage.error('文件不能播放，请重新选择')
    emit('remove')
  }
})

// 组件卸载清除文件URL资源
onUnmounted(() => {
  if (videoInfo.src)
    URL.revokeObjectURL(videoInfo.src)
})

// 文件上传计算百分比
const calcPrecent = ref(0)
// 上传已完成
const uploaded = ref(false)
// 分片上传中

/** 分片文件上传状态  */
interface FilePartUpload extends FilePart {
  /** 分片是否上传成功 */
  uploaded: boolean
}

watch(() => props.start, (val) => {
  if (!val || uploaded.value)
    return
  upload()
})

const partList = ref<FilePartUpload[]>([])
const uploadService = new FileUploadService()
// 文件上传状态
const uploadStatus = ref<'await' | 'calc' | 'part' | 'success' | 'fail'>('await')
const FileChunkSize = 4194304

/** 开始上传文件 */
async function upload() {
  try {
    // 对文件切片并计算MD5
    uploadStatus.value = 'calc'
    const { md5, fileParts } = await getSliceFileMd5(props.raw, FileChunkSize, (precent: number) => calcPrecent.value = precent)
    // 开始预上传
    const { fastUpload, uploadFileId } = await uploadService.preUpload({
      originFileName: props.raw.name,
      fileSize: props.raw.size,
      duration: videoInfo.duration,
      parentId: 0,
      md5,
      auto: props.transfrom ? 1 : 0,
    })
    // 根据fastupload判断是否上传过
    if (fastUpload)
      return emitSuccess()
    // 生成封面图片文件
    if (coverBlob !== null) {
      const file = new File([coverBlob], `${uploadFileId}.png`, { type: coverBlob.type })
      // 封面上传
      await uploadService.coverUpload({ file, uploadFileId })
    }
    videoInfo.fileId = uploadFileId
    // 分片数据设置
    partList.value = fileParts.map(item => Object.assign(item, { uploaded: false }))
    // 分片上传
    calcPrecent.value = 0
    partUpload()
  }
  catch ({ message, msg }: any) {
    uploadStatus.value = 'fail'
    ElMessage.error(msg ?? message ?? '上传异常')
  }
}

/** 对未上传的分片进行上传 */
function partUpload() {
  uploadStatus.value = 'part'
  // 每份上传进度百分比
  const partPrecent = partList.value.length ** -1 * 100
  // 对未上传的分片进行过滤，并返回分片上传结果
  const uploadTask = partList.value.filter(x => !x.uploaded).map((item) => {
    return uploadService.partUpload({
      uploadFileId: videoInfo.fileId,
      segmentIndex: item.index + 1,
      segmentSize: item.size,
      file: item.part,
    }).then((res) => {
      const originPart = partList.value.find(x => x.index === item.index)!
      // 设置分片上传后的状态
      originPart.uploaded = res.result
      // 设置百分比
      calcPrecent.value += partPrecent
    })
  })
  // 分片批量上传
  Promise.all(uploadTask)
    .then(emitSuccess)
    .catch(() => uploadStatus.value = 'fail')
}

/** 向父组件通知，文件上传成功 */
function emitSuccess() {
  uploaded.value = true
  uploadStatus.value = 'success'
  emit('success')
}

/** 重新尝试上传 */
function onRetryClick() {
  if (!videoInfo.fileId)
    upload()

  else
    partUpload()
}

function progressTextFormat(precent: number) {
  let statusName = ''
  const precentage = `${precent.toFixed(0)}%`
  switch (uploadStatus.value) {
    case 'fail':
      return '上传失败'
    case 'success':
      return '上传成功'
    case 'calc':
      statusName = '视频切片中'
      break
    case 'part':
      statusName = '视频处理中'
      break
    default:
      break
  }
  return precent > 0 ? statusName + precentage : statusName
}

const showPlayIcon = computed(() => uploadStatus.value === 'await' || uploadStatus.value === 'success')
const showDeleteIcon = computed(() => showPlayIcon.value || uploadStatus.value === 'fail')
const showRefresh = computed(() => uploadStatus.value === 'fail')
const showSuccessIcon = computed(() => uploadStatus.value === 'success')
</script>

<template>
  <div class="component upload-video-item">
    <div v-loading="!videoInfo.coverSrc" class="video-container">
      <img class="video-cover" :src="videoInfo.coverSrc" :alt="raw.name">
      <div class="video-mask-base">
        <div v-if="showSuccessIcon" class="video-upload-succss">
          <icon-park-outline-check class="-rotate-45" />
        </div>
        <div class="video-info-duration">
          {{ videoInfo.durationStr }}
        </div>
        <!-- 开始上传，不允许播放 -->
        <icon-park-solid-play-one v-if="showPlayIcon" class="video-aciton-play" @click="$emit('play', videoInfo.src)" />
        <div v-else class="video-mask-retry">
          <el-progress
            class="video-upload-progress" :percentage="calcPrecent" :class="showRefresh ? 'error' : ''"
            :format="progressTextFormat"
          />
          <el-button v-if="showRefresh" type="primary" class="video-action-continue" @click="onRetryClick">
            重新上传
          </el-button>
        </div>
      </div>
    </div>
    <div class="video-info">
      <div class="video-info-inline">
        <el-tooltip effect="dark" :content="raw.name" placement="bottom" popper-class="file-name-popper">
          <div class="video-info-name">
            {{ raw.name }}
          </div>
        </el-tooltip>

        <icon-park-outline-delete v-if="showDeleteIcon" class="video-action-delete " @click="$emit('remove')" />
      </div>
      <div class="video-info-size">
        {{ videoInfo.size }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.video-container {
  padding-bottom: 56%;
  @apply relative h-0 w-full rounded overflow-hidden;

  .video-upload-succss {
    @apply absolute -top-px -right-4 text-white bg-green-500 w-12 flex justify-center py-1 rotate-45 text-xs;
  }

  .video-cover {
    @apply absolute left-0 top-0 bg-white h-full w-full rounded object-cover;
  }

  .video-mask-base {
    @apply absolute top-0 left-0 right-0 bottom-0 bg-black/20;
  }

  .video-mask-retry {
    @apply absolute top-0 left-0 right-0 bottom-0 bg-black/50;
  }

  .video-aciton-play {
    @apply text-4xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer text-white;
  }

  .video-action-continue {
    @apply absolute top-1/2 left-1/2 -translate-x-1/2;
  }

  .video-upload-progress {
    @apply top-1/3 px-10;

    &.error {
      :deep(.el-progress-bar__inner) {
        background-color: var(--el-color-error);
      }

      :deep(.el-progress__text) {
        color: var(--el-color-error);
      }
    }

    :deep(.el-progress__text) {
      @apply w-full text-center -top-6 text-white;
    }
  }

  .video-info-duration {
    @apply absolute bottom-0 right-0 w-full p-2 pt-4 text-right text-white bg-gradient-to-t from-gray-800/40;
  }

}

.video-info {
  @apply flex-1 overflow-hidden p-1;

  &-inline {
    @apply flex justify-between items-center;

    .video-action-delete {
      @apply cursor-pointer text-lg text-red-500;
    }
  }

  &-name {
    @apply truncate text-base text-gray-700 flex-1;
  }

  &-size {
    @apply text-xs text-gray-400;
  }
}
</style>
