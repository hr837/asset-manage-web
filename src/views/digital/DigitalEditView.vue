<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DigitalSoundSelect from './components/DigitalSoundSelect.vue'
import DigitalPhotoUpload from './components/DigitalPhotoUpload.vue'
import { DefaultCards } from '@/config/constant'

const route = useRoute()
const router = useRouter()
const showDialog = ref(false)

const imageUrl = ref('')

const editModel = reactive({
  name: '照片1',
  shape: 'C',
  sound: '',
  textList: ['默认文案', ''],
})

function handleParamError() {
  ElMessage.error('页面参数错误')
  router.back()
}

onMounted(() => {
  const id = route.query.id as string
  if (!id)
    return handleParamError()

  if (id.startsWith('local')) {
    const item = DefaultCards.find(x => x.id === id)
    if (!item)
      return handleParamError()
    imageUrl.value = item.image
  }
})
</script>

<template>
  <el-container class="page digital-edit">
    <el-header class="flex items-center border-b" style="--el-header-height:50px">
      <RouterLink to="/digital">
        <icon-park-outline-arrow-left />
      </RouterLink>
      <span class="ml-4">照片编辑</span>
    </el-header>
    <el-main class="flex p-0">
      <div class="edit-photo">
        <DigitalPhotoUpload type="icon" class="self-end" />
        <div class="image-container">
          <div class="image-wrapper" :class="editModel.shape">
            <img class="edit-image" :src="imageUrl" alt="编辑照片">
          </div>
        </div>
      </div>
      <el-form class="edit-form" label-position="top" :model="editModel">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editModel.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="尺寸" prop="shape">
          <el-radio-group v-model="editModel.shape">
            <el-radio label="O" size="large">
              原始
            </el-radio>
            <el-radio label="C" size="large">
              圆形
            </el-radio>
            <el-radio label="S" size="large" disabled>
              正方形
            </el-radio>
            <el-radio label="L" size="large" disabled>
              2:3
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="声音" prop="sound">
          <div>TODO</div>
        </el-form-item>
        <el-form-item label="文案内容" prop="textList">
          TODO
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="flex justify-end items-center border-t">
      <el-button>仅保存</el-button>
      <el-button type="primary">
        开始生成
      </el-button>
    </el-footer>
    <el-dialog v-model="showDialog" title="AI声音" width="800px">
      <DigitalSoundSelect />
    </el-dialog>
  </el-container>
</template>

<style lang="less" scoped>
.edit-photo {
  @apply flex-1 p-4 bg-purple-50 flex flex-col gap-4;

  .image-container {
    @apply flex-1 flex justify-center items-center overflow-hidden;
  }

  .image-wrapper {
    @apply overflow-hidden transition-all;

    &.O {
      @apply h-full;

      .edit-image {
        @apply object-contain h-full;
      }
    }

    &.C {
      height: 0;
      width: 0;
      padding-top: 50%;
      position: relative;
      padding-left: 50%;

      .edit-image {
        @apply absolute inset-x-0 inset-y-0 w-full h-full object-cover rounded-full;
      }
    }
  }

  .edit-image {
    @apply object-center;
  }
}

.edit-form {
  @apply w-128 p-5;
}
</style>
