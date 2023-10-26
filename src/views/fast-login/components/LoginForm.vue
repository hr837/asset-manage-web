<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import type { CodeFormData } from '@/types/login.type'
import { EXP_Phone } from '@/utils/regexp.util'

defineProps<{
  loading: boolean
}>()
const emit = defineEmits<{
  submit: [data: CodeFormData]
}>()
const loginModel = reactive<CodeFormData>({
  phone: '',
  code: '',
})
const formRef = ref<FormInstance>()
const formRules: FormRules = {
  phone: [
    { required: true, trigger: 'blur', message: '请输入手机号码' },
    { pattern: EXP_Phone, trigger: 'blur', message: '请输入正确的手机号码' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '请输入6位验证码', trigger: 'blur' },
  ],
}

function onSubmit() {
  formRef.value?.validate((r) => {
    if (r)
      emit('submit', { ...loginModel })
  }).catch(() => { })
}

async function getPhoneNumber() {
  formRef.value?.resetFields('code')
  const result = await formRef.value?.validateField('phone').then(() => true).catch(() => false)
  return result ? loginModel.phone : null
}

defineExpose({
  getPhoneNumber,
})
</script>

<template>
  <div class="component login-form">
    <el-form ref="formRef" :model="loginModel" :rules="formRules" label-position="top" size="large">
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="loginModel.phone" type="text" placeholder="请输入手机号码" maxlength="11">
          <template #prefix>
            <icon-park-solid-phone />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="login-form-item--code" label="验证码">
        <el-input v-model="loginModel.code" placeholder="请输入验证码" maxlength="6">
          <template #prefix>
            <icon-park-outline-block-six />
          </template>
          <template #suffix>
            <slot name="verify" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="login-form-item--submit">
        <el-button type="primary" size="large" :disabled="loading" :loading="loading" @click="onSubmit">
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
      @apply mt-6 mb-10;

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
