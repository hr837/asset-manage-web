<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import DigitalTabs from './components/DigitalTabs.vue'
import DigitalPhotoUpload from './components/DigitalPhotoUpload.vue'
import DigitalPhotoCard from './components/DigitalPhotoCard.vue'
import { DefaultCards } from '@/config/constant'

const router = useRouter()

function onPhotoEdit(id: string) {
  router.push({ name: 'AssetPhotoEdit', query: { id } })
}

function onImageUpload(id: string) {
  ElMessage.success('照片上传成功,请开始编辑')
  onPhotoEdit(id)
}
</script>

<template>
  <div class="page digital-view">
    <div class="page-header">
      <DigitalTabs />
    </div>
    <div class="page-content">
      <DigitalPhotoUpload type="drag" @uploaded="onImageUpload" />
      <template v-for="item of DefaultCards " :key="item.label">
        <DigitalPhotoCard local :label="item.label" :image="item.image" @edit="() => onPhotoEdit(item.id)" />
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
