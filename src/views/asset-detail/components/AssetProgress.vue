<script lang="ts" setup>

</script>

<template>
  <div class="component asset-progress">
    <div class="box step-uploaded active">
      <div class="progress-title">
        上传完成
      </div>
      <div class="date-info">
        2023.10.08
      </div>
      <div class="date-info">
        11:22:33
      </div>
    </div>
    <div class="line step-queue-await active">
      <div class="line-top">
        排队中
      </div>
      <div class="horizontal-line" />
      <div class="line-bottom">
        预计等待时长
      </div>
    </div>
    <div class="box step-queue-end active">
      <div class="progress-title">
        排队完成
      </div>
      <div class="date-info">
        2023.10.08
      </div>
      <div class="date-info">
        11:22:33
      </div>
    </div>
    <div class="line step-transfrom active">
      <div class="line-top">
        排队完成
      </div>
      <div class="horizontal-line" />
      <div class="line-bottom" />
    </div>
    <div class="box step-finish error">
      <div class="progress-title">
        转换失败
      </div>
      <div class="date-info">
        2023.10.08
      </div>
      <div class="date-info">
        11:22:33
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-progress {
  @apply flex items-center;
}

.box {
  @apply h-20 w-32 flex flex-col justify-center items-center text-center border border-gray-100 rounded-xl;

  &.active {
    @apply border-violet-400 text-violet-400;
  }

  &.error{
    @apply text-red-500 border-red-500 bg-red-100;
  }

  .date-info {
    @apply text-gray-400 text-xs;
  }

  .progress-title {
    @apply text-base font-semibold;
  }
}

.line {
  @apply flex-1 flex flex-col justify-center items-center text-sm;

  &.active {
    @apply text-violet-400;

    .horizontal-line {
      @apply text-violet-400 bg-violet-400;
    }
  }

  .line-top,
  .line-bottom {
    @apply h-8 leading-8;
  }

  .horizontal-line {
    @apply h-px w-full bg-gray-300;
  }
}
</style>
