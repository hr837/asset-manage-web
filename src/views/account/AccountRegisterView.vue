<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterVerifyForm from './components/RegisterVerifyForm.vue'
import RegisterSettingForm from './components/RegisterSettingForm.vue'
import type { RegisterFormData, SettingFormData } from '@/types/account.type'
import { LoginService } from '@/http/services/LoginService'
import type { RegisterInput } from '@/http/models/login.model'
import { LoadingService } from '@/http/extends/loading.service'
import { useUserStore } from '@/store/user.store'

const showSettingFrom = ref(false)

const registerData: RegisterInput = {
  phone: '',
  mail: '',
  password: '',
  token: '',
}

const userStore = useUserStore()
const router = useRouter()
const service = new LoginService()
const loadingStatus = ref(false)
const loadingService = new LoadingService(loadingStatus)

// 验证用户注册输入的验证码是否正确
function onRegistSubmit(data: RegisterFormData) {
  service.smsCodeCheck({ smsCode: data.code, phone: data.phone }, [loadingService])
    .then((res) => {
      registerData.phone = data.phone
      registerData.token = res.token
      // 进入设置页面
      showSettingFrom.value = true
    })
    .catch(({ msg }) => {
      ElMessage.error(msg ?? '短信验证码校验失败')
    })
}

// 获取验证码
const getCode = (phone: string) => service.getSmsCode(phone, [loadingService])
  .then(() => { ElMessage.success('验证码已发送，请注意查收短信') })
  .catch(({ msg }) => { ElMessage.error(msg ?? '获取验证码失败，请稍后重试') })

// 检查账号是否可用
const checkAccount = (account: string) => service.checkAccountExist(account, [loadingService])
  .then(res => !res.registed)
  .catch(({ msg }) => {
    ElMessage.error(msg ?? '获取验证码失败，请稍后重试')
    return false
  })

async function onSettingSubmit(data: SettingFormData) {
  const verified = await checkAccount(data.email)
  if (!verified)
    return
  registerData.mail = data.email
  registerData.password = data.password
  const res = await service.register(registerData, [loadingService]).catch(({ msg }) => {
    ElMessage.error(msg ?? '登录失败，请重试')
    return null
  })
  if (!res)
    return
  userStore.updateToken(res.token)
  router.push({ name: 'assets-manage' })
}

const formTitle = computed(() => showSettingFrom.value ? '最后一步' : '注册')
const formSubTitle = computed(() => showSettingFrom.value ? '补充信息，完成注册' : '请在下面录入信息注册')
</script>

<template>
  <div class="account-register">
    <div class="account-register-title">
      {{ formTitle }}
    </div>
    <div class="account-register-tips">
      {{ formSubTitle }}
    </div>
    <RegisterVerifyForm
      v-if="!showSettingFrom" :form-loading="loadingStatus" :get-code="getCode" :check-phone="checkAccount"
      @previous="showSettingFrom = false" @submit="onRegistSubmit"
    />
    <RegisterSettingForm v-else :form-loading="loadingStatus" @submit="onSettingSubmit" />
    <div class="account-register-other">
      <span>已有账号！</span>
      <RouterLink class="account-register-router-link" to="/login">
        直接登录
      </RouterLink>
    </div>
  </div>
</template>

<style lang="less" scoped>
.account-register {
  width: 450px;
  @apply pl-16 flex flex-col justify-center;

  .account-register-title {
    @apply text-3xl font-semibold tracking-widest;
  }

  .account-register-tips {
    @apply h-20 pt-3;
  }

  .account-register-other {
    @apply flex justify-between items-center h-20 border-t border-gray-100;

    .account-register-router-link {
      color: @color-primary;
      @apply font-semibold tracking-wider;
    }
  }

}
</style>
