<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import AssetProgress from './components/AssetProgress.vue'
import AssetDetailTag from './components/AssetDetailTag.vue'
import { AssetManageService } from '@/http/services/AssetManageService'
import { AssetVideoPrefix } from '@/config/app.config'
import { downloadFile, getDuration, getVideoSize } from '@/utils/file.util'
import type { AssetInfo } from '@/types/asset-info.type'
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
  lineAlreadyWaitTime: '',
  convertTotalTime: '',
  convertAlreadyWaitTime: '',
  convertTime: '',
  message: '',
  size: 0,
  duration: 0,
  convertStartTime: '',
  extensionName: '',
  predictLineTime: '',
})

let id = ''
onMounted(() => {
  id = route.query.id as string
  fetchData()
})

function fetchData() {
  service.getAssetInfo(id).then((data) => {
    if (!data)
      throw new Error('未获取到资产信息')
    Object.assign(assetData, data)
  }).catch(({ message }) => {
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
  }).then(() => assetService.delete(id).then(() => {
    ElMessage.success('资源已删除')
    router.back()
  })).catch(() => { })
}

function onTransformClick() {
  assetService.convertToFbx(id).then(() => {
    ElMessage.success('操作成功')
    fetchData()
  })
}

const src = computed(() => AssetVideoPrefix + assetData.sourceFileUrl)
const duration = computed(() => getDuration(assetData.duration))
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
      <el-button type="primary" @click="() => router.push('/index')">
        返回
      </el-button>
    </div>
    <div class="page-content">
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

        <video
          class="video-player" :src="src" controls controlslist="nodownload noremoteplayback"
          disablePictureInPicture
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-detail {
  min-width: 1150px;
  @apply p-0 flex flex-col;
}

.page-action {
  height: 50px;
  @apply px-4 border-b flex justify-between items-center;

  .page-title {
    @apply text-base text-black font-semibold;
  }
}

.page-content {
  @apply flex-1 flex;
}

.content-left {
  @apply pt-5;
}

.content-right {
  background-color: #EFEFEF;
  @apply flex-1 p-6 pb-0;

  .info-name {
    @apply h-12 text-2xl text-gray-700 font-semibold;
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

  .video-player {
    width: 100%;
    height: 600px;
  }

}
</style>
