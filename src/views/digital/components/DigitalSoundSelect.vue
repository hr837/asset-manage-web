<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import DigitalSoundItem from './DigitalSoundItem.vue'
import type { VoiceTempleteOutput } from '@/http/models/asset-image.model'
import type { SoundLang, SoundType } from '@/types/digital-asset.type'

const props = defineProps<{ modelValue: string; source: VoiceTempleteOutput[] }>()
defineEmits<{ 'update:modelValue': [val: string] }>()
/** 声音过滤表单 */
export type VoiceFilterModel = Pick<VoiceTempleteOutput, 'audioLanguage' | 'audioSex'>

const formModel = reactive({
  audioLanguage: 'zh' as SoundLang,
  audioSex: 'all' as SoundType,
})

const filterData = ref<VoiceTempleteOutput[]>([])

watch(() => formModel, () => {
  filterData.value = props.source.filter((x) => {
    const c1 = x.audioLanguage === formModel.audioLanguage
    const c2 = formModel.audioSex === 'all' || x.audioSex === formModel.audioSex
    return c1 && c2
  })
}, { immediate: true, deep: true })
</script>

<template>
  <el-tabs class="component digital-sound-select" model-value="default">
    <el-tab-pane label="预设声音" name="default">
      <div class="sound-query">
        <el-select v-model="formModel.audioLanguage">
          <el-option label="中文" value="zh" />
          <el-option label="英文" value="cn" />
        </el-select>
        <el-select v-model="formModel.audioSex">
          <el-option label="全部" value="all" />
          <el-option label="男声" value="male" />
          <el-option label="女声" value="female" />
        </el-select>
      </div>
      <div class="sound-list">
        <div v-for="item of filterData" :key="item.id" class="sound-item-wrapper">
          <DigitalSoundItem v-bind="item" can-play @click="$emit('update:modelValue', item.id)" />
          <div v-if="modelValue === item.id" class="sound-item-checked">
            <icon-park-outline-check />
          </div>
        </div>
        <div class="sound-item-placeholder">
          更多声音，敬请期待~
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="我的声音" name="my" disabled />
  </el-tabs>
</template>

<style lang="less" scoped>
.sound-list {
  @apply grid grid-cols-2 auto-rows-min gap-4 h-128 overflow-auto;

  .sound-item-wrapper {
    @apply relative;

    .sound-item-checked {
      @apply absolute top-px right-px text-green-500 w-5 h-5 bg-white rounded-bl rounded-tr inline-flex justify-center;
    }
  }

  .sound-item-placeholder {
    background: url('/public/images/digital/sound-more.png') no-repeat center/cover;
    height: 84px;
    @apply select-none inline-flex items-center rounded-lg pl-6 text-violet-500;
  }
}

.sound-query {
  @apply flex gap-4 mb-6;

  .el-select {
    @apply w-28;
  }
}

.digital-sound-select {
  --el-tabs-header-height: 24px;
}

:deep(.el-tabs__header) {
  .el-tabs__nav-wrap::after {
    @apply w-0;
  }

  .el-tabs__item {
    @apply text-sm;

    &.is-active {
      @apply text-black font-bold;
    }
  }

  .el-tabs__active-bar {
    @apply !w-8 left-3;
  }
}
</style>
