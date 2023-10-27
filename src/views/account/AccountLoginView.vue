<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import PasswordLoginForm from './components/PasswordLoginForm.vue'
import SmsCodeLoginForm from './components/SmsCodeLoginForm.vue'
import DragVerify from '@/components/common/DragVerify.vue'
import type { LoginType } from '@/types/login.type'

const tabActive = ref<LoginType>('pwd')
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
  <div class="account-login">
    <div class="account-login-title">
      登录
    </div>
    <div class="account-login-tips">
      请在下面录入信息登录
    </div>
    <el-tabs v-model="tabActive">
      <el-tab-pane name="pwd" label="密码登录">
        <PasswordLoginForm />
      </el-tab-pane>
      <el-tab-pane name="code" label="验证码登录">
        <SmsCodeLoginForm />
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-checkbox>七天免登录</el-checkbox>
    </div>
    <el-button type="primary" size="large">
      登录
    </el-button>

    <div class="account-login-other">
      <span>没有账户?</span>
      <RouterLink class="account-login-router-link" to="/register">
        立即注册
      </RouterLink>
    </div>
    <el-dialog v-model="showDialog" title="请完成安全验证" width="400px" align-center>
      <DragVerify @success="onDragVerified" />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.account-login {
  width: 450px;
  @apply pl-16 flex flex-col justify-center;

  .account-login-title {
    @apply text-3xl font-semibold tracking-widest;
  }

  .account-login-tips {
    @apply h-20 pt-3;
  }

  .account-login-other {
    @apply flex justify-between items-center h-20 border-t border-gray-100;

    .account-login-router-link {
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
