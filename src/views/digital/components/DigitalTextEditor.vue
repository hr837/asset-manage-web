<script lang="ts" setup>
import { computed, ref } from 'vue'
import DigitalSoundPlayer from './DigitalSoundPlayer.vue'

const props = defineProps<{
  /** 文案列表 */
  modelValue: string[]
}>()

const emit = defineEmits<{ 'update:modelValue': [data: string[]] }>()

const inputText = ref('')

function onInputKeyEnter() {
  const text = inputText.value.trim()
  if (!text)
    return
  emit('update:modelValue', [...props.modelValue, text])
  inputText.value = ''
}

function onTextDel(index: number) {
  const list = [...props.modelValue]
  list.splice(index, 1)
  emit('update:modelValue', list)
}

const textList = computed(() => props.modelValue || [])
const disabled = computed(() => textList.value.length > 6)
</script>

<template>
  <div class="component digital-text-editor">
    <div v-for="(item, index) of textList" :key="`text-${index}`" class="digital-text-item">
      <DigitalSoundPlayer class="icon-play text-violet-500" src="/tmp/voice.m4a" />
      <div class="digital-text-item--content" @click="inputText = item">
        {{ item }}
      </div>
      <icon-park-solid-close-one class="text-red-500 icon-del" @click="onTextDel(index)" />
    </div>
    <el-input
      v-if="!disabled" v-model="inputText" type="textarea" :rows="1" placeholder="请输入声音文案"
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
    padding-top: 6px;
    @apply flex-1;
  }
}
</style>
