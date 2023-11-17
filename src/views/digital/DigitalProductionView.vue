<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import DigitalPhotoCardProduction from './components/DigitalPhotoCardProduction.vue'
import DigitalVideoPlayer from './components/DigitalVideoPlayer.vue'
import type { QueryImageListOutput } from '@/http/models/asset-image.model'
import { ImageAssetService } from '@/http/services/ImageAssetService'
import { AssetStatus } from '@/types/common-enum'
import { LoadingService } from '@/http/extends/loading.service'
import { downloadFile, getFilePath } from '@/utils/file.util'

const productionList = ref<QueryImageListOutput[]>([])

const service = new ImageAssetService()
const loadingStatus = ref(false)
const loadingService = new LoadingService(loadingStatus)
const router = useRouter()
onMounted(fetchData)

const playInfo = reactive({
  title: '',
  url: '',
  show: false,
})

function fetchData() {
  service.queryImageList({ status: AssetStatus.SUCCESSFUL }, [loadingService]).then((data) => {
    productionList.value = data.rows
  }).catch(() => ElMessage.error('获取作品集失败'))
}

// 卡片操作事件处理
function onItemAction(command: string, id: string) {
  const item = productionList.value.find(x => x.id === id)
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
  <el-container v-loading="loadingStatus" class="page digital-edit">
    <el-header class="flex items-center border-b">
      <RouterLink to="/zone">
        <icon-park-outline-arrow-left />
      </RouterLink>
      <span class="ml-4">我的作品</span>
    </el-header>
    <div class="p-4 grid grid-cols-4 gap-3">
      <DigitalPhotoCardProduction v-for="item of productionList" :key="item.id" :data="item" @action="onItemAction" />
      <!-- 视频播放 -->
      <DigitalVideoPlayer v-model="playInfo.show" v-bind="playInfo" />
    </div>
  </el-container>
</template>

<style lang="less" scoped></style>
