<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormRules } from './composable/form-help'
import DigitalSoundSelect from './components/DigitalSoundSelect.vue'
import DigitalPhotoUpload from './components/DigitalPhotoUpload.vue'
import DigitalTextEditor from './components/DigitalTextEditor.vue'
import DigitalSoundItem from './components/DigitalSoundItem.vue'
import { getImages, getVoices } from './composable/default-data'
import { ImageAssetService } from '@/http/services/ImageAssetService'
import { getFilePath } from '@/utils/file.util'
import type { VoiceTempleteOutput } from '@/http/models/asset-image.model'
import type { ImageSource } from '@/types/digital-asset.type'

const route = useRoute()
const router = useRouter()
const showDialog = ref(false)
const formRef = ref<FormInstance>()
const imageUrl = ref('')
const service = new ImageAssetService()

const editModel = reactive({
  name: '照片1',
  shape: 'C',
  soundId: '1001',
  textList: [],
})

function handleParamError() {
  ElMessage.error('页面参数错误')
  router.back()
}

const httpAssetId = ref<string | undefined>(undefined)
const soundList = ref<VoiceTempleteOutput[]>([])

onMounted(() => {
  const id = route.query.id as string
  const source = route.query.s as ImageSource
  if (source === 'd') {
    // 默认图片，尝试走缓存获取
    getImages().then((data) => {
      const item = data.find(x => x.id === id as string)
      if (!item)
        return handleParamError()
      imageUrl.value = getFilePath(item.url, 'image', '/data/')
    }).catch(handleParamError)
  }
  else {
    // 用户上传，走服务器资源获取
    service.query(id).then((data) => {
      httpAssetId.value = id
      imageUrl.value = getFilePath(data.sourceFileUrl, 'image', '/data/')
      editModel.name = data.name || '照片1'
      editModel.soundId = '?'
    }).catch(handleParamError)
  }
  // 获取声音
  getVoices().then(data => soundList.value = data).catch(() => ElMessage.error('声音列表获取失败'))
})

function onImageChanged(newId: string) {
  router.push({ query: { id: newId } })
  httpAssetId.value = newId
  service.query(newId).then((data) => {
    imageUrl.value = getFilePath(data.sourceFileUrl, 'image', '/data/')
  }).catch(() => { ElMessage.error('获取图片失败') })
}

function onSoundSelectClick() {
  //
}

function onSelectDialogClose() {
  // TODO 从服务器获取新的语音文档
}

async function onSubmitClick() {
  const result = await formRef.value?.validate().then(() => true).catch(() => false)
}

// 当前选择的声音
const currentVoice = computed(() => soundList.value.find(x => x.id === editModel.soundId))
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
        <el-tooltip content="替换照片" placement="top">
          <DigitalPhotoUpload type="icon" class="self-end" :old-id="httpAssetId" @uploaded="onImageChanged" />
        </el-tooltip>
        <div class="image-container">
          <div class="image-wrapper" :class="editModel.shape">
            <img class="edit-image" :src="imageUrl" alt="编辑照片">
          </div>
        </div>
      </div>
      <el-form ref="formRef" class="edit-form" label-position="top" :model="editModel" size="large">
        <el-form-item label="名称" prop="name" :rules="FormRules.name">
          <el-input v-model="editModel.name" placeholder="请输入名称" maxlength="10" />
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
        <el-form-item v-if="currentVoice" prop="sound">
          <template #label>
            <div class="flex items-center gap-2">
              <span>声音</span>
              <el-tooltip content="更换声音" placement="right">
                <icon-park-outline-refresh
                  class="text-violet-500 cursor-pointer focus:outline-none"
                  @click="showDialog = true"
                />
              </el-tooltip>
            </div>
          </template>
          <DigitalSoundItem v-bind="currentVoice" />
        </el-form-item>
        <el-form-item label="文案内容" prop="textList" :rules="FormRules.list as any">
          <DigitalTextEditor v-if="currentVoice" v-model="editModel.textList" :audio-id="currentVoice.id" />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="flex justify-end items-center border-t">
      <el-button>仅保存</el-button>
      <el-button type="primary" @click="onSubmitClick">
        开始生成
      </el-button>
    </el-footer>
    <el-dialog v-model="showDialog" title="AI声音" width="800px" @close="onSelectDialogClose">
      <DigitalSoundSelect v-model="editModel.soundId" :source="soundList" />
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
        @apply object-contain;
      }
    }

    &.C {
      height: 0;
      width: 0;
      padding-top: 50%;
      position: relative;
      padding-left: 50%;

      .edit-image {
        @apply absolute inset-x-0 inset-y-0 w-full object-cover object-top rounded-full;
      }
    }
  }

  .edit-image {
    @apply object-center h-full;
  }
}

.edit-form {
  @apply w-128 p-5;

  :deep(.el-form-item) {
    &__label {
      @apply text-sm text-black/50;
    }
  }
}

:deep(.el-dialog__body) {
  padding-top: 16px;
}
</style>
