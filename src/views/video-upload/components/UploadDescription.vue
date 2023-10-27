<script lang="ts" setup>
const nameSetting = [
  { f: 'g.png', t: '绿色衣服' },
  { f: 's.png', t: '剧烈晃动' },
  { f: 'c.png', t: '长袍衣服' },
  { f: 'm.png', t: '多人' },
  { f: 'h.png', t: '半身' },
  { f: 'o.png', t: '脚部出界' },
]
</script>

<template>
  <div class="component upload-description">
    <ul class="description-items">
      <li>
        上传须知
        <ol class="description-text">
          <li>视频为<b>单人清晰视频</b>，人物全身出现在视频中，人物大小不要太小</li>
          <li>确定视频的<b>清晰度足够高</b></li>
          <li>拍摄<b>设备高度与盆骨持平</b>，捕捉效果更佳</li>
          <li>目前版本<b>不支持怪兽，Q版体型</b></li>
        </ol>
      </li>

      <li>
        错误示范
        <div class="description-samples">
          <div v-for="item of nameSetting" :key="item.f" class="description-sample">
            <img class="description-sample--img" :src="`/images/error-templates/${item.f}`" :alt="item.t">
            <div class="description-sample--name">
              {{ item.t }}
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.upload-description {
  @apply w-72 min-h-min rounded-lg bg-violet-50 p-4 px-6;
}

.description-items {
  @apply list-inside text-violet-500 text-base;

  >li {
    &::before {
      content: '';
      @apply inline-block bg-violet-500 w-2 h-2 mr-2 rounded-full align-middle;
    }
  }
}

.description-text {
  @apply list-decimal list-inside text-gray-500 text-sm pl-1 my-2;

  li {
    @apply py-1;

    b {
      @apply text-violet-500;
    }
  }

}

.description {
  &-samples {
    @apply grid grid-cols-2 gap-3 mt-4;
  }

  &-sample {
    @apply text-white relative rounded overflow-hidden;

    &--img {
      @apply w-full h-36 object-cover;
    }

    &--name {
      @apply absolute left-0 bottom-0 w-full py-1 text-sm text-center bg-red-500/40;
    }
  }
}
</style>
