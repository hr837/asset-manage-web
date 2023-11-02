<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { take, timer } from 'rxjs'
import { FormRules } from '../composables/form-help'
import type { RepairFormData } from '@/types/account.type'

const props = defineProps<{
  formLoading: boolean
  getCode: (phone: string) => Promise<void>
  checkAccount: (account: string) => Promise<string | null>
}>()
const emit = defineEmits<{
  submit: [data: RepairFormData]
}>()
const showVerifyInput = ref(false)
const formModel = reactive<RepairFormData>({
  account: '',
  phone: '',
  code: '',
})
const formRef = ref<FormInstance>()

async function onSubmitClick() {
  if (!showVerifyInput.value) {
    const result = await formRef.value!.validateField('account').then(() => true).catch(() => false)
    if (!result)
      return
    const phone = await props.checkAccount(formModel.account)
    if (phone) {
      formModel.phone = phone
      showVerifyInput.value = true
    }
  }
  else {
    const result = await formRef.value!.validateField('code').then(() => true).catch(() => false)
    if (result)
      emit('submit', { ...formModel })
  }
}

const verified = ref(false)
const showDialog = ref(false)
const showCountDown = ref(false)

// let timerId = -1
const countDownText = ref('')
const COUNT = 60

// 人机验证
function sendMessage() {
  props.getCode(formModel.phone).then(() => {
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
  // 如果没有人机验证过，则显示验证弹窗
  if (!verified.value) {
    showDialog.value = true
    return
  }
  // 发送验证短信
  sendMessage()
}

const itemsValid = reactive({
  account: false,
  code: false,
})

function onFormItemValidate(prop: any, isValid: boolean) {
  if (prop === 'account')
    itemsValid.account = isValid
  else
    itemsValid.code = isValid
}

const submitDisabled = computed(() => showVerifyInput.value ? !itemsValid.code : !itemsValid.account)
// 不是手机号设置，就掩码显示
const viewPhoneNumber = computed(() => formModel.account === formModel.phone ? formModel.phone : formModel.phone.replace(/\d{7}/, '***'))
</script>

<template>
  <div class="component repair-verify-form">
    <el-form ref="formRef" :model="formModel" label-position="top" size="large" @validate="onFormItemValidate">
      <el-form-item v-if="!showVerifyInput" prop="account" label="账号" :rules="FormRules.loginAccount">
        <el-input v-model="formModel.account" placeholder="请输入邮箱/手机号" maxlength="50">
          <template #prefix>
            <icon-park-solid-user />
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
            验证码将发送至 <span class="step-tip-account">{{ viewPhoneNumber }}</span>
          </div>
        </div>
        <el-form-item prop="code" class="register-form-item--code" label="验证码" :rules="FormRules.smsCode">
          <el-input v-model="formModel.code" placeholder="请输入手机验证码" maxlength="6">
            <template #prefix>
              <icon-park-outline-block-six />
            </template>
            <template #suffix>
              <el-button v-if="!showCountDown" tag="div" type="primary" text @click="onSendClick">
                发送验证码
              </el-button>
              <span v-else class="leading-10">{{ countDownText }}</span>
            </template>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item class="form-item--submit">
        <el-button type="primary" size="large" :disabled="submitDisabled" :loading="formLoading" @click="onSubmitClick">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="showDialog" title="请完成安全验证" width="400px" align-center>
      <DragVerify v-if="!verified" @success="onDragVerified" />
      <el-result v-else class="verify-success" title="验证成功" icon="success" />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.setp-container {
  @apply mb-8;

  .step-back {
    @apply inline-flex items-center cursor-pointer leading-10;
  }

  .step-tip {
    @apply text-sm text-gray-500;

    &-account {
      color: @color-primary;
      @apply font-semibold;
    }
  }
}
</style>
