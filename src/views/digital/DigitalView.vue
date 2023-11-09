<script lang="ts" setup>
import DigitalTabs from './components/DigitalTabs.vue'
import UploadPhoto from './components/UploadPhoto.vue'
</script>

<template>
  <div class="page digital-view">
    <div class="page-header">
      <DigitalTabs />
    </div>
    <div class="page-content">
      <UploadPhoto />
      <div class="template-item">
        <div class="template-top">
          <div class="template-top-content">
            <div class="content-img">
              <img class="template-img" src="/images/digital/templates/4.png" alt="4.png">
            </div>
            <div class="template-tag">
              Demo
            </div>
          </div>
        </div>
        <div class="template-bottom">
          正方形
        </div>
      </div>
      <div class="template-item">
        <div class="template-top">
          <div class="template-top-content">
            <div class="content-img">
              <img class="template-img" src="/images/digital/templates/4.png" alt="4.png">
            </div>
            <div class="template-tag">
              Demo
            </div>
          </div>
        </div>
        <div class="template-bottom">
          正方形
        </div>
      </div>
      <div class="template-item">
        <div class="template-top">
          <div class="template-top-content">
            <div class="content-img">
              <img class="template-img" src="/images/digital/templates/4.png" alt="4.png">
            </div>
            <div class="template-tag">
              Demo
            </div>
          </div>
        </div>
        <div class="template-bottom">
          正方形
        </div>
      </div>
      <div class="template-item">
        <div class="template-top">
          <div class="template-top-content">
            <div class="content-img">
              <img class="template-img" src="/images/digital/templates/4.png" alt="4.png">
            </div>
            <div class="template-tag">
              Demo
            </div>
          </div>
        </div>
        <div class="template-bottom">
          正方形
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.digital-view {
  @apply flex flex-col;
}

.page-header {
  @apply p-4;
}

.page-content {
  @apply p-4 grid grid-cols-4 gap-3;

  .template-item {
    @apply text-gray-700;

    .template-top {
      background-color: #F8F4FF;
      height: 0;
      width: 100%;
      padding-bottom: 56%;
      @apply rounded relative;

      &-content {
        @apply absolute inset-x-0 inset-y-0 flex flex-col items-center;
      }
    }

    .content-img {
      @apply w-1/2 pt-2 overflow-hidden;
    }

    .template-img {
      @apply h-full m-auto rounded-full object-cover object-center;
    }

    .template-tag {
      padding: 2px 4px;
      @apply text-gray-400 bg-gray-200 text-sm rounded self-start;
    }

    .template-bottom {
      @apply self-start p-2;
    }

  }
}
</style>
