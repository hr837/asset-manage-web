<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import DigitalTabs from './components/DigitalTabs.vue'
import DigitalPhotoUpload from './components/DigitalPhotoUpload.vue'
import DigitalPhotoCard from './components/DigitalPhotoCard.vue'
import { DefaultCards } from '@/config/constant'
import { ImageAssetService } from '@/http/services/ImageAssetService'
import { LoadingService } from '@/http/extends/loading.service'

const newPhoto = reactive({
  id: '',
  image: '',
})

const service = new ImageAssetService()
const loadingStatus = ref(false)
const loadingService = new LoadingService(loadingStatus)

function onImageUpload(id: string, url: string) {
  ElMessage.success('照片上传成功')
  newPhoto.id = id
  newPhoto.image = url

  service.facedetect(id, [loadingService]).then(() => {
    ElMessage.success('人脸检测完成，请开始制作')
  }).catch(({ msg }) => {
    ElMessage.error(msg ?? '照片人脸检测失败')
  })
}
</script>

<template>
  <div v-loading="loadingStatus" class="page digital-view" element-loading-text="人脸检测中...">
    <div class="page-header">
      <DigitalTabs />
    </div>
    <div class="page-content">
      <DigitalPhotoUpload @uploaded="onImageUpload" />
      <DigitalPhotoCard v-if="newPhoto.id" label="原始照片" :image="newPhoto.image" />
      <template v-for="item of DefaultCards " :key="item.label">
        <DigitalPhotoCard local :label="item.label" :image="item.image" />
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.digital-view {
  @apply flex flex-col;
}

.page-header {
  @apply p-4;
}

.page-content {
  @apply p-4 grid grid-cols-4 gap-3;
}
</style>
