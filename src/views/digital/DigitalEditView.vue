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
import type { ImageEditInput, VoiceTempleteOutput } from '@/http/models/asset-image.model'
import type { ImageSource, PhotoShape } from '@/types/digital-asset.type'
import { LoadingService } from '@/http/extends/loading.service'

const route = useRoute()
const router = useRouter()
const showDialog = ref(false)
const formRef = ref<FormInstance>()
const imageUrl = ref('')
const service = new ImageAssetService()

const editModel = reactive({
  name: '照片1',
  shape: 'C' as PhotoShape,
  soundId: '',
  textList: [] as string[],
})

const httpAssetId = ref<string | undefined>(undefined)
const soundList = ref<VoiceTempleteOutput[]>([])
const backRoutePath = ref('/digital')
// 当前选择的声音
const currentVoice = computed(() => soundList.value.find(x => x.id === editModel.soundId))
const loaidngStatus = ref(false)
const loadingService = new LoadingService(loaidngStatus)

// 获取路由参数，加载页面数据
onMounted(async () => {
  const back = router.options.history.state.back as string
  if (back)
    backRoutePath.value = back

  loaidngStatus.value = true
  const id = route.query.id as string
  const source = route.query.s as ImageSource

  try {
    // 先获取声音
    soundList.value = await getVoices().catch(() => {
      throw new Error('声音列表获取失败')
    })
    editModel.soundId = soundList.value[0].id

    if (source === 'd') {
      // 获取页面参数对应的默认图片
      const defualtImages = await getImages().catch(() => {
        throw new Error('获取图片失败')
      })
      const item = defualtImages.find(x => x.id === id as string)
      if (!item)
        throw new Error('页面参数错误')
      imageUrl.value = getFilePath(item.url, 'image', '/data/')
    }
    else {
      // 获取服务器图片资产信息并反显
      const data = await service.query(id).catch(() => {
        throw new Error('页面参数错误')
      })
      httpAssetId.value = id
      imageUrl.value = getFilePath(data.sourceFileUrl, 'image', '/data/')
      editModel.name = data.name
      editModel.soundId = data.audioId
      editModel.shape = data.shape
      editModel.textList = data.text.split('##', 0)
    }
  }
  catch (error: any) {
    ElMessage.error(error.message)
    // 发生错误，就返回上一个页面
    router.back()
  }
  finally {
    loaidngStatus.value = false
  }
})

// 用户再次更改图片，需要从服务器重新获取图片展示
function onImageChanged(newId: string) {
  router.push({ query: { id: newId } })
  httpAssetId.value = newId
  service.query(newId).then((data) => {
    imageUrl.value = getFilePath(data.sourceFileUrl, 'image', '/data/')
  }).catch(() => { ElMessage.error('获取图片失败') })
}

// 用户点击保存，不校验数据完整性
function onSaveClick() {
  const requestData: ImageEditInput = {
    id: route.query.id as string,
    name: editModel.name,
    shape: editModel.shape,
    audioId: currentVoice.value?.id ?? '',
    text: editModel.textList.join('##'),
    use_enhancer: 0,
  }

  service.imageEditSave(requestData, [loadingService])
    .then((data) => {
      ElMessage.success('保存成功')
      router.push({ query: { id: data.fileId, s: 'u' } })
    })
    .catch(({ msg }) => {
      ElMessage.error(msg ?? '图片编辑内容保存失败')
    })
}

// 用户提交生成任务，校验表单并生成
async function onSubmitClick() {
  const result = await formRef.value?.validate().then(() => true).catch(() => false)
  if (!result)
    return

  if (!currentVoice.value) {
    ElMessage.error('请选择声音')
    return
  }

  const requestData: ImageEditInput = {
    id: route.query.id as string,
    name: editModel.name,
    shape: editModel.shape,
    audioId: currentVoice.value.id,
    text: editModel.textList.join('##'),
    use_enhancer: 1,
  }

  service.imageGenerateVideo(requestData, [loadingService])
    .then(() => {
      ElMessage.success('开始生成')
      router.push('/zone')
    })
    .catch(({ msg }) => {
      ElMessage.error(msg ?? '图片生成视频任务失败')
    })
}
</script>

<template>
  <el-container v-loading="loaidngStatus" class="page digital-edit">
    <el-header class="flex items-center border-b">
      <RouterLink :to="backRoutePath">
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
        <el-form-item prop="soundId" label="声音" :rules="FormRules.sound" class="form-item--sound">
          <template v-if="currentVoice">
            <DigitalSoundItem class="flex-1 !rounded-r-none" v-bind="currentVoice" />
            <div class="sound-change" @click="showDialog = true">
              <icon-park-outline-right class="text-2xl " />
            </div>
          </template>
        </el-form-item>
        <el-form-item label="文案内容" prop="textList" :rules="FormRules.list as any">
          <DigitalTextEditor v-if="currentVoice" v-model="editModel.textList" :audio-id="currentVoice.id" />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="flex justify-end items-center border-t">
      <el-button @click="onSaveClick">
        仅保存
      </el-button>
      <el-tooltip content="生成会说话的照片">
        <el-button type="primary" @click="onSubmitClick">
          开始生成
        </el-button>
      </el-tooltip>
    </el-footer>
    <el-dialog v-model="showDialog" title="AI声音" width="800">
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

    &.form-item--sound .el-form-item__content {
      align-items: stretch;

      .sound-change {
        @apply inline-flex items-center border border-gray-100 border-l-0 px-1 rounded-r cursor-pointer text-gray-300 hover:text-gray-400 hover:bg-gray-100;
      }
    }
  }
}

.digital-edit {
  :deep(.el-dialog__body) {
    padding-top: 16px;
  }
}
</style>
