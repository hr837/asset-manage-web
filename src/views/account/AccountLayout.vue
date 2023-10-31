<script lang="ts" setup>
// 登录页面 注册页面 修改密码页面共用布局
const title = process.env.VUE_APP_TITLE
</script>

<template>
  <div class="account-layout">
    <div class="account-layout-left">
      <div class="left-content">
        <div class="left-content-title">
          {{ title }}
        </div>
        <img class="left-content-img" src="/images/login-front.png" alt="login-front.jpg">
      </div>
    </div>
    <div class="account-layout-right">
      <RouterView />
    </div>
  </div>
</template>

<style lang="less" scoped>
.account-layout {
  min-width: 1200px;
  min-height: 590px;
  @apply h-full w-full grid grid-cols-2;
}

.account-layout-left {
  background: url('/public/images/login-bg.jpg') no-repeat left/75% 100%, #fff;
  @apply relative select-none;
}

.left-content {
  @apply absolute right-20;
  top: 6.6%;
  bottom: 6.6%;

  &-title {
    @apply absolute text-white text-3xl font-semibold tracking-widest;
    top: 5%;
    left: 7.9%;
  }

  &-img {
    @apply w-full h-full object-cover rounded-2xl;
  }
}

.account-layout-right {
  @apply pl-16 flex flex-col justify-center items-start;
  color: #3F2D66;

  --el-component-size-large: 64px;
  --el-font-size-base: 16px;

  :deep(.el-form-item) {
    position: relative;
    --el-border-radius-base: 10px;

    .iconify {
      color: @color-primary;
    }

    &.el-form-item--large {
      @apply mt-6 mb-10;

      .el-form-item__label {
        color: #3C4071;
        @apply text-xs h-auto absolute bg-white px-2 z-10 -top-2 left-2 transition-all;

        &::before {
          display: none;
        }
      }

      .el-input__prefix {
        @apply text-xl px-3;
      }
    }

    &.el-form-item__content {
      @apply leading-10;
    }

    &.form-item--submit {
      @apply mb-8;

      .el-button {
        height: 60px;
        @apply w-full rounded-lg text-xl font-semibold tracking-widest;
      }
    }

  }
}
</style>
