<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import type { CodeFormData } from '@/types/login.type'
import { EXP_Phone } from '@/utils/regexp.util'

const loginModel = reactive<CodeFormData>({
  phone: '',
  code: '',
})
const formRef = ref<FormInstance>()
const formRules: FormRules = {
  phone: [
    { required: true, trigger: 'blur', message: '请输入手机号码' },
    { pattern: EXP_Phone, message: '请输入正确的手机号码' },
  ],
  code: [
    { required: true, message: '请输入验证码登录', trigger: 'blur' },
    { len: 6, message: '请输入6位验证码' },
  ],
}

async function getPhoneNumber() {
  formRef.value?.resetFields('code')
  const result = await formRef.value?.validateField('phone').then(() => true).catch(() => false)
  return result ? loginModel.phone : null
}

const itemsValid = reactive({
  phone: false,
  code: false,
})

function onFormItemValidate(prop: any, isValid: boolean) {
  if (prop === 'phone')
    itemsValid.phone = isValid
  else
    itemsValid.code = isValid
}
</script>

<template>
  <div class="component sms-code-login-form">
    <el-form
      ref="formRef" :model="loginModel" :rules="formRules" label-position="top" size="large"
      @validate="onFormItemValidate"
    >
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
    </el-form>
  </div>
</template>
