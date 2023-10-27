<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import LoginForm from './components/LoginForm.vue'
import type { CodeFormData, FormType } from '@/types/login.type'
import DragVerify from '@/components/common/DragVerify.vue'
import { LoadingService } from '@/http/extends/loading.service'
import { LoginService } from '@/http/services/LoginService'
import { useUserStore } from '@/store/user.store'
const title = process.env.VUE_APP_TITLE

const tabActive = ref<FormType>('code')

const countDown = ref(0)
const showCountDown = ref(false)
const loadingStatus = ref(false)
const formRef = ref()

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
const service = new LoginService()

let tmpPhoneNumber = ''

function sendMessage() {
  service.getSmsCode(tmpPhoneNumber).then(() => {
    showDialog.value = false
    startCount()
    ElMessage.success('验证码已发送，请注意查收短信')
  }).catch(({ msg }) => ElMessage.error(msg ?? '获取验证码失败，请稍后重试'))
}

async function onSendMessageClick() {
  const phone = await formRef.value?.getPhoneNumber()
  if (!phone)
    return
  tmpPhoneNumber = phone
  if (verified.value)
    sendMessage()
  else
    showDialog.value = true
}

function onDragVerified() {
  verified.value = true
  sendMessage()
}

const loadingService = new LoadingService(loadingStatus)
const userStore = useUserStore()
const router = useRouter()
function onLogin(data: CodeFormData) {
  service.smsCodeLogin({ phone: data.phone, smsCode: data.code }, [loadingService])
    .then((res) => {
      userStore.updateToken(res.token)
      router.push('/index')
    }).catch(({ msg }) => ElMessage.error(msg ?? '登录失败，请稍后重试'))
}

onUnmounted(() => window.clearInterval(timerId))
const countDownText = computed(() => `${countDown.value}s后重试`)
</script>

<template>
  <div class="login">
    <div class="login-left">
      <div class="login-left-bg" />
      <div class="login-left-content">
        <div class="sys-name">
          {{ title }}
        </div>
        <img class="login-img" src="/images/login/login-front.png" alt="login-front.jpg">
      </div>
    </div>
    <div class="login-right">
      <div class="login-right-content">
        <div class="login-title">
          登录
        </div>
        <div class="login-tips">
          请在下面录入信息登录
        </div>
        <LoginForm ref="formRef" :loading="false" @submit="onLogin">
          <template #verify>
            <el-button v-if="!showCountDown" type="primary" text @click="onSendMessageClick">
              获取验证码
            </el-button>
            <span v-else class="leading-10">{{ countDownText }}</span>
          </template>
        </LoginForm>
      </div>
    </div>
    <el-dialog v-model="showDialog" title="请完成安全验证" width="400px" align-center>
      <Transition name="el-zoom-in-top">
        <DragVerify v-if="!verified" @success="onDragVerified" />
        <el-result v-else class="verify-success" title="验证成功" icon="success" />
      </Transition>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.login {
  min-width: 1200px;
  min-height: 590px;
  @apply h-full w-full grid grid-cols-2;

  .verify-success {
    --el-result-padding: 0;
  }
}

.login-left {
  @apply relative select-none;

  .login-left-bg {
    @apply absolute w-3/4 h-full left-0  bg-no-repeat bg-cover bg-left;
  }

  .login-left-content {
    @apply absolute right-20;
    top: 6.6%;
    bottom: 6.6%;

    .sys-name {
      @apply absolute text-white text-3xl font-semibold tracking-widest;
      top: 5%;
      left: 7.9%;
    }

    .login-img {
      @apply w-full h-full object-cover rounded-2xl;
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

}
</style>
