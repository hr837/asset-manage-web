<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import AssetQeuryFilter from './components/AssetQueryFilter.vue'
import { SessionKey_Asset_PLAY_PATH } from './composable/constant'
import AssetDataList from './components/AssetDataList.vue'
import type { AssetActionCommand, AssetInfo, RouteQeuryInfo } from '@/types/asset-info.type'
import { AssetManageService } from '@/http/services/AssetManageService'
import { PageService } from '@/http/extends/page.service'
import { downloadFile } from '@/utils/file.util'
import type { AssetQueryInput } from '@/http/models/asset.model'
import type { DateFormInstance } from '@/types/common-components.type'
import { LoadingService } from '@/http/extends/loading.service'
const assetService = new AssetManageService()
const dataSet = ref<AssetInfo[]>([])
const router = useRouter()
const formRef = ref<DateFormInstance>()
const route = useRoute()
const listLoading = ref(false)
const loadingService = new LoadingService(listLoading)

// 查询控制器
const pageService = new PageService(1, 12)
pageService.pageSizeOpts = [12, 24]

// 表单查询条件
const queryModel = reactive<AssetQueryInput & { date?: string[] }>({
  status: undefined,
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

// 从服务器获取页面数据
function fetchData() {
  sessionStorage.removeItem(SessionKey_Asset_PLAY_PATH)
  const queryData = { ...queryModel }
  delete queryData.date
  assetService.getList(queryData, [pageService, loadingService]).then(data => dataSet.value = data.rows).catch(() => { })
}

function revertQueryData(to: RouteLocationNormalized) {
  const query: Partial<RouteQeuryInfo> = to.query
  queryModel.name = query.n ?? ''
  queryModel.startDate = query.ts ?? ''
  queryModel.endDate = query.te ?? ''
  queryModel.status = query.s ? Number.parseInt(query.s) : undefined
  pageService.pageIndex.value = Number.parseInt(query.pi ?? '1')
  pageService.pageSize.value = Number.parseInt(query.pz ?? '12')
  fetchData()
}

onMounted(() => {
  // 默认查询
  revertQueryData(route)
})

onBeforeRouteUpdate(to => revertQueryData(to))

// 播放控制器，跳转播放页面
const asesetCardClick = (id: string) => router.push({ name: 'asset-detail', query: { id } })

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
      downloadFile(item.sourceFileUrl!, `${item.name ?? '资源文件'}.mp4`, 'video')
      break
    case 'downloadFbx':
      downloadFile(item.fbxFileUrl!, `${item.name ?? '资源文件-FBX'}.fbx`, 'fbx')
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

// 日期组件禁用部分
const today = dayjs().startOf('day').toDate()
const beforDay = dayjs(today).subtract(2, 'month').toDate()
// 禁止选择2月前和今天之后
function disabledDate(pickDate: Date) {
  return pickDate < beforDay || pickDate > today
}

function onFormSearch() {
  pageService.reset()
  updatePageQuery()
}

// 更改路由查询参数
function updatePageQuery() {
  const query: Partial<RouteQeuryInfo> = {
    pi: pageService.pageIndex.value.toString(),
    pz: pageService.pageSize.value.toString(),
    n: queryModel.name,
    ts: queryModel.startDate,
    te: queryModel.endDate,
    s: queryModel.status?.toString(),
  }
  router.push({ query: Object.assign({}, route.query, query) })
}
</script>

<template>
  <div class="page asset-manage-view">
    <div v-loading="listLoading" class="page-content">
      <DataForm ref="formRef" :model="queryModel" :label-width="0" @search="onFormSearch" @reset="onFormSearch">
        <el-form-item prop="name">
          <el-input v-model="queryModel.name" placeholder="请输入文件名称" clearable />
        </el-form-item>
        <el-form-item prop="date">
          <DateRange v-model="queryModel.date" :disabled-date="disabledDate" />
        </el-form-item>
      </DataForm>
      <div class="asset-manage-action">
        <AssetQeuryFilter v-model="queryModel.status" @update:model-value="onFormSearch" />
        <el-button type="primary" @click="() => router.push('/upload')">
          上传视频
        </el-button>
      </div>
      <div class="asset-manage-data-container">
        <AssetDataList v-if="dataSet.length > 0" :data="dataSet" @detail="asesetCardClick" @action="onItemAction" />
        <el-empty v-if="!dataSet.length && !listLoading" />
      </div>
      <DataPagination :page="pageService" @page-change="updatePageQuery" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-manage-view {
  @apply p-0;
}

.page-content {
  width: 1150px;
  @apply mx-auto p-4 h-full flex flex-col;
}

.asset-manage-action {
  @apply flex justify-between items-center mb-4;
}

.asset-manage-data-container {
  @apply flex-1;
}

// .asset-manage-view {
//   @apply h-full flex flex-col;

//   .asset-manage-action {
//     @apply flex justify-between items-center mb-4;
//   }

//   .asset-manage-data-container {
//     @apply flex-1 overflow-auto;
//   }
// }
</style>
