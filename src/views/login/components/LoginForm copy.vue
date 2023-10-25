<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import type { LoginInput } from '@/http/models/login.model'

const props = defineProps<{
  /** 加载状态，登录的时候可以设置 */
  loading: boolean
  patchcaKey: string
}>()
const emit = defineEmits<{
  /** 登录表单校验成功 */
  validated: [data: LoginInput]
  chageCode: []
}>()
const loginModel = reactive<LoginInput>({
  account: '',
  password: '',
  validateCode: '',
  patchcaKey: '',
})
const loginRef = ref<FormInstance>()
const loginRules = {
  account: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入手机号码/用户名',
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入密码',
    },
  ],
  validateCode: [
    { required: true, message: '请输入验证码' },
    { len: 4, message: '请输入4位验证码' },
  ],
}

watch(() => props.patchcaKey, () => loginModel.validateCode = '')

/**
 * 登陆
 */
function handleLogin() {
  loginRef.value?.validate((valid, _) => {
    if (valid)
      emit('validated', { ...loginModel })
  })
}
</script>

<template>
  <div class="component login-form">
    <el-form ref="loginRef" :model="loginModel" :rules="loginRules" class="login-form" size="large">
      <el-form-item prop="account">
        <el-input v-model="loginModel.account" type="text" placeholder="请输入手机号码/用户名">
          <template #prefix>
            <icon-park-outline-user />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginModel.password" type="password" placeholder="请输入密码"
          maxlength="20"
        >
          <template #prefix>
            <icon-park-outline-lock />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="validateCode" class="login-form-item--code">
        <el-input v-model="loginModel.validateCode" placeholder="请输入验证码" maxlength="4">
          <template #prefix>
            <icon-park-outline-block-six />
          </template>
          <template #suffix>
            <img :src="`/api/patchca/${patchcaKey}`" alt="code" class="login-img-verifycode" @click="$emit('chageCode')">
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="mt-12">
        <el-button class="w-full" :loading="loading" type="primary" @click="handleLogin">
          {{ loading ? '登 录 中...' : '登 录' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.login-form{
  --el-component-size-large: 60px;
  --el-font-size-base:18px;
  .el-input--large{
    font-size:var(--el-font-size-base);
  }
  .el-button--large{
    --el-button-size:var(--el-component-size-large);
  }
  .iconify{
    color:@color-primary;
  }
}
.login-form-item--code {
  :deep(.el-input) {
    .el-input__wrapper {
      padding-right: 2px;

      .el-input__suffix {
        @apply w-1/3 cursor-pointer bg-white;
      }
    }
  }
}
</style>
