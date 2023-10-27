<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import type { FormType } from '@/types/login.type'
import type { LoginInput } from '@/http/models/login.model'

const props = defineProps<{
  type: FormType
}>()
const loginModel = reactive<LoginInput>({
  account: '',
  password: '',
  validateCode: '',
  patchcaKey: '',
})
const formRef = ref<FormInstance>()
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
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '请输入4位验证码', trigger: 'blur' },
  ],
}

const showPwd = computed(() => props.type === 'pwd')

/** 表单验证 */
async function validateForm() {
  const val = await formRef.value!.validate().then(() => true).catch(() => false)
  return val ? { ...loginModel } as LoginInput : null
}

defineExpose({
  validate: validateForm,
})

const showLabelAccount = computed(() => loginModel.account.trim() !== '')
const showLabelPwd = computed(() => loginModel.password.trim() !== '')
const showLabelCode = computed(() => loginModel.validateCode.trim() !== '')
</script>

<template>
  <div class="component login-form">
    <el-form ref="formRef" :model="loginModel" :rules="loginRules" label-position="top" size="large">
      <el-form-item prop="account" label="手机号">
        <el-input v-model="loginModel.account" type="text" placeholder="请输入手机号码">
          <template #prefix>
            <icon-park-solid-phone />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="showPwd" prop="password" label="密码">
        <el-input v-model="loginModel.password" type="password" placeholder="请输入密码" maxlength="20">
          <template #prefix>
            <icon-park-solid-lock />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-else prop="validateCode" class="login-form-item--code" label="验证码">
        <el-input v-model="loginModel.validateCode" placeholder="请输入验证码" maxlength="4">
          <template #prefix>
            <icon-park-outline-block-six />
          </template>
          <template #suffix>
            <slot name="verify" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="login-form-item--pass">
        <el-checkbox>七天免登录</el-checkbox>
      </el-form-item>
      <el-form-item class="login-form-item--submit">
        <el-button type="primary" size="large">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.login-form {
  --el-component-size-large: 64px;
  --el-font-size-base: 16px;
  @apply relative z-0;

  .el-input--large {
    font-size: var(--el-font-size-base);
  }

  .el-button--large {
    --el-button-size: var(--el-component-size-large);
  }

  .iconify {
    color: @color-primary;
  }

  :deep(.el-form-item) {
    position: relative;
    --el-border-radius-base: 10px;

    &.el-form-item--large {
      @apply mt-6;

      &.is-error {
        @apply mb-10;
      }

      .el-form-item__label {
        color: #3C4071;
        @apply text-xs h-auto absolute bg-white px-2 z-10 -top-2 left-2 transition-all;

        &::before {
          display: none;
        }
      }

      .el-input__prefix {
        @apply px-3;
      }
    }

    &.login-form-item--pass {
      @apply mb-0;
    }

    &.login-form-item--submit {
      @apply mb-8;

      .el-button {
        @apply w-full rounded-lg text-2xl font-semibold tracking-widest;
      }
    }

  }
}
</style>
