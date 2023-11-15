<script lang="ts" setup>
import { computed } from 'vue'
import DigitalSoundPlayer from './DigitalSoundPlayer.vue'
import type { VoiceTempleteOutput } from '@/http/models/asset-image.model'
import { getFilePath } from '@/utils/file.util'

interface PropInterface extends VoiceTempleteOutput {
  /** 是否可播放 */
  canPlay?: boolean
}
const props = defineProps<PropInterface>()

defineEmits<{ 'play': [] }>()

const langName = computed(() => props.audioLanguage === 'zh' ? '中文' : '英文')
const soundTags = computed(() => props.audioTag.split(','))
</script>

<template>
  <div class="component digital-sound-item" :class="audioSex">
    <div class="sound-avatar">
      <icon-park-solid-avatar v-if="audioSex === 'male'" />
      <icon-park-solid-women v-else />
    </div>
    <div class="flex-1 px-2">
      <div class="flex items-center gap-1">
        <div class="sound-name">
          {{ name }}
        </div>
        <div class="sound-lang">
          {{ langName }}
        </div>
      </div>
      <div class="flex gap-1 mt-2">
        <div v-for="item of soundTags" :key="item" class="tag">
          {{ item }}
        </div>
      </div>
    </div>
    <div v-if="canPlay" class="sound-play">
      <DigitalSoundPlayer :src="getFilePath(url, 'audio', '/data/')" class="text-2xl" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.digital-sound-item {
  @apply w-full px-5 py-3 flex items-center rounded-lg select-none;

  &.male {
    background-color: rgba(235, 244, 255, 0.50);
    --card-avatar-bg: #ACBEFF;
    --color-primary: #1890FF;
    --color-second: fade(#1890FF, 15%);
  }

  &.female {
    background-color: rgba(242, 235, 255, 0.5);
    --card-avatar-bg: #B1ACFF;
    --color-primary: @color-primary;
    --color-second: fade(@color-primary, 15%);
  }

  .sound-avatar {
    background-color: var(--card-avatar-bg);
    @apply text-white w-14 h-14 text-4xl rounded-full overflow-hidden inline-flex justify-center items-end;

    .iconify {
      margin-bottom: -4px;
    }
  }

  .sound-name {
    @apply font-semibold text-black text-base;
  }

  .sound-play {
    color: var(--color-primary);
    @apply p-4;
  }

  .tag {
    @apply text-xs py-px px-1 rounded;
    background-color: var(--color-second);
    color: var(--color-primary);
  }

  .sound-lang {
    .tag();
    color: #fff;
    background-color: var(--color-primary);
  }

}
</style>
