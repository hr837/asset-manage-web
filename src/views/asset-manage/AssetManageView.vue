<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AssetDataList from './components/AssetDataList.vue'
import AssetQueryForm from './components/AssetQueryForm.vue'
import AssetQeuryFilter from './components/AssetQueryFilter.vue'
import AssetUpload from './components/AssetUpload.vue'
import { SessionKey_Asset_PLAY_PATH } from './composable/constant'
import type { AssetActionCommand, AssetInfo, AssetQueryFormData } from '@/types/asset-info.type'
import { AssetManageService } from '@/http/services/AssetManageService'
import { PageService } from '@/http/extends/page.service'
import { downloadFile } from '@/utils/file.util'

const assetService = new AssetManageService()
const pageService = new PageService()
const dataSet = ref<AssetInfo[]>([])
const router = useRouter()

// 查询条件
const queryData: { status?: number } = {
  status: undefined,
}

function onStateChange(val?: number) {
  queryData.status = val
  pageService.pageIndex.value = 0
  fetchData()
}

function refreshData(data: AssetQueryFormData) {
  Object.assign(queryData, data)
  pageService.pageIndex.value = 0
  fetchData()
}

function fetchData() {
  sessionStorage.removeItem(SessionKey_Asset_PLAY_PATH)
  assetService.getList(queryData as any, [pageService]).then(data => dataSet.value = data.rows).catch(() => {})
}

function onPlayClick(path: string) {
  sessionStorage.setItem(SessionKey_Asset_PLAY_PATH, path)
  router.push('/play')
}
function onItemAction(cmd: AssetActionCommand, id: string) {
  const item = dataSet.value.find(x => x.id === id)
  if (!item)
    return

  let task: Promise<unknown> | undefined
  switch (cmd) {
    case 'delete':
      task = assetService.delete(id).then(() => {
        ElMessage.success('资源已删除')
        pageService.reset()
        fetchData()
      })
      break
    case 'download':
      downloadFile(item.sourceFileUrl!, item.name ?? '资源文件', '/video')
      break
    case 'downloadFbx':
      downloadFile(item.fbxFileUrl!, `${item.name ?? '资源文件'}-FBX`, '/fbx')
      break
    case 'transfrom':
      task = assetService.convertToFbx(id).then(() => {
        ElMessage.success('操作成功')
        fetchData()
      })
      break
    default:
      break
  }
  task?.catch(() => {
    ElMessage.error('命令执行失败,请重试')
  })
}

onMounted(fetchData)
</script>

<template>
  <div class="page asset-manage-view">
    <AssetQueryForm @refresh="refreshData" />
    <div class="asset-manage-action">
      <AssetQeuryFilter @state-change="onStateChange" />
      <AssetUpload />
    </div>
    <div class="asset-manage-data-container">
      <el-empty v-if="!dataSet.length" />
      <AssetDataList v-else :data="dataSet" @play="onPlayClick" @action="onItemAction" />
    </div>
    <DataPagination :page="pageService" @page-change="fetchData" />
  </div>
</template>

<style lang="less" scoped>
.asset-manage-view {
  @apply h-full flex flex-col;
  .asset-manage-action {
    @apply flex justify-between items-center mb-4;
  }
  .asset-manage-data-container{
    @apply flex-1 overflow-auto;
  }
}
</style>
