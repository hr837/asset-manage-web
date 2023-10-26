<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { EXP_Email } from '@/utils/regexp.util'

const emit = defineEmits<{
  submit: [data: any]
}>()
const showVerifyInput = ref(false)
const settingModel = reactive({
  email: '',
  password: '',
})
const formRef = ref<FormInstance>()
const formRules = {
  email: [
    {
      required: true, message: '请设置登录邮箱', trigger: 'blur',
    },
    {
      pattern: EXP_Email, message: '请输入正确的邮箱地址', trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请设置登录密码', trigger: 'blur' },
    { min: 6, message: '登录密码长度不能少于6位', trigger: 'blur' },
  ],
}

async function onSubmitClick() {
  const result = await formRef.value!.validate().then(() => true).catch(() => false)
  if (result)
    emit('submit', { ...settingModel })
}
</script>

<template>
  <div class="component setting-form">
    <el-form ref="formRef" :model="settingModel" :rules="formRules" label-position="top" size="large">
      <el-form-item v-if="!showVerifyInput" prop="email" label="邮箱">
        <el-input v-model="settingModel.email" type="email" placeholder="请输入邮箱账号" maxlength="50">
          <template #prefix>
            <icon-park-solid-mail />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="setting-form-item--code" label="密码">
        <el-input v-model="settingModel.password" placeholder="请输入登录密码" maxlength="20">
          <template #prefix>
            <icon-park-solid-lock />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="setting-form-item--submit">
        <el-button type="primary" size="large" @click="onSubmitClick">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.setting-form {
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

    &.setting-form-item--submit {
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
