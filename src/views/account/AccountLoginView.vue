<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import LoginPasswordForm from './components/LoginPasswordForm.vue'
import LoginCodeForm from './components/LoginCodeForm.vue'
import type { CodeFormData, LoginType } from '@/types/account.type'
import { LoginService } from '@/http/services/LoginService'
import type { PasswordLoginInput, SmsCodeLoginInput } from '@/http/models/login.model'
import { LoadingService } from '@/http/extends/loading.service'
import { useUserStore } from '@/store/user.store'

const tabActive = ref<LoginType>('pwd')
const service = new LoginService()

const router = useRouter()
// 忘记密码
const onForgot = () => router.push({ name: 'account-repair' })
// 获取验证码
const getCode = (phone: string) => service.getSmsCode(phone)
  .then(() => { ElMessage.success('验证码已发送，请注意查收短信') })
  .catch(({ msg }) => { ElMessage.error(msg ?? '获取验证码失败，请稍后重试') })

const formValid = reactive({
  pwd: false,
  code: false,
})

const tabFromValid = computed(() => tabActive.value === 'code' ? formValid.code : formValid.pwd)
const pwdFormRef = ref()
const codeFormRef = ref()
const loadingStatus = ref(false)
const loadingService = new LoadingService(loadingStatus)
const userStore = useUserStore()
const remember = ref(false)

function onSubmit() {
  let task: Promise<any>
  if (tabActive.value === 'code') {
    const formData = codeFormRef.value!.getFormData() as CodeFormData
    const loginData: SmsCodeLoginInput = {
      phone: formData.phone,
      smsCode: formData.code,
    }
    task = service.smsCodeLogin(loginData, [loadingService])
  }
  else {
    const formData = pwdFormRef.value!.getFormData() as PasswordLoginInput
    task = service.passwordLogin(formData, [loadingService])
  }
  task.then(({ token }) => {
    userStore.updateToken(token, remember.value)
    router.push({ name: 'assets-manage' })
  }).catch(({ msg }) => ElMessage.error(msg ?? '登录失败，请稍后重试'))
}
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
        <LoginPasswordForm ref="pwdFormRef" @forgot="onForgot" @validate="val => formValid.pwd = val" />
      </el-tab-pane>
      <el-tab-pane name="code" label="验证码登录">
        <LoginCodeForm ref="codeFormRef" :get-code="getCode" @validate="val => formValid.code = val" />
      </el-tab-pane>
    </el-tabs>
    <div class="mb-4">
      <el-checkbox v-model="remember">
        七天免登录
      </el-checkbox>
    </div>
    <div class="el-form-item form-item--submit">
      <el-button type="primary" size="large" :disabled="!tabFromValid" @click="onSubmit">
        登录
      </el-button>
    </div>

    <div class="account-login-other">
      <span>没有账户?</span>
      <RouterLink class="account-login-router-link" to="/register">
        立即注册
      </RouterLink>
    </div>
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
