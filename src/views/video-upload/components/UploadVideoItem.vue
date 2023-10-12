<script lang="ts" setup>
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import type { FilePart } from '../composable/file.help'
import { getDuration, getVideoSize } from '../composable/file.help'
import { getSliceFileMd5 } from '@/utils/file.util'
import { FileUploadService } from '@/http/services/FileUploadService'
import { FileChunkSize } from '@/views/asset-manage/composable/constant'
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
  /** 移除文件 */
  remove: []
  /** 文件上传成功 */
  success: [data: any]
}>()
defineComponent({
  name: 'UploadVideoItem',
})

const canvasRef = ref<HTMLCanvasElement>()
// 显示重新上传
const showRefresh = ref(false)
// 是否能播放
const canPlay = ref(false)

const videoInfo = reactive({
  src: '',
  durationStr: '',
  duration: 0,
  size: '--',
  fileId: '',
})

onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx)
    return
  const videoEl = document.createElement('video')
  videoEl.src = URL.createObjectURL(props.raw)
  videoEl.preload = 'auto'
  const { width: dw, height: dh } = canvasRef.value!
  // 加载成功，绘制封面
  videoEl.onloadeddata = () => {
    ctx.drawImage(videoEl, 0, 0, dw, dh)
    // set value
    videoInfo.src = videoEl.src
    videoInfo.size = getVideoSize(props.raw.size)
    videoInfo.duration = videoEl.duration
    videoInfo.durationStr = getDuration(videoEl.duration)
    canPlay.value = true
  }
  // 加载失败，绘制错误
  videoEl.onerror = () => {
    const img = document.createElement('img')
    img.src = '/images/sorry.jpg'
    img.onload = () => ctx.drawImage(img, 0, 0, dw, dh)
    ElMessage.error('文件信息不可读取，请重新选择')
    // 强制移除文件
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

/** 开始上传文件 */
async function upload() {
  try {
    // 对文件切片并计算MD5
    const { md5, fileParts } = await getSliceFileMd5(props.raw, FileChunkSize, precent => calcPrecent.value = precent)
    // 开始预上传
    const res = await uploadService.preUpload({
      originFileName: props.raw.name,
      fileSize: props.raw.size,
      duration: videoInfo.duration,
      parentId: 0,
      md5,
      auto: props.transfrom ? 1 : 0,
    })

    videoInfo.fileId = res.uploadFileId
    if (res.fastUpload)
      return emitSuccess()

    // 分片数据设置
    partList.value = fileParts.map(item => Object.assign(item, { uploaded: false }))
    // 分片上传
    calcPrecent.value = 0
    partUpload()
  }
  catch (error) {
    ElMessage.error('上传异常')
  }
}

/** 对未上传的分片进行上传 */
function partUpload() {
  // 每份上传进度百分比
  const partPrecent = Math.round(partList.value.length ** -1 * 100)
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
    .catch(() => showRefresh.value = true)
}

/** 向父组件通知，文件上传成功 */
function emitSuccess() {
  uploaded.value = true
  showRefresh.value = false
  emit('success', videoInfo.fileId)
}

const partUploading = computed(() => partList.value.length > 0)
</script>

<template>
  <div class="component upload-video-item">
    <div class="video-cover">
      <canvas ref="canvasRef" class="video-cover-canvas" />
      <icon-park-solid-play v-if="canPlay" class="video-cover-icon" @click="$emit('play', videoInfo.src)" />
    </div>
    <div class="video-info">
      <div class="video-info-name">
        {{ raw.name }}
      </div>
      <div class="video-info-inline">
        <div class="video-info-duration">
          视频时长：{{ videoInfo.durationStr }}
        </div>
        <div class="video-info-size">
          文件大小：{{ videoInfo.size }}
        </div>
      </div>
      <div v-if="start" class="video-info-progress">
        <el-progress :percentage="calcPrecent" :color="partUploading ? '#8A2BE2' : '#9370DB'" />
      </div>
    </div>
    <div class="video-action">
      <icon-park-outline-delete class="video-action-icon text-red-500" @click="$emit('remove')" />
      <icon-park-outline-refresh v-if="showRefresh" class="video-action-icon text-blue-500" @click="partUpload" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.upload-video-item {
  @apply flex gap-4 rounded shadow;
}

.video-cover {

  @apply bg-gray-200 relative rounded-sm overflow-hidden;

  &-canvas {
    @apply w-20 h-20;
  }

  &-icon {
    @apply text-3xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer text-gray-300 hover:text-gray-500;
  }
}

.video-info {
  @apply flex-1 text-sm overflow-hidden;

  &-inline {
    @apply flex gap-4 text-gray-500 text-xs py-1;
  }

  &-name {
    @apply truncate;
  }

  &-progress {
    @apply relative;
  }
}

.video-action {
  @apply p-2;

  &-icon {
    @apply mt-2 cursor-pointer;
  }

}
</style>
