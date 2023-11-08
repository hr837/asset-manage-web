<script lang="ts" setup>
import DigitalTabs from './components/DigitalTabs.vue'
</script>

<template>
  <div class="page digital-view">
    <div class="page-header">
      <DigitalTabs />
    </div>
    <div class="page-content">
      <el-upload drag>
        <icon-park-outline-upload-one />
        <el-button type="primary">
          上传照片
        </el-button>
      </el-upload>
      <div class="template-item">
        <div class="template-top">
          <div class="top-content">
            <div class="template-img">
              123
            </div>
            <div class="template-tag">
              Demo
            </div>
          </div>
        </div>
        <div class="template-label">
          正方形
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.digital-view {
  @apply flex flex-col p-4;
}

.page-header {
  @apply p-4;
}

.page-content {
  @apply p-4 grid grid-cols-4 gap-3;

  .template-item {
    @apply flex flex-col items-center;

    .template-top {
      background-color: #F8F4FF;
      height: 0;
      width: 100%;
      padding-bottom: 56%;
      @apply rounded relative;
    }

    .top-content {
      @apply absolute inset-x-0 inset-y-0 flex flex-col items-center;
    }

    .template-img {
      @apply flex-1;
    }

    .template-tag {
      padding: 2px 4px;
      @apply text-gray-400 bg-gray-200 text-sm rounded self-start;
    }

  }
}
</style>
