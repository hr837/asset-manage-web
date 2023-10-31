<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { FormRules } from '../composables/form-help'
import type { SettingFormData } from '@/types/account.type'

const props = defineProps<{
  formLoading: boolean
}>()
const emit = defineEmits<{
  submit: [data: SettingFormData]
}>()
const settingModel = reactive<SettingFormData>({
  email: '',
  password: '',
})
const formRef = ref<FormInstance>()

async function onSubmitClick() {
  const result = await formRef.value!.validate().then(() => true).catch(() => false)
  if (result)
    emit('submit', { ...settingModel })
}

const itemsValid = reactive({
  email: false,
  password: false,
})

function onFormItemValidate(prop: unknown, isValid: boolean) {
  if (prop === 'email')
    itemsValid.email = isValid
  else
    itemsValid.password = isValid
}

const submitDisabled = computed(() => !itemsValid.email || !itemsValid.password)
</script>

<template>
  <div class="component setting-form">
    <el-form ref="formRef" :model="settingModel" label-position="top" size="large" @validate="onFormItemValidate">
      <el-form-item prop="email" label="邮箱" :rules="FormRules.email as any">
        <el-input v-model="settingModel.email" type="email" placeholder="请输入邮箱账号" maxlength="50">
          <template #prefix>
            <icon-park-solid-mail />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="setting-form-item--code" label="密码" :rules="FormRules.settingPassword">
        <el-input v-model="settingModel.password" placeholder="请输入登录密码" maxlength="20">
          <template #prefix>
            <icon-park-solid-lock />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="form-item--submit">
        <el-button type="primary" size="large" :disabled="submitDisabled" :loading="formLoading" @click="onSubmitClick">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
