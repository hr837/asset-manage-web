<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { nanoid } from 'nanoid'
import LoginForm from './components/LoginForm.vue'
import type { LoginInput } from '@/http/models/login.model'
import { LoginService } from '@/http/services/LoginService'
import { LoadingService } from '@/http/extends/loading.service'
import { useUserStore } from '@/store/user.store'

const router = useRouter()
const appTitle = process.env.VUE_APP_TITLE
const userStore = useUserStore()

const loginLoding = ref(false)
const logdingService = new LoadingService(loginLoding)
const service = new LoginService()

const patchcaKey = ref(nanoid())

function updatePatchKey() {
  patchcaKey.value = nanoid()
}

function onValidated(formData: LoginInput) {
  formData.patchcaKey = patchcaKey.value
  service.passwordLogin(formData, [logdingService]).then(({ token }) => {
    userStore.updateToken(token)
    router.replace('/index')
  }).catch(({ msg }) => {
    ElMessage.error(msg ?? '登录失败')
    updatePatchKey()
  })
}
</script>

<template>
  <div class="login bg-center bg-no-repeat">
    <div class="login-form-container">
      <div class="text-gray-400">
        <span class="text-5xl">Hello</span>
        <span class="pl-4 text-xl">欢迎登录</span>
      </div>
      <div class="login-title">
        {{ appTitle }}
      </div>

      <LoginForm :loading="loginLoding" :patchca-key="patchcaKey" @validated="onValidated" @chage-code="updatePatchKey" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.login {
  min-width: 780px;
  // background-image: url("/public/images/login/bg_login.jpg");
  background-image: linear-gradient(to right bottom, #370531, #510055, #670080, #7300b2, #7012eb);
  @apply h-full flex justify-end items-center;

  .login-form-container {
    @apply w-128 h-full p-12 bg-white ;
  }
  &-title{
    @apply py-32 text-center text-5xl text-purple-600 font-bold tracking-wide;
  }
}
</style>
