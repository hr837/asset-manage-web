<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import DigitalSoundItem from './DigitalSoundItem.vue'
import { DefaultSounds } from '@/config/constant'

defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [val: string] }>()

const idList = ref<string[]>([])

const formModel = reactive({
  lang: 'CN',
  type: '',
})

watch(() => formModel, () => {
  idList.value = DefaultSounds.filter((x) => {
    const c1 = x.lang === formModel.lang
    const c2 = formModel.type ? x.type === formModel.type : true
    return c1 && c2
  }).map(x => x.id)
}
, { immediate: true, deep: true })
</script>

<template>
  <el-tabs class="component digital-sound-select" active-name="default">
    <el-tab-pane label="预设声音" name="default">
      <div class="sound-query">
        <el-select v-model="formModel.lang">
          <el-option label="中文" value="CN" />
          <el-option label="英文" value="EN" />
        </el-select>
        <el-select v-model="formModel.type">
          <el-option label="全部" value="" />
          <el-option label="男声" value="male" />
          <el-option label="女声" value="female" />
        </el-select>
      </div>
      <div class="sound-list">
        <div v-for="id of idList" :key="id" class="sound-item-wrapper">
          <DigitalSoundItem :id="id" can-play @click="$emit('update:modelValue', id)" />
          <div v-if="modelValue === id" class="sound-item-checked">
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
  @apply grid grid-cols-2 gap-4;

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
