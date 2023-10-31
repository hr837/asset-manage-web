<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import RepairVerifyForm from './components/RepairVerifyForm.vue'
import RepairPasswordForm from './components/RepairPasswordForm.vue'
import type { RegisterFormData } from '@/types/account.type'
import { LoginService } from '@/http/services/LoginService'
import type { RepairPasswordInput } from '@/http/models/login.model'
import { LoadingService } from '@/http/extends/loading.service'

const showSettingFrom = ref(false)

const repairData: RepairPasswordInput = {
  password: '',
  smsCode: '',
  account: '',
}

const router = useRouter()
const service = new LoginService()
const loadingStatus = ref(false)
const loadingService = new LoadingService(loadingStatus)

// 验证用户注册输入的验证码是否正确
function onVerifySubmit(data: RegisterFormData) {
  service.smsCodeCheck({ smsCode: data.code, phone: data.phone }, [loadingService])
    .then(({ successful }) => {
      if (!successful)
        throw new Error('短信验证码错误')

      repairData.smsCode = data.code
      repairData.account = data.phone
      // 进入设置页面
      showSettingFrom.value = true
    })
    .catch(({ msg, message }) => {
      ElMessage.error(msg ?? message ?? '短信验证码校验失败')
    })
}

// 获取验证码
const getCode = (phone: string) => service.getSmsCode(phone, [loadingService])
  .then(() => { ElMessage.success('验证码已发送，请注意查收短信') })
  .catch(({ msg }) => { ElMessage.error(msg ?? '获取验证码失败，请稍后重试') })

// 获取登录手机号
const checkAccount = (account: string) => service.checkAccountExist(account, [loadingService])
  .then(({ regphone }) => {
    if (!regphone)
      throw new Error('账号不存在，请检查后重试')
    return regphone
  })
  .catch(({ msg, message }) => {
    ElMessage.error(msg ?? message ?? '验证账号失败')
    return null
  })

async function onSettingSubmit(password: string) {
  repairData.password = password
  const res = await service.repairPassword(repairData, [loadingService]).catch(({ msg }) => {
    ElMessage.error(msg ?? '新密码设置失败，请重试')
    return false
  })
  if (!res)
    return
  router.replace({ name: 'login' })
}

const formSubTitle = computed(() => showSettingFrom.value ? '验证成功，设置新密码' : '请在下面录入账号验证')
</script>

<template>
  <div class="account-repair">
    <div class="account-repair-title">
      重置密码
    </div>
    <div class="account-repair-tips">
      {{ formSubTitle }}
    </div>
    <RepairVerifyForm
      v-if="!showSettingFrom" :form-loading="loadingStatus" :get-code="getCode" :check-account="checkAccount"
      @previous="showSettingFrom = false" @submit="onVerifySubmit"
    />
    <RepairPasswordForm v-else :form-loading="loadingStatus" @submit="onSettingSubmit" />
    <div class="account-repair-other">
      <icon-park-outline-arrow-left />
      <RouterLink class="account-repair-router-link" to="/login">
        直接登录
      </RouterLink>
    </div>
  </div>
</template>

<style lang="less" scoped>
.account-repair {
  width: 450px;
  @apply pl-16 flex flex-col justify-center;

  .account-repair-title {
    @apply text-3xl font-semibold tracking-widest;
  }

  .account-repair-tips {
    @apply h-20 pt-3;
  }

  .account-repair-other {
    @apply flex items-center h-20 border-t border-gray-100;

    .account-repair-router-link {
      color: @color-primary;
      @apply ml-1 font-semibold tracking-wider;
    }
  }

}
</style>
