<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import AssetProgress from './components/AssetProgress.vue'
import AssetDetailTag from './components/AssetDetailTag.vue'
import { AssetManageService } from '@/http/services/AssetManageService'
import type { AssetQueryOutItem } from '@/http/models/asset.model'
import { AssetVideoPrefix } from '@/config/app.config'
const route = useRoute()

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
      <el-button type="primary">
        返回
      </el-button>
    </div>
    <div class="detail-content">
      <AssetProgress v-bind="assetData" class="content-left" />
      <div class="content-right">
        <div class="video-detail">
          <div class="video-name">
            {{ assetData.name }}
          </div>
          <div class="file-info">
            <div class="video-druation">
              视频时长：14s
            </div>
            <div class="video-size">
              视频大小：2.09MB
            </div>
          </div>
        </div>
        <div class="video-aciton">
          <el-button>下载MP4文件</el-button>
          <el-button>下载FBX文件</el-button>
          <el-button>转换文件</el-button>
          <el-button>删除文件</el-button>
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
  @apply p-0 flex flex-col;
}

.page-action {
  @apply py-2 pr-4 border-b flex justify-between items-center;
}

.detail-content {
  @apply flex-1 flex;

  .content-left {
    @apply w-72;
  }

  .content-right {
    background-color: #FAFAFA;
    @apply flex-1 p-6;

    .video-name {
      @apply text-2xl text-gray-700 font-semibold;
    }

    .file-info {
      @apply flex gap-8 text-sm text-gray-500 my-4;
    }

    .video-aciton {
      @apply text-right my-5;
    }

    .video-player {
      @apply w-full;
    }
  }
}
</style>
