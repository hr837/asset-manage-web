<script lang="ts" setup>
import DigitalSoundItem from './DigitalSoundItem.vue'
import type { SoundInfo } from '@/types/digital-asset.type'

const soundDefaultSetting: SoundInfo[] = [
  { id: '001', name: '清澈音', lang: 'CN', tags: ['可爱', '温柔', '甜美'], url: 'xxxxx', type: 'female' },
  { id: '002', name: '清澈音', lang: 'CN', tags: ['可爱', '温柔', '甜美'], url: 'xxxxx', type: 'female' },
  { id: '003', name: '清澈音', lang: 'CN', tags: ['可爱', '温柔', '甜美'], url: 'xxxxx', type: 'female' },
  { id: '004', name: '清澈音', lang: 'CN', tags: ['可爱', '温柔', '甜美'], url: 'xxxxx', type: 'female' },
  { id: '005', name: '清澈音', lang: 'CN', tags: ['可爱', '温柔', '甜美'], url: 'xxxxx', type: 'female' },
  { id: '006', name: '男低音', lang: 'CN', tags: ['磁性', '温暖', '刚强'], url: 'xxxxx', type: 'male' },
]
</script>

<template>
  <div class="component digital-sound-select">
    <div>Form select</div>
    <div class="sound-list">
      <DigitalSoundItem v-for="item of soundDefaultSetting" v-bind="item" :key="item.id" can-play />
    </div>
  </div>
</template>

<style lang="less" scoped>
.sound-list{
  @apply grid grid-cols-2 gap-4;
}
</style>
