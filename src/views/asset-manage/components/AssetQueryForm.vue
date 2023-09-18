<script lang="ts" setup>
import { reactive } from 'vue'
import type { QueryForm } from '@/types/asset-info.type'

const emit = defineEmits(['refresh'])

const model = reactive<QueryForm>({
  name: '',
  date: ['', ''],
  state: '',
})

function refreshData() {
  const queryData = {
    name: model.name,
    begin: model.date[0],
    end: model.date[1],
  }
  emit('refresh', queryData)
}
</script>

<template>
  <DataForm :model="model" :label-width="0" @search="refreshData" @reset="refreshData">
    <el-form-item prop="state">
      <el-select v-model="model.state" placeholder="全部状态">
        <el-option label="仅上传" value="仅上传" />
        <el-option label="排队中" value="排队中" />
        <el-option label="转换中" value="转换中" />
        <el-option label="转换失败" value="转换失败" />
        <el-option label="转换完成" value="转换完成" />
      </el-select>
    </el-form-item>
    <el-form-item prop="name">
      <el-input v-model="model.name" placeholder="请输入文件名称" />
    </el-form-item>
    <el-form-item prop="date">
      <DateRange v-model="model.date" />
    </el-form-item>
  </DataForm>
</template>

<style lang="less" scoped></style>
