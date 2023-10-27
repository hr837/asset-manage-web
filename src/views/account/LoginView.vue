<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import type { FormType } from '@/types/login.type'
import DragVerify from '@/components/common/DragVerify.vue'
const title = process.env.VUE_APP_TITLE

const tabActive = ref<FormType>('code')

const countDown = ref(0)
const showCountDown = ref(false)

let timerId = -1
function startCount() {
  countDown.value = 60
  showCountDown.value = true
  timerId = window.setInterval(() => {
    if (countDown.value === 1) {
      clearInterval(timerId)
      showCountDown.value = false
    }
    countDown.value -= 1
  }, 1000)
}

const verified = ref(false)
const showDialog = ref(false)

function sendMessage() {
  startCount()
}

function onSendMessageClick() {
  if (verified.value)
    sendMessage()
  else
    showDialog.value = true
}

function onDragVerified() {
  verified.value = true
  showDialog.value = false
  sendMessage()
}

onUnmounted(() => window.clearInterval(timerId))
const countDownText = computed(() => `${countDown.value}s后重试`)
</script>

<template>
  <div class="login">
    <div class="login-right-content">
      <div class="login-title">
        登录
      </div>
      <div class="login-tips">
        请在下面录入信息登录
      </div>
      <el-tabs v-model="tabActive">
        <el-tab-pane name="pwd" label="密码登录" />
        <el-tab-pane name="code" label="验证码登录" />
      </el-tabs>
      <LoginForm :type="tabActive" :loading="false">
        <template #verify>
          <el-button v-if="!showCountDown" type="text" @click="onSendMessageClick">
            发送验证码
          </el-button>
          <span v-else class="leading-10">{{ countDownText }}</span>
        </template>
      </LoginForm>

      <div class="login-other">
        <span>没有账户?</span>
        <RouterLink class="login-router-link" to="/register">
          立即注册
        </RouterLink>
      </div>
    </div>
    <el-dialog v-model="showDialog" title="请完成安全验证" width="400px" align-center>
      <DragVerify @success="onDragVerified" />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.login-left {
  @apply flex justify-center items-center relative select-none;

  .login-left-bg {
    @apply absolute w-3/4 h-full left-0 bg-no-repeat bg-cover bg-left;
  }

  .login-left-content {
    @apply px-16 relative;

    .sys-name {
      @apply absolute top-10 left-28 text-white text-3xl font-semibold tracking-widest;
    }

    .login-img {
      @apply rounded-2xl;
    }
  }
}

.login-right {
  @apply pl-16 flex flex-col justify-center;
  color: #3F2D66;

  .login-right-content {
    width: 450px;
  }

  .login-title {
    @apply text-3xl font-semibold tracking-widest;
  }

  .login-tips {
    @apply h-20 pt-3;
  }

  .login-other {
    @apply flex justify-between items-center h-20 border-t border-gray-100;

    .login-router-link {
      color: @color-primary;
      @apply font-semibold tracking-wider;
    }
  }

  :deep(.el-tabs) {
    --el-tabs-header-height: 32px;
    --el-text-color-primary: #909399;

    .el-tabs__item {
      font-size: 24px;
      line-height: 28px;
      user-select: none;
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }
  }
}
</style>
