<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { FormRules } from '../composables/form-help'

const props = defineProps<{
  formLoading: boolean
}>()
const emit = defineEmits<{
  submit: [password: string]
}>()
const formModel = reactive({
  password: '',
  confirmPassword: '',
})
const formRef = ref<FormInstance>()

async function onSubmitClick() {
  const result = await formRef.value!.validate().then(() => true).catch(() => false)
  if (result)
    emit('submit', formModel.password)
}

const itemsValid = reactive({
  password: false,
  confirmPassword: false,
})

function onFormItemValidate(prop: unknown, isValid: boolean) {
  if (prop === 'password')
    itemsValid.password = isValid
  else
    itemsValid.confirmPassword = isValid
}

const confirmValidator = (_: unknown, value: string, callback: Function) => {
  if (!formModel.password)
    callback()
  else if (!value)
    callback(new Error('请输入确认密码'))
  else if (value !== formModel.password)
    callback(new Error('确认密码和新密码不一致'))
  else
    callback()
}

const submitDisabled = computed(() => !itemsValid.password || !itemsValid.confirmPassword)
</script>

<template>
  <div class="component setting-form">
    <el-form ref="formRef" :model="formModel" label-position="top" size="large" @validate="onFormItemValidate">
      <el-form-item prop="password" label="新密码" :rules="FormRules.settingPassword">
        <el-input
          v-model="formModel.password" type="password" autocomplete="new-password" placeholder="请设置登录密码"
          maxlength="20"
        >
          <template #prefix>
            <icon-park-solid-lock />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="confirmPassword" class="form-item--confirm" label="确认密码"
        :rules="[{ validator: confirmValidator }]"
      >
        <el-input
          v-model="formModel.confirmPassword" type="password" autocomplete="new-password" placeholder="请确认登录密码"
          maxlength="50"
        >
          <template #prefix>
            <icon-park-solid-lock />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="form-item--submit">
        <el-button type="primary" size="large" :disabled="submitDisabled" :loading="formLoading" @click="onSubmitClick">
          完成
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.form-item--confirm {
  :deep(.el-form-item__label) {
    left: 0.3rem !important;
  }
}
</style>
