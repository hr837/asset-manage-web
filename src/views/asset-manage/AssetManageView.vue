<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import AssetDataList from './components/AssetDataList.vue'
import AssetQueryForm from './components/AssetQueryForm.vue'
import AssetQeuryFilter from './components/AssetQueryFilter.vue'
import AssetUpload from './components/AssetUpload.vue'
import type { AssetInfo, AssetQueryFormData } from '@/types/asset-info.type'
import { AssetManageService } from '@/http/services/AssetManageService'
import { PageService } from '@/http/extends/page.service'

const assetService = new AssetManageService()
const pageService = new PageService()
const dataSet = ref<AssetInfo[]>([])

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
  assetService.getList(queryData as any, [pageService]).then(data => dataSet.value = data.rows).catch(() => {})
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
      <AssetDataList v-else :data="dataSet" />
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
