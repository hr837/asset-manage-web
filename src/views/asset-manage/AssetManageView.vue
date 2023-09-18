<script lang="ts" setup>
import { ref } from 'vue'
import AssetDataList from './components/AssetDataList.vue'
import AssetQueryForm from './components/AssetQueryForm.vue'
import AssetQeuryFilter from './components/AssetQueryFilter.vue'
import AssetUpload from './components/AssetUpload.vue'
import type { AssetInfo, AssetState } from '@/types/asset-info.type'

const dataSet = ref<AssetInfo[]>([
  {
    id: '001',
    state: '仅上传',
    name: '曹操练兵',
    uploadDate: '2023-12-23 12:32:45',
  },
  {
    id: '002',
    state: '排队中',
    name: '曹操娶妻',
    uploadDate: '2023-12-23 12:32:45',
  },
  {
    id: '003',
    state: '转换中',
    name: '曹操练兵',
    uploadDate: '2023-12-23 12:32:45',
  },
  {
    id: '004',
    state: '转换失败',
    name: '曹操吃席',
    uploadDate: '2023-12-23 12:32:45',
  },
  {
    id: '005',
    state: '转换完成',
    name: '曹操打仗',
    uploadDate: '2023-12-23 12:32:45',
    trasformDate: '2023-12-23 13:22:43',
  },
  {
    id: '006',
    state: '转换失败',
    name: '曹操输了，输的彻彻底底的',
    uploadDate: '2023-12-23 12:32:45',
    trasformDate: '2023-12-23 13:22:43',
  },
  {
    id: '007',
    state: '转换完成',
    name: '诸葛笑了',
    uploadDate: '2023-12-23 12:32:45',
    trasformDate: '2023-12-23 13:22:43',
  },
])

let queryData = {}
const filterSatate = ref<AssetState | undefined>(undefined)

function onStateChange(val?: AssetState) {
  filterSatate.value = val
}

function refreshData(data: any) {
  queryData = data
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
    <AssetDataList :data="dataSet" />
  </div>
</template>

<style lang="less" scoped>
.asset-manage-view {
  .asset-manage-action {
    @apply flex justify-between items-center mb-4;
  }
}
</style>
