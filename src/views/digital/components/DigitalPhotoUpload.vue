<script lang="ts" setup>
import { ElLoadingService, ElMessage, ElMessageBox } from 'element-plus'
import type { UploadInstance, UploadRawFile } from 'element-plus'
import { computed, ref } from 'vue'
import { getAuthorization } from '@/composables/http-header'

const props = defineProps<{
  /** 上传样式类型 */
  type: 'drag' | 'icon'
  /** 原始ID */
  oldId?: string
}>()
const emit = defineEmits<{ uploaded: [id: string] }>()

const uploadRef = ref<UploadInstance>()

let loadingInstance: any

// 上传前文件检查
function onBeforUpload(file: UploadRawFile) {
  if (file.type.startsWith('image')) {
    loadingInstance = ElLoadingService({
      lock: true,
      text: '文件上传中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    return true
  }
  else {
    ElMessage.error('请选择照片类型文件')
    return false
  }
}

// 上传失败提示
function uploadError() {
  ElMessage.error('上传失败，请重新上传')
  uploadRef.value?.clearFiles()
  loadingInstance?.close()
}

// 上传成功向上发送事件
function uploadSuccess(res: HttpResponseBase) {
  loadingInstance?.close()
  uploadRef.value!.clearFiles()
  if (res.code !== '200')
    ElMessageBox.alert(res.msg, '上传失败', { type: 'error' })
  else
    emit('uploaded', res.data.fileId)
}

const uploadAction = computed(() => props.oldId ? '/api/image/changImage' : '/api/image/upload')
const extraData = computed(() => {
  const data: any = {
    parentId: 0,
  }
  if (props.oldId)
    data.olduploadFileId = props.oldId
  return data
})
</script>

<template>
  <div class="upload-photo" :class="type">
    <el-upload
      ref="uploadRef" :drag="type === 'drag'" :limit="1" :action="uploadAction" :show-file-list="false"
      accept=".png,.jpg" :on-success="uploadSuccess" :before-upload="onBeforUpload" :headers="getAuthorization()" :data="extraData"
      :on-error="uploadError"
    >
      <el-button v-if="type === 'icon'" circle type="primary">
        <icon-park-outline-picture-album />
      </el-button>
      <template v-else>
        <icon-park-outline-upload-one class="text-gray-200" />
        <el-button type="primary">
          上传照片
        </el-button>
      </template>
    </el-upload>
  </div>
</template>

<style lang="less">
.upload-photo {
  .el-upload {
    @apply h-full;
    --el-border-color: @color-primary;

    &-dragger {
      @apply h-full flex flex-col items-center;

      .iconify {
        @apply flex-1 h-full w-1/4;
      }
    }

    .el-button.is-circle {
      @apply p-0 w-9 h-9 text-xl;
    }
  }
}
</style>
