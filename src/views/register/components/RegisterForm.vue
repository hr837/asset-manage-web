<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { EXP_Phone } from '@/utils/regexp.util'
import type { RegistInputData } from '@/types/register.type'

const emit = defineEmits<{
  submit: [data: RegistInputData]
}>()
const showVerifyInput = ref(false)
const registerModel = reactive<RegistInputData>({
  account: '',
  validateCode: '',
})
const formRef = ref<FormInstance>()
const formRules = {
  account: [
    {
      required: true, message: '请输入手机号码', trigger: 'blur',
    },
    {
      pattern: EXP_Phone, message: '请输入正确的手机号码', trigger: 'blur',
    },
  ],
  validateCode: [
    { required: true, message: '请输入手机验证码', trigger: 'blur' },
    { len: 6, message: '请输入6位验证码', trigger: 'blur' },
  ],
}

async function onSubmitClick() {
  if (!showVerifyInput.value) {
    const result = await formRef.value!.validateField('account').then(() => true).catch(() => false)
    if (result)
      showVerifyInput.value = true
  }
  else {
    const result = await formRef.value!.validateField('validateCode').then(() => true).catch(() => false)
    if (result)
      emit('submit', { ...registerModel } as RegistInputData)
  }
}
</script>

<template>
  <div class="component register-form">
    <el-form ref="formRef" :model="registerModel" :rules="formRules" label-position="top" size="large">
      <el-form-item v-if="!showVerifyInput" prop="account" label="手机号">
        <el-input v-model="registerModel.account" type="phone" placeholder="请输入手机号码" maxlength="11">
          <template #prefix>
            <icon-park-solid-phone />
          </template>
        </el-input>
      </el-form-item>
      <template v-else>
        <div class="setp-container">
          <div class="step-back" @click="showVerifyInput = false">
            <icon-park-outline-arrow-left />
            <span class="pl-1">返回上一步</span>
          </div>
          <div class="step-tip">
            验证码将发送至 <span class="step-tip-account">{{ registerModel.account }}</span>
          </div>
        </div>
        <el-form-item prop="validateCode" class="register-form-item--code" label="验证码">
          <el-input v-model="registerModel.validateCode" placeholder="请输入手机验证码" maxlength="6">
            <template #prefix>
              <icon-park-outline-block-six />
            </template>
            <template #suffix>
              <slot name="verify" />
            </template>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item class="register-form-item--submit">
        <el-button type="primary" size="large" @click="onSubmitClick">
          {{ showVerifyInput ? '注册' : '下一步' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.register-form {
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

    &.register-form-item--submit {
      @apply mb-8;

      .el-button {
        @apply w-full rounded-lg text-2xl font-semibold tracking-widest;
      }
    }
  }

  .setp-container {
    @apply mb-8;

    .step-back {
      @apply inline-flex items-center cursor-pointer leading-10;
    }

    .step-tip {
      @apply text-sm;

      &-account {
        color: @color-primary;
        @apply font-semibold;
      }
    }
  }

}
</style>
