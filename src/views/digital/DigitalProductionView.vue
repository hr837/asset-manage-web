<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import DigitalPhotoCardProduction from './components/DigitalPhotoCardProduction.vue'
import type { QueryImageListOutput } from '@/http/models/asset-image.model'
import { ImageAssetService } from '@/http/services/ImageAssetService'
import { AssetStatus } from '@/types/common-enum'
import { LoadingService } from '@/http/extends/loading.service'

const productionList = ref<QueryImageListOutput[]>([])

const service = new ImageAssetService()
const loadingStatus = ref(false)
const loadingService = new LoadingService(loadingStatus)

onMounted(() => {
  service.queryImageList({ status: AssetStatus.SUCCESSFUL }, [loadingService]).then((data) => {
    productionList.value = data.rows
  }).catch(() => ElMessage.error('获取作品集失败'))
})
</script>

<template>
  <el-container v-loading="loadingStatus" class="page digital-edit">
    <el-header class="flex items-center border-b">
      <RouterLink to="/zone">
        <icon-park-outline-arrow-left />
      </RouterLink>
      <span class="ml-4">我的作品</span>
    </el-header>
    <div class="card-list">
      <DigitalPhotoCardProduction v-for="item of productionList" :key="item.id" :data="item" />
    </div>
  </el-container>
</template>

<style lang="less" scoped></style>
