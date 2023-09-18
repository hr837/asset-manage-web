<script lang="ts" setup>
import { reactive } from 'vue'
import type { QueryForm } from '@/types/asset-info.type'

const emit = defineEmits(['refresh'])

const model = reactive<QueryForm>({
  name: '',
  date: ['', ''],
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
    <el-form-item>
      <el-input v-model="model.name" placeholder="请输入文件名称" />
    </el-form-item>
    <el-form-item>
      <DateRange v-model="model.date" />
    </el-form-item>
  </DataForm>
</template>

<style lang="less" scoped></style>
