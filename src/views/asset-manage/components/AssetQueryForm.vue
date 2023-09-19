<script lang="ts" setup>
import { reactive } from 'vue'
import type { AssetQueryFormData } from '@/types/asset-info.type'

const emit = defineEmits<{ refresh: [data: AssetQueryFormData] }>()

const model = reactive({
  name: '',
  date: ['', ''],
})

function refreshData() {
  const queryData: AssetQueryFormData = {
    name: model.name,
    startDate: model.date[0],
    endDate: model.date[1],
  }
  emit('refresh', queryData)
}
</script>

<template>
  <DataForm :model="model" :label-width="0" @search="refreshData" @reset="refreshData">
    <el-form-item prop="name">
      <el-input v-model="model.name" placeholder="请输入文件名称" />
    </el-form-item>
    <el-form-item prop="date">
      <DateRange v-model="model.date" />
    </el-form-item>
  </DataForm>
</template>

<style lang="less" scoped></style>
