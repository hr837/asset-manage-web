<script lang="ts" setup>
</script>

<template>
  <div class="component upload-description">
    <div class="upload-description-title">
      <icon-park-solid-blackboard />
      <span class="pl-1">上传须知</span>
    </div>
    <div class="upload-description-samples">
      <div v-for="item in 6" :key="`item-${item}`" class="upload-description-sample">
        <div class="upload-description-sample--img" />
        <div class="upload-description-sample--name">
          样例-{{ item }}
        </div>
      </div>
    </div>
    <ol class="upload-description-text">
      <li>视频为<b>单人清晰视频</b>，人物全身出现在视频中，人物大小不要太小</li>
      <li>确定视频的<b>清晰度足够高</b></li>
      <li>拍摄<b>设备高度与盆骨持平</b>，捕捉效果更佳</li>
      <li>目前版本<b>不支持怪兽，Q版体型</b></li>
    </ol>
  </div>
</template>

<style lang="less" scoped>
.upload-description{
  width: 400px;
  @apply rounded-lg bg-violet-50 p-4 px-6 text-sm;
  &-title{
    @apply text-amber-500 flex items-center text-lg py-2;
  }

  &-samples{
    @apply grid grid-cols-3 gap-6 my-2;
  }

  &-sample{
    @apply text-gray-500 ;
    &--img{
      height:150px;
      background: #fff;
    }
    &--name{
      @apply pt-2 text-center;
    }
  }

  &-text{
    @apply list-decimal list-inside text-gray-600;
    li{
      @apply pt-1;
      b {
        @apply text-rose-500;
      }
    }
  }
}
</style>
