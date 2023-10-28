<script lang="ts" setup>
import { type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { take, timer } from 'rxjs'
import type { CodeFormData } from '@/types/login.type'
import { EXP_Phone } from '@/utils/regexp.util'

const props = defineProps<{
  getCode: (phone: string) => Promise<void>
}>()
const emit = defineEmits<{
  // 表单验证事件
  validate: [isValid: boolean]
}>()

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

const itemsValid = {
  phone: false,
  code: false,
}

function onFormItemValidate(prop: any, isValid: boolean) {
  if (prop === 'phone')
    itemsValid.phone = isValid
  else
    itemsValid.code = isValid
  emit('validate', itemsValid.phone && itemsValid.code)
}

const verified = ref(false)
const showDialog = ref(false)
const showCountDown = ref(false)

// let timerId = -1
const countDownText = ref('')
const COUNT = 60

// 人机验证
function sendMessage() {
  props.getCode(loginModel.phone).then(() => {
    if (showDialog.value)
      showDialog.value = false
    // 设置固定时间后再试
    timer(0, 1000).pipe(take(COUNT)).subscribe({
      next: (count) => {
        showCountDown.value = true
        countDownText.value = `${60 - count}s后再试`
      },
      complete: () => showCountDown.value = false,
    })
  }).catch(() => { })
}

// 人机验证成功
function onDragVerified() {
  verified.value = true
  sendMessage()
}

async function onSendClick() {
  // 手机号是否通过表单验证
  const phoneIsValid = await formRef.value!.validateField('phone').then(() => true).catch(() => false)
  if (!phoneIsValid)
    return
  // 如果没有人机验证过，则显示验证弹窗
  if (!verified.value) {
    showDialog.value = true
    return
  }
  // 发送验证短信
  sendMessage()
}

defineExpose({
  getFormData: () => Object.assign({}, loginModel),
})
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
            <el-button v-if="!showCountDown" type="primary" text @click="onSendClick">
              获取验证码
            </el-button>
            <span v-else class="leading-10">{{ countDownText }}</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-dialog v-model="showDialog" title="请完成安全验证" width="400px" align-center>
      <Transition name="el-zoom-in-top">
        <DragVerify v-if="!verified" @success="onDragVerified" />
        <el-result v-else class="verify-success" title="验证成功" icon="success" />
      </Transition>
    </el-dialog>
  </div>
</template>
