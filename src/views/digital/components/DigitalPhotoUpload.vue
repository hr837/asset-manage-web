<script lang="ts" setup>
import { ElMessage, type UploadFile, type UploadInstance } from 'element-plus'
import { computed, ref, unref } from 'vue'
import type { FilePart } from '@/utils/file.util'
import { getSliceFileMd5 } from '@/utils/file.util'
import { FileUploadService } from '@/http/services/FileUploadService'

const props = defineProps<{ type: 'drag' | 'icon' }>()
const emit = defineEmits<{ uploaded: [id: string, src: string] }>()
interface filePartInfo extends FilePart {
  fileId: string
  uploaded: boolean
}

let successId = ''
// 待上传的文件
let uploadFile: File | null = null
// 文件分片
let partList: filePartInfo[] = []
// 2MB切割尺寸
const ChunkSize = 1024 * 1024 * 2

const uploadRef = ref<UploadInstance>()
const showDialog = ref(false)
const uploadPrecent = ref(0)
// 文件上传状态
const uploadStatus = ref<'await' | 'calc' | 'part' | 'success' | 'fail'>('await')

function onUploadFileChange(file: UploadFile) {
  const rowType = file.raw?.type
  if (!rowType || !rowType.startsWith('image')) {
    uploadRef.value!.handleRemove(file)
    return ElMessage.error('请选择照片类型文件')
  }
  showDialog.value = true
  uploadStatus.value = 'await'
  uploadFile = file.raw!
  preUploadFile()
}

const services = new FileUploadService()

function uploadSuccess() {
  uploadRef.value!.clearFiles()
  partList = []
  showDialog.value = false
  emit('uploaded', successId, URL.createObjectURL(uploadFile!))
}

function onCancelClick() {
  uploadRef.value!.clearFiles()
  partList = []
  showDialog.value = false
}

// 图片预上传
async function preUploadFile() {
  try {
    if (!uploadFile)
      return
    uploadStatus.value = 'calc'
    uploadPrecent.value = 0
    successId = ''
    const { md5, fileParts } = await getSliceFileMd5(uploadFile, ChunkSize, precent => uploadPrecent.value = precent)
    const { uploadFileId, fastUpload } = await services.imagePreUpload({
      fileSize: uploadFile.size,
      originFileName: uploadFile.name,
      parentId: 0,
      md5,
    })
    successId = uploadFileId
    if (fastUpload) {
      uploadSuccess()
    }
    else {
      partList = fileParts.map(part => ({ fileId: uploadFileId, uploaded: false, ...part }))
      uploadParts()
    }
  }
  catch (error: any) {
    uploadStatus.value = 'fail'
  }
}

// 分片上传
async function uploadParts() {
  uploadStatus.value = 'part'
  const partPrecent = partList.length ** -1 * 100
  const uploadTask = partList.filter(x => !x.uploaded).map((item) => {
    return services.partUpload({
      file: item.part,
      segmentSize: item.size,
      segmentIndex: item.index + 1,
      uploadFileId: item.fileId,
      usetype: '1',
    }).then((res) => {
      const originPart = partList.find(x => x.index === item.index)!
      // 设置分片上传后的状态
      originPart.uploaded = res.result
      // 设置百分比
      uploadPrecent.value += partPrecent
    })
  })
  return Promise.all(uploadTask)
    .then(uploadSuccess)
    .catch(() => {
      uploadStatus.value = 'fail'
    })
}

function onRetryClick() {
  if (partList.length)
    uploadParts()

  else
    preUploadFile()
}

const uploadInfo = computed(() => {
  const status = unref(uploadStatus)
  if (status === 'await')
    return '开始上传'
  else if (status === 'calc')
    return '计算分片中'
  else if (status === 'part')
    return '分片上传中'
  else if (status === 'fail')
    return '上传失败'
  else
    return '上传成功'
})
const stripedFlow = computed(() => uploadStatus.value === 'calc' || uploadStatus.value === 'part')
const progressStatus = computed(() => {
  if (uploadStatus.value === 'fail')
    return 'exception'
  else if (uploadStatus.value === 'success')
    return 'success'
  else
    return ''
})
</script>

<template>
  <div class="upload-photo" :class="type">
    <el-upload
      ref="uploadRef" :drag="type === 'drag'" :limit="1" :auto-upload="false" :show-file-list="false"
      accept=".png,.jpg" @change="onUploadFileChange"
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
    <el-dialog
      title="照片上传处理" :model-value="showDialog" width="500px" :close-on-click-modal="false" :show-close="false"
      align-center :close-on-press-escape="false"
    >
      <div class="upload-info">
        {{ uploadInfo }}
      </div>
      <el-progress
        :percentage="uploadPrecent" :stroke-width="15" striped :show-text="false" :status="progressStatus"
        :striped-flow="stripedFlow"
      />
      <div v-show="uploadStatus === 'fail'" class="mt-8 text-center">
        <el-button @click="onCancelClick">
          取消
        </el-button>
        <el-button type="primary" @click="onRetryClick">
          重新上传
        </el-button>
      </div>
    </el-dialog>
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
    .el-button.is-circle{
      @apply p-0 w-9 h-9 text-xl;
    }
  }
}
</style>
