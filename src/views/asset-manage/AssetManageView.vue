<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import AssetDataList from './components/AssetDataList.vue'
import AssetQeuryFilter from './components/AssetQueryFilter.vue'
import { SessionKey_Asset_PLAY_PATH } from './composable/constant'
import type { AssetActionCommand, AssetInfo } from '@/types/asset-info.type'
import { AssetManageService } from '@/http/services/AssetManageService'
import { PageService } from '@/http/extends/page.service'
import { downloadFile } from '@/utils/file.util'
import type { AssetQueryInput } from '@/http/models/asset.model'
import type { DateFormInstance } from '@/types/common-components.type'
const assetService = new AssetManageService()
const pageService = new PageService()
const dataSet = ref<AssetInfo[]>([])
const router = useRouter()
const formRef = ref<DateFormInstance>()
const route = useRoute()

// 查询条件
const queryModel = reactive<AssetQueryInput & { date?: string[] }>({
  status: undefined,
  id: '',
  name: '',
  startDate: '',
  endDate: '',
  get date() {
    return [this.startDate!, this.endDate!]
  },
  set date(val: string[]) {
    this.startDate = val[0]
    this.endDate = val[1]
  },
})

// 过滤器发生改变，刷新页面数据
function onStateChange() {
  pageService.reset()
  fetchData()
}

// 使用表单查询条件，重置过滤器状态并刷新页面数据
function refreshData() {
  if (queryModel.id) {
    router.push({ query: undefined })
    queryModel.id = ''
  }
  queryModel.status = undefined
  onStateChange()
}

// 从服务器获取页面数据
function fetchData() {
  sessionStorage.removeItem(SessionKey_Asset_PLAY_PATH)
  const queryData = { ...queryModel }
  delete queryData.date
  assetService.getList(queryData, [pageService]).then(data => dataSet.value = data.rows).catch(() => { })
}

// 播放控制器，跳转播放页面
function onPlayClick(path: string) {
  sessionStorage.setItem(SessionKey_Asset_PLAY_PATH, path)
  // router.push('/detail')
  router.push('/play')
}

// 数据过滤器回调，发起请求刷新页面数据
function onItemAction(cmd: AssetActionCommand, id: string) {
  const item = dataSet.value.find(x => x.id === id)
  if (!item)
    return

  let task: Promise<unknown> | undefined
  switch (cmd) {
    case 'delete':
      task = ElMessageBox.confirm(`是否删除资源文件【${item.name}】`, '删除提示', {
        type: 'warning',
      }).then(() => assetService.delete(id).then(() => {
        ElMessage.success('资源已删除')
        pageService.reset()
        fetchData()
      })).catch(() => { })
      break
    case 'download':
      downloadFile(item.sourceFileUrl!, `${item.name ?? '资源文件'}.mp4`, '/video')
      break
    case 'downloadFbx':
      downloadFile(item.fbxFileUrl!, `${item.name ?? '资源文件-FBX'}.fbx`, '/fbx')
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
  task?.catch(({ msg }) => {
    ElMessage.error(msg ?? '命令执行失败,请重试')
  })
}

// 页面加载获取路由参数，是否需要根据ID搜索
onMounted(() => {
  queryModel.id = route.query.id as string
  fetchData()
})

// 日期组件禁用部分
const today = dayjs().startOf('day').toDate()
const beforDay = dayjs(today).subtract(2, 'month').toDate()
// 禁止选择2月前和今天之后
function disabledDate(pickDate: Date) {
  return pickDate < beforDay || pickDate > today
}

// 处理已经再当前页面的时候修改的路由参数
watch(() => route.query, (query) => {
  if (query && query.id) {
    queryModel.date = ['', '']
    queryModel.name = ''
    queryModel.status = undefined
    queryModel.id = query.id as string
    fetchData()
  }
})

function onUploadClick() {
  router.push('/upload')
}
</script>

<template>
  <div class="page asset-manage-view">
    <DataForm ref="formRef" :model="queryModel" :label-width="0" @search="refreshData" @reset="refreshData">
      <el-form-item prop="name">
        <el-input v-model="queryModel.name" placeholder="请输入文件名称" clearable />
      </el-form-item>
      <el-form-item prop="date">
        <DateRange v-model="queryModel.date" :disabled-date="disabledDate" />
      </el-form-item>
    </DataForm>
    <div class="asset-manage-action">
      <AssetQeuryFilter v-model="queryModel.status" @update:model-value="onStateChange" />
      <el-button type="primary" @click="onUploadClick">
        上传视频
      </el-button>
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

  .asset-manage-data-container {
    @apply flex-1 overflow-auto;
  }
}
</style>
