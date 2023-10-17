<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AssetProgress from './components/AssetProgress.vue'
import AssetDetailTag from './components/AssetDetailTag.vue'
import { AssetManageService } from '@/http/services/AssetManageService'
import type { AssetQueryOutItem } from '@/http/models/asset.model'
import { AssetVideoPrefix } from '@/config/app.config'
const route = useRoute()
const router = useRouter()

const service = new AssetManageService()

const assetData = reactive<AssetQueryOutItem>({
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
})

let id = ''
onMounted(() => {
  id = route.query.id as string
  service.getAssetInfo(id).then((data) => {
    Object.assign(assetData, data)
  })
})

const src = computed(() => AssetVideoPrefix + assetData.sourceFileUrl)
</script>

<template>
  <div class="page asset-detail">
    <div class="page-action ">
      <AssetDetailTag :status="assetData.status" />
      <el-button type="primary" @click="() => router.push('/index')">
        返回
      </el-button>
    </div>
    <div class="page-content">
      <AssetProgress v-bind="assetData" class="content-left" />
      <div class="content-right">
        <div class="info-name">
          {{ assetData.name }}
        </div>
        <div class="info-extra">
          <div class="file-info">
            <span> 视频时长：{{ assetData.duration }}</span>
            <span> 视频大小：{{ assetData.size }}</span>
          </div>
          <div class="info-aciton">
            <el-button>下载MP4文件</el-button>
            <el-button>下载FBX文件</el-button>
            <el-button>转换文件</el-button>
            <el-button>删除文件</el-button>
          </div>
        </div>

        <div class="video-wrap">
          <video
            class="video-player" :src="src" controls controlslist="nodownload noremoteplayback"
            disablePictureInPicture
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-detail {
  min-width: 1150px;
  @apply flex flex-col;
}

.page-action {
  @apply col-span-2 py-2 pr-4 border-b flex justify-between items-center;
}

.page-content {
  @apply flex;
}

.content-right {
  background-color: #EFEFEF;
  @apply flex-1 p-6 pb-0 flex flex-col;

  .info-name {
    @apply text-2xl text-gray-700 font-semibold;
  }

  .info-extra {
    @apply my-4 flex justify-between;
  }

  .file-info {
    @apply flex gap-8 text-sm text-gray-500;
  }

  .info-aciton {
    @apply text-right;
  }

  .video-player {
    max-height: 100%;
  }

}
</style>
