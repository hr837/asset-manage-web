<script lang="ts" setup>

</script>

<template>
  <div class="component digital-tabs">
    <div class="tab is-active">
      <div class="tab-content">
        <img class="icon" src="/images/digital/digital-card-icon.png" alt="s">
        <div class="label">
          照片会说话
        </div>
      </div>
    </div>
    <div class="tab disabled">
      <div class="tab-content">
        <img class="icon" src="/images/digital/digital-person-icon.png" alt="s">
        <div class="label">
          <div>数字人制作</div>
          <div class="text-sm text-gray-300">
            敬请期待...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.digital-tabs {
  @apply flex gap-x-4;
}

.tab {
  width: 284px;
  height: 71px;
  background: url('/public/images/digital/digital-tab-bg-2.jpg') no-repeat left top /contain;
  @apply cursor-pointer;

  &.is-active {
    background-image: url('/public/images/digital/digital-tab-bg.jpg');
  }

  &.disabled {
    cursor: not-allowed;
  }

  .tab-content {
    @apply flex items-center h-16;

    .icon {
      @apply w-9 h-9 ml-6;
    }

    .label {
      @apply ml-2 text-gray-700;
    }
  }
}
</style>
