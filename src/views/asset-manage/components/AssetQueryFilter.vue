<script lang="ts" setup>
import { computed, ref } from 'vue'
import { AssetStatusDict } from '../composable/constant'

const props = defineProps<{ modelValue?: number }>()

const emit = defineEmits<{ 'update:modelValue': [cmd?: number] }>()

const state = ref<number | undefined>(undefined)

function onCommand(cmd: number) {
  state.value = cmd
  emit('update:modelValue', cmd || undefined)
}

const stateLabel = computed(() => {
  const item = AssetStatusDict.find(x => x.key === props.modelValue)
  return item?.label ?? '全部'
})
</script>

<template>
  <el-dropdown class="component asset-query-filter" trigger="click" @command="onCommand">
    <div class="dropdown-controller">
      <span class="pr-1">{{ stateLabel }}</span>
      <icon-park-outline-down />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="0">
          全部
        </el-dropdown-item>
        <el-dropdown-item v-for="{ key, label } of AssetStatusDict" :key="key" :command="key">
          {{ label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="less" scoped>
.dropdown-controller {
  @apply flex items-center;
  color: @color-primary;
}
</style>
