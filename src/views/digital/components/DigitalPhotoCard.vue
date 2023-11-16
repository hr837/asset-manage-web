<script lang="ts" setup>
import { getFilePath } from '@/utils/file.util'

interface PropInterface {
  /** 卡片标题 */
  label: string
  /** 卡片图片 */
  image: string
  /** 是否默认图片 */
  isDefault?: boolean
}

defineProps<PropInterface>()
</script>

<template>
  <div class="component digital-photo-card">
    <div class="card-top">
      <div class="top-content">
        <div class="img-container" :class="{ circle: isDefault }">
          <img class="card-img" :src="getFilePath(image, 'image', '/data/')" alt="4.png">
        </div>
        <div v-if="isDefault" class="card-tag">
          Demo
        </div>
      </div>
      <slot />
    </div>
    <div class="card-bottom">
      {{ label }}
      <slot name="extra" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.digital-photo-card {
  @apply text-gray-700 rounded;

  &:hover {
    box-shadow: 0px 38px 76px 0px rgba(157, 113, 255, 0.2), 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
  }

  .card-top {
    background-color: #F8F4FF;
    height: 0;
    width: 100%;
    padding-bottom: 56%;
    @apply rounded relative select-none;

    .top-content {
      @apply absolute inset-x-0 inset-y-0 flex flex-col items-center;
    }

    .img-container {
      @apply overflow-hidden w-full flex-1;

      &.circle {
        width: calc(56% - 2rem);
        padding-top: 0.5rem;

        .card-img {
          @apply rounded-full h-full w-full object-cover;
        }
      }
    }
  }

  .card-img {
    @apply h-full w-full m-auto object-contain object-center;
    -webkit-user-drag: none;
  }

  .card-tag {
    @apply text-gray-400 bg-gray-200 text-sm rounded-e self-start h-6 leading-6 px-2;
  }

  .card-bottom {
    @apply self-start h-10 px-2 flex justify-between items-center;
  }

}
</style>
