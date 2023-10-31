<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { FormRules } from '../composables/form-help'
import type { PasswordFormData } from '@/types/login.type'

const emit = defineEmits<{
  // 表单验证事件
  validate: [isValid: boolean]
  // 忘记密码
  forgot: []
}>()

const loginModel = reactive<PasswordFormData>({
  account: '',
  password: '',
})
const formRef = ref<FormInstance>()

const loginRules = {
  account: FormRules.loginAccount,
  password: FormRules.loginPassword,
}

const itemsValid = {
  account: false,
  password: false,
}

function onFormItemValidate(prop: any, isValid: boolean) {
  if (prop === 'account')
    itemsValid.account = isValid
  else
    itemsValid.password = isValid
  emit('validate', itemsValid.account && itemsValid.password)
}

defineExpose({
  getFormData: () => Object.assign({}, loginModel),
})
</script>

<template>
  <div class="component password-login-form">
    <el-form
      ref="formRef" :model="loginModel" :rules="loginRules" label-position="top" size="large"
      @validate="onFormItemValidate"
    >
      <el-form-item prop="account" label="账号">
        <el-input v-model="loginModel.account" type="text" placeholder="请输入邮箱/手机号">
          <template #prefix>
            <icon-park-solid-user />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="loginModel.password" type="password" placeholder="请输入密码" maxlength="20">
          <template #prefix>
            <icon-park-solid-lock />
          </template>
          <template #suffix>
            <el-button type="primary" text @click="$emit('forgot')">
              忘记密码
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
