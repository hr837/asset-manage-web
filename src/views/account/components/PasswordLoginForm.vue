<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import type { PasswordFormData } from '@/types/login.type'

const loginModel = reactive<PasswordFormData>({
  account: '',
  password: '',
})
const formRef = ref<FormInstance>()
const loginRules = {
  account: [
    { required: true, trigger: 'blur', message: '请输入邮箱/手机号登录' },
  ],
  code: [
    { required: true, message: '请输入验证码登录', trigger: 'blur' },
    { len: 6, message: '请输入6位验证码' },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入密码登录',
    },
  ],
}
</script>

<template>
  <div class="component password-login-form">
    <el-form ref="formRef" :model="loginModel" :rules="loginRules" label-position="top" size="large">
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
            <el-button type="primary" text>
              忘记密码
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
