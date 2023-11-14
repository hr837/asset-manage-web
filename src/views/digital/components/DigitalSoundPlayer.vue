<script lang="ts" setup>
import { ref } from 'vue'
import { playAudio, stopAudio } from '../composable/audio-player'

const props = defineProps<{
  src: string
}>()

const playing = ref(false)

function onPlayClick() {
  playAudio({
    src: props.src,
    change: v => playing.value = v,
  })
  playing.value = true
}

function onStopClick() {
  stopAudio()
}
</script>

<template>
  <div class="component digital-sound-player">
    <icon-park-solid-play v-if="!playing" @click.stop="onPlayClick" />
    <icon-park-solid-volume-notice v-else @click.stop="onStopClick" />
  </div>
</template>

<style lang="less" scoped>
.digital-sound-player {
  @apply cursor-pointer;

  .icon-park-solid-volume-notice {
    @apply animate-pulse;
  }
}
</style>
