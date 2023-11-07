<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { nanoid } from 'nanoid'
import { FormRules } from '../composables/form-help'
import type { PasswordLoginInput } from '@/http/models/login.model'

const emit = defineEmits<{
  // 表单验证事件
  validate: [isValid: boolean]
  // 忘记密码
  forgot: []
}>()

const loginModel = reactive<PasswordLoginInput>({
  account: '',
  password: '',
  patchcaKey: nanoid(),
  validateCode: '',
})
const formRef = ref<FormInstance>()

const itemsValid = {
  account: false,
  password: false,
  validateCode: false,
}

function onFormItemValidate(prop: any, isValid: boolean) {
  if (prop === 'account')
    itemsValid.account = isValid
  else if (prop === 'password')
    itemsValid.password = isValid
  else
    itemsValid.validateCode = isValid
  //
  emit('validate', itemsValid.account && itemsValid.password && itemsValid.validateCode)
}

function remakeCode() {
  formRef.value!.resetFields('validateCode')
  loginModel.patchcaKey = nanoid()
}

const codeSrc = computed(() => `/api/patchca/${loginModel.patchcaKey}`)

defineExpose({
  getFormData: () => Object.assign({}, loginModel),
  resetCode: () => {
    formRef.value?.resetFields('validateCode')
    remakeCode()
  },
})
</script>

<template>
  <div class="component login-password-form">
    <el-form ref="formRef" :model="loginModel" label-position="top" size="large" @validate="onFormItemValidate">
      <el-form-item prop="account" label="账号" :rules="FormRules.loginAccount">
        <el-input v-model="loginModel.account" placeholder="请输入账号" maxlength="50">
          <template #prefix>
            <icon-park-solid-user />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码" :rules="FormRules.loginPassword">
        <el-input v-model="loginModel.password" type="password" placeholder="请输入密码" maxlength="20">
          <template #prefix>
            <icon-park-solid-lock />
          </template>
          <template #suffix>
            <el-button type="primary" text tag="div" @click="$emit('forgot')">
              忘记密码
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="validateCode" label="验证码" :rules="FormRules.pictureCode">
        <el-input v-model="loginModel.validateCode" autocomplete="off" placeholder="请输入验证码" maxlength="4">
          <template #prefix>
            <icon-park-outline-block-six />
          </template>
          <template #suffix>
            <img class="cursor-pointer" :src="codeSrc" alt="图形验证码" @click="remakeCode">
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
