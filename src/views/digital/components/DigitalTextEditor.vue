<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import DigitalSoundPlayer from './DigitalSoundPlayer.vue'
import { ImageAssetService } from '@/http/services/ImageAssetService'

/** 文本声音 */
interface TextSound {
  /** 声音文字 */
  text: string
  /** 声音文件地址 */
  url?: string
  status: 'success' | 'loading' | 'fail'
}

const props = defineProps<{
  audioId: string
  /** 文案列表 */
  modelValue: string[]
}>()

const emit = defineEmits<{ 'update:modelValue': [data: string[]] }>()

const inputText = ref('')

const service = new ImageAssetService()

const textSoundList = ref<TextSound[]>([])

function onInputKeyEnter() {
  const text = inputText.value.trim()
  if (!text)
    return
  const isExist = props.modelValue.findIndex(x => x === text) > -1
  if (isExist) {
    ElMessage.error('已存在相同文案')
    return
  }
  const newItem = reactive<TextSound>({ text, status: 'loading' })
  textSoundList.value.push(newItem)
  emit('update:modelValue', [...props.modelValue, text])
  service.genAudio({
    text,
    audio_id: props.audioId,
  }).then((data) => {
    if (data)
      newItem.status = 'success'

    else
      newItem.status = 'fail'
  }).catch(() => {
    newItem.status = 'fail'
    ElMessage.error('生成语音失败')
  })
  inputText.value = ''
}

function onTextDel(index: number) {
  const list = [...props.modelValue]
  textSoundList.value.splice(index, 1)
  list.splice(index, 1)
  emit('update:modelValue', list)
}

watch(() => props.audioId, () => {
  textSoundList.value.forEach((item) => {
    item.status = 'loading'
    return service.genAudio({
      text: item.text,
      audio_id: props.audioId,
    }).then((data) => {
      if (data)
        item.status = 'success'
      else
        item.status = 'fail'
    }).catch(() => item.status = 'fail')
  })
})

const disabled = computed(() => props.modelValue.length > 6)
</script>

<template>
  <div class="component digital-text-editor">
    <div v-for="(item, index) of textSoundList" :key="`text-${index}`" class="digital-text-item">
      <DigitalSoundPlayer v-if="item.status === 'success'" class="icon-play text-violet-500" src="/tmp/voice.m4a" />
      <icon-park-outline-refresh v-else-if="item.status === 'loading'" class="icon-loading text-gray-300 animate-spin" />
      <el-tooltip v-else content="生成失败" placement="left">
        <icon-park-outline-info class="icon-error text-red-500" />
      </el-tooltip>
      <div class="digital-text-item--content" @click="inputText = item.text">
        {{ item.text }}
      </div>
      <icon-park-solid-close-one class="text-red-500 icon-del" @click="onTextDel(index)" />
    </div>
    <el-input
      v-if="!disabled" v-model="inputText" type="textarea" placeholder="请输入声音文案"
      @keydown.prevent.enter="onInputKeyEnter"
    />
  </div>
</template>

<style lang="less" scoped>
.digital-text-editor {
  @apply w-full p-2 bg-gray-50 rounded;
}

.digital-text-item {
  @apply flex items-start mb-2 cursor-pointer;

  .icon-error,
  .icon-loading,
  .icon-del,
  .icon-play {
    @apply m-2;
  }

  .icon-del {
    display: none;
  }

  &:hover {
    @apply bg-gray-200 rounded;

    .icon-del {
      display: block;
    }
  }

  &--content {
    @apply flex-1 leading-4 py-2;
  }
}
</style>
