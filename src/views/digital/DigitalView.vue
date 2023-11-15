<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import DigitalTabs from './components/DigitalTabs.vue'
import DigitalPhotoUpload from './components/DigitalPhotoUpload.vue'
import DigitalPhotoCard from './components/DigitalPhotoCard.vue'
import { getImages } from './composable/default-data'
import type { ImageTempleteOutput } from '@/http/models/asset-image.model'
import type { ImageSource } from '@/types/digital-asset.type'

const router = useRouter()

function onPhotoEdit(id: string, source: ImageSource = 'd') {
  router.push({ name: 'AssetPhotoEdit', query: { id, s: source } })
}

function onImageUpload(id: string) {
  ElMessage.success('照片上传成功,请开始编辑')
  onPhotoEdit(id, 'u')
}

const defaultImages = ref<ImageTempleteOutput[]>([])

// 获取默认图片
getImages()
  .then(data => defaultImages.value = data)
  .catch(() => {
    ElMessage.warning('获取默认图片失败')
  })
</script>

<template>
  <div class="page digital-view">
    <div class="page-header">
      <DigitalTabs />
    </div>
    <div class="page-content">
      <DigitalPhotoUpload type="drag" @uploaded="onImageUpload" />
      <template v-for="item of defaultImages " :key="item.id">
        <DigitalPhotoCard is-default :label="item.name" :image="item.url" @edit="() => onPhotoEdit(item.id)" />
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
