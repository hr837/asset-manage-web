<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import AssetProgress from './components/AssetProgress.vue'
import AssetDetailTag from './components/AssetDetailTag.vue'
import { loadFbx, unloadFbx } from './FbxPlayer'
import { AssetManageService } from '@/http/services/AssetManageService'
import { AssetVideoPrefix } from '@/config/app.config'
import { downloadFile, getVideoSize } from '@/utils/file.util'
import type { AssetInfo } from '@/types/asset-info.type'
import { getVideoDuration } from '@/utils/date.util'
const route = useRoute()
const router = useRouter()

const service = new AssetManageService()

const assetData = reactive<Required<AssetInfo>>({
  id: '',
  status: 1,
  sourceFileUrl: '',
  fbxFileUrl: '',
  name: '资产文件名',
  uploadTime: '',
  lineTotalTime: '',
  processStage: '',
  coverImage: '',
  lineAlreadyWaitTime: '',
  convertTotalTime: '',
  convertAlreadyWaitTime: '',
  convertEndTime: '',
  message: '',
  size: 0,
  duration: 0,
  convertStartTime: '',
  extensionName: '',
  predictLineTime: '',
  lineIndex: '',
  lineTotal: '',
})

let id = ''
onMounted(() => {
  id = route.query.id as string
  fetchData()
})

onUnmounted(unloadFbx)

function fetchData() {
  service.getAssetInfo(id)
    .then((data) => {
      if (!data)
        throw new Error('未获取到资产信息')
      Object.assign(assetData, data)
    })
    .then(() => nextTick(checkStatus))
    .catch(({ message }) => {
      ElMessage.error(message)
      router.back()
    })
}

const assetService = new AssetManageService()

function onDownloadMp4Click() {
  if (!assetData.sourceFileUrl)
    return
  downloadFile(assetData.sourceFileUrl, `${assetData.name}.mp4`, 'video')
}

function onDownloadFbxClick() {
  if (!assetData.fbxFileUrl)
    return
  downloadFile(assetData.fbxFileUrl, `${assetData.name}.fbx`, 'fbx')
}

function onDeleteClick() {
  ElMessageBox.confirm(`是否删除资源文件【${assetData.name}】`, '删除提示', {
    type: 'warning',
  }).then(() => assetService.delete(id))
    .then(() => {
      ElMessage.success('资源已删除')
      router.back()
    }).catch(({ msg }: any) => {
      ElMessage.error(msg ?? '删除失败，请重试')
    })
}

function onTransformClick() {
  assetService.convertToFbx(id).then(() => {
    ElMessage.success('操作成功')
    fetchData()
  }).catch(({ msg }: any) => {
    ElMessage.error(msg ?? '转换操作失败，请重试')
  })
}

const videoWrap = ref<HTMLDivElement>()
const miniVideo = ref(false)

function checkStatus() {
  if (assetData.status !== 5)
    return
  const container = videoWrap.value!.querySelector<HTMLDivElement>('.fbx-player-container')
  const video = videoWrap.value!.querySelector<HTMLVideoElement>('.video-player')
  if (!container || !video)
    return
  //
  loadFbx(container, video, assetData.fbxFileUrl)
    .then(() => miniVideo.value = true)
    .catch(() => {
      video.style.display = 'none'
    })
}

const src = computed(() => AssetVideoPrefix + assetData.sourceFileUrl)
const duration = computed(() => getVideoDuration(assetData.duration))
const fileSize = computed(() => getVideoSize(assetData.size))
const canDownload = computed(() => assetData.status === 5)
const canTransform = computed(() => assetData.status === 1 || assetData.status === 4)
</script>

<template>
  <div class="page asset-detail">
    <div class="page-action ">
      <div class="page-title">
        资产详情
      </div>
      <el-button type="primary" @click="router.back">
        返回
      </el-button>
    </div>
    <div class="content-left">
      <AssetDetailTag :status="assetData.status" />
      <AssetProgress v-bind="assetData" />
    </div>
    <div class="content-right">
      <div class="info-name">
        {{ assetData.name }}
      </div>
      <div class="info-extra">
        <div class="file-info">
          <span> 视频时长：{{ duration }}</span>
          <span> 视频大小：{{ fileSize }}</span>
        </div>
        <div class="info-aciton">
          <el-button type="primary" plain @click="onDownloadMp4Click">
            下载MP4文件
          </el-button>
          <el-button type="primary" plain :disabled="!canDownload" @click="onDownloadFbxClick">
            下载FBX文件
          </el-button>
          <el-button type="primary" plain :disabled="!canTransform" @click="onTransformClick">
            转换文件
          </el-button>
          <el-button type="primary" plain @click="onDeleteClick">
            删除文件
          </el-button>
        </div>
      </div>

      <div ref="videoWrap" class="video-wrapper">
        <div class="fbx-player-container" />
        <video
          class="video-player" :src="src" :class="{ mini: miniVideo }" controls
          controlslist="nodownload noremoteplayback" disablePictureInPicture
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-detail {
  @apply grid overflow-hidden;
  grid-template: 56px 1fr / 277px 1fr;
}

.page-action {
  @apply col-span-2 px-4 border-b flex justify-between items-center;

  .page-title {
    @apply text-base text-black font-semibold;
  }
}

.content-left {
  @apply pt-5;
}

.content-right {
  background-color: #fafafa;
  @apply flex-1 p-6 pb-1 flex flex-col overflow-hidden;

  .info-name {
    @apply py-4 text-2xl break-all text-gray-700 font-semibold;
  }

  .info-extra {
    @apply h-14 flex justify-between;

    .file-info {
      @apply flex gap-8 text-sm text-gray-500;
    }

    .info-aciton {
      @apply text-right;
    }
  }

  .video-wrapper {
    @apply flex-1 overflow-hidden relative;
  }

  .fbx-player-container {
    @apply absolute top-0 right-0 bottom-0 left-0 bg-gray-50;
  }

  .video-player {
    @apply h-full w-full bg-black;

    &.mini {
      height: 90px;
      @apply absolute bottom-0 z-10 bg-transparent;
      object-position: center -100px;

      &::-webkit-media-controls-panel {
        @apply bg-gradient-to-t from-black/80 to-transparent;
      }
    }
  }
}
</style>
