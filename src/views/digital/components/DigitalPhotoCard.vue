<script lang="ts" setup>
interface PropInterface {
  /** 卡片标题 */
  label: string
  /** 卡片图片 */
  image: string
  /** 是否本地图片 */
  local?: boolean
}

const props = defineProps<PropInterface>()

defineEmits<{ edit: [] }>()
</script>

<template>
  <div class="component digital-photo-card">
    <div class="card-top">
      <div class="top-content">
        <div class="img-container" :class="{ circle: local }">
          <img class="card-img" :src="image" alt="4.png">
        </div>
        <div v-if="local" class="card-tag">
          Demo
        </div>
      </div>
      <el-button class="card-edit" circle size="large" @click="$emit('edit')">
        <icon-park-outline-edit />
      </el-button>
    </div>
    <div class="card-bottom">
      {{ label }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.digital-photo-card {
  @apply text-gray-700 rounded;

  &:hover {
    box-shadow: 0px 38px 76px 0px rgba(157, 113, 255, 0.2), 0px 0px 20px 0px rgba(0, 0, 0, 0.04);

    .card-edit {
      display: inline-flex;
    }
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
        @apply w-1/2 pt-2;

        .card-img {
          @apply rounded-full h-full w-auto;
        }
      }
    }
  }

  .card-img {
    @apply h-full w-full m-auto object-cover object-center;
    -webkit-user-drag: none;
  }

  .card-tag {
    padding: 2px 4px;
    @apply text-gray-400 bg-gray-200 text-sm rounded-e self-start;
  }

  .card-bottom {
    @apply self-start p-2;
  }

  .card-edit {
    --el-button-size: 48px;
    @apply absolute hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 text-2xl;

  }

}
</style>
