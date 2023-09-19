<script lang="ts" setup>
import { ref } from 'vue'
import AssetDataList from './components/AssetDataList.vue'
import AssetQueryForm from './components/AssetQueryForm.vue'
import AssetQeuryFilter from './components/AssetQueryFilter.vue'
import AssetUpload from './components/AssetUpload.vue'
import type { AssetInfo, AssetQueryFormData } from '@/types/asset-info.type'

const dataSet = ref<AssetInfo[]>([])

// 查询条件
const queryData: { status?: number } = {
  status: undefined,
}

function onStateChange(val?: number) {
  queryData.status = val
  fetchData()
}

function refreshData(data: AssetQueryFormData) {
  Object.assign(queryData, data)
  fetchData()
}

function fetchData() {
  // TODO fetch

}
</script>

<template>
  <div class="page asset-manage-view">
    <AssetQueryForm @refresh="refreshData" />
    <div class="asset-manage-action">
      <AssetQeuryFilter @state-change="onStateChange" />
      <AssetUpload />
    </div>
    <el-empty v-if="!dataSet.length" />
    <div v-else>
      <AssetDataList v-if="dataSet.length" :data="dataSet" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-manage-view {
  .asset-manage-action {
    @apply flex justify-between items-center mb-4;
  }
}
</style>
