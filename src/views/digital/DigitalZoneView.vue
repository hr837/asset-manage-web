<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import DigitalPhotoCardProduction from './components/DigitalPhotoCardProduction.vue'
import DigitalPhotoCardDraft from './components/DigitalPhotoCardDraft.vue'
import DigitalVideoPlayer from './components/DigitalVideoPlayer.vue'
import type { QueryImageListOutput } from '@/http/models/asset-image.model'
import { ImageAssetService } from '@/http/services/ImageAssetService'
import { AssetStatus } from '@/types/common-enum'
import { LoadingService } from '@/http/extends/loading.service'
import { downloadFile, getFilePath } from '@/utils/file.util'

const productionList = ref<QueryImageListOutput[]>([])
const draftList = ref<QueryImageListOutput[]>([])

const service = new ImageAssetService()
const loadingStatus = ref(false)
const loadingService = new LoadingService(loadingStatus)

const playInfo = reactive({
  title: '',
  url: '',
  show: false,
})

onMounted(fetchData)

// 拉取新数据
function fetchData() {
  productionList.value = []
  draftList.value = []
  service.queryImageList({}, [loadingService]).then((data) => {
    for (const item of data.rows) {
      if (item.status === AssetStatus.SAVE)
        draftList.value.push(item)

      else
        productionList.value.push(item)
    }
  }).catch(() => ElMessage.error('查询图片资产失败'))
}

const router = useRouter()

// 卡片操作事件处理
function onItemAction(command: string, id: string) {
  const item = draftList.value.find(x => x.id === id) ?? productionList.value.find(x => x.id === id)
  if (!item)
    return
  switch (command) {
    case 'edit':
      router.push({ name: 'AssetPhotoEdit', query: { id, s: 'u' } })
      break
    case 'generate':
      service.imageGenerateVideo({
        ...item,
        use_enhancer: 1,
      }).then(() => {
        ElMessage.success('开始生成')
        return fetchData()
      }).catch(({ msg }) => ElMessage.error(msg ?? '生成任务创建失败'))
      break
    case 'delete':
      service.delete(id)
        .then(() => {
          ElMessage.success('删除成功')
          return fetchData()
        })
        .catch(() => ElMessage.error('删除作品失败'))
      break
    case 'play':
      playInfo.title = item.name
      playInfo.url = getFilePath(item.videoFileUrl, 'video', '/data/')
      playInfo.show = true
      break
    default:
      downloadFile(item.videoFileUrl, `${item.name}.mp4`, 'video', '/data/')
      break
  }
}
</script>

<template>
  <el-container v-loading="loadingStatus" class="page digital-zone-view">
    <el-header class="page-header">
      <div class="text-block font-bold">
        创作空间
      </div>
      <el-dropdown popper-class="digital-zone-popper">
        <el-button type="primary">
          去创作 <icon-park-outline-down />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link to="/digital">
                照片会说话
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item disabled>
              数字人制作
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-main>
      <div class="draft-container">
        <div class="container-header">
          <div class="container-title">
            草稿箱
          </div>
        </div>
        <el-empty v-if="!draftList.length" description="创意在您脑海中，快让它展现吧！" />
        <div v-else class="card-list">
          <DigitalPhotoCardDraft v-for="item of draftList" :key="item.id" :data="item" @action="onItemAction" />
        </div>
      </div>
      <div class="production-container">
        <div class="container-header">
          <div class="container-title">
            我的作品
          </div>
          <div v-if="productionList.length" class="container-action">
            <router-link to="/my-production" class="inline-flex items-center text-violet-500">
              查看更多 <icon-park-outline-right />
            </router-link>
          </div>
        </div>
        <el-empty v-if="!productionList.length" description="还没有生成的产物" />
        <div class="card-list">
          <DigitalPhotoCardProduction v-for="item of productionList" :key="item.id" :data="item" @action="onItemAction" />
        </div>
      </div>
      <!-- 视频播放 -->
      <DigitalVideoPlayer v-model="playInfo.show" v-bind="playInfo" />
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
.digital-zone-view {
  .el-empty {
    --el-empty-padding: 16px 0;
  }
}

.page-header {
  @apply flex justify-between items-center border-b;
}

.container-header {
  @apply h-14 flex justify-between items-center;

  .container-title {
    @apply text-gray-700 font-semibold;
  }
}

.card-list {
  @apply grid grid-cols-4 gap-3;
}
</style>
