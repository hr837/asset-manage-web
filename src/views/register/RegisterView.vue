<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import RegisterForm from './components/RegisterForm.vue'
import SettingForm from './components/SettingForm.vue'
import DragVerify from '@/components/common/DragVerify.vue'
import type { RegistStep } from '@/types/register.type'
const title = process.env.VUE_APP_TITLE

const currentSetp = ref<RegistStep>('verifycode')
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
const submitBtnText = computed(() => {
  switch (currentSetp.value) {
    case 'account':
      return '下一步'
    case 'verifycode':
      return '注册'
    default:
      return '登录'
  }
})

const showSettingFrom = ref(false)

function onRegistSubmit() {
  // send to server
  showSettingFrom.value = true
}

function onSettingSubmit() {
  showSettingFrom.value = false
}

const formTitle = computed(() => showSettingFrom.value ? '最后一步' : '注册')
const formSubTitle = computed(() => showSettingFrom.value ? '补充信息，完成注册' : '请在下面录入信息注册')
</script>

<template>
  <div class="register">
    <div class="register-left">
      <div class="register-left-bg" />
      <div class="register-left-content">
        <div class="sys-name">
          {{ title }}
        </div>
        <img class="register-img" src="/images/login/login-front.jpg" alt="register-front.jpg">
      </div>
    </div>
    <div class="register-right">
      <div class="register-right-content">
        <div class="register-title">
          {{ formTitle }}
        </div>
        <div class="register-tips">
          {{ formSubTitle }}
        </div>
        <RegisterForm
          v-if="!showSettingFrom" :step="currentSetp" @previous="currentSetp = 'account'"
          @submit="onRegistSubmit"
        >
          <template #verify>
            <el-button v-if="!showCountDown" type="text" @click="onSendMessageClick">
              发送验证码
            </el-button>
            <span v-else class="leading-10">{{ countDownText }}</span>
          </template>
        </RegisterForm>
        <SettingForm v-else @submit="onSettingSubmit" />
        <div class="register-other">
          <span>已有账号！</span>
          <RouterLink class="register-router-link" to="/login">
            直接登录
          </RouterLink>
        </div>
      </div>
    </div>
    <el-dialog v-model="showDialog" title="请完成安全验证" width="400px" align-center>
      <DragVerify @success="onDragVerified" />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.register {
  min-width: 1280px;
  min-height: 600px;
  @apply h-full w-full grid grid-cols-2;

}

.register-left {
  @apply flex justify-center items-center relative select-none;

  .register-left-bg {
    @apply absolute w-3/4 h-full left-0 bg-img-login bg-no-repeat bg-cover bg-left;
  }

  .register-left-content {
    @apply px-16 relative;

    .sys-name {
      @apply absolute top-10 left-28 text-white text-3xl font-semibold tracking-widest;
    }

    .register-img {
      @apply rounded-2xl;
    }
  }
}

.register-right {
  @apply pl-16 flex flex-col justify-center;
  color: #3F2D66;

  .register-right-content {
    width: 450px;
  }

  .register-title {
    @apply text-3xl font-semibold tracking-widest;
  }

  .register-tips {
    @apply h-20 pt-3;
  }

  .register-submit {
    @apply mt-6 mb-8;

    .el-button {
      @apply w-full h-16 rounded-lg text-2xl font-semibold tracking-widest;
    }
  }

  .register-other {
    @apply flex justify-between items-center h-20 border-t border-gray-100;

    .register-router-link {
      color: @color-primary;
      @apply font-semibold tracking-wider;
    }
  }

}
</style>
