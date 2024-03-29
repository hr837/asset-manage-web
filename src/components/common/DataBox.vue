<script lang="ts" setup>
import { computed, withDefaults } from 'vue'
import type { OrderType, SortService } from '@/http/extends/sort.service'
interface PropType {
  /** 表格数据 */
  data: Array<any>
  /** 多选数据 */
  selectionData?: Array<any>
  /** 点击当前行数据 */
  currentRow?: object
  /** 点击当前行是否高亮 */
  highlightRowShow?: boolean
  /** sort */
  sort?: SortService
  /** 表格尺寸 */
  tableSize?: 'large' | 'default' | 'small'
  /** 表格边框 */
  tableBorder?: boolean
  /** 表格row-key */
  rowKey?: string
  /** 保存选中列数据状态 需指定row-key */
  reserveSelection?: boolean
}
const props = withDefaults(defineProps<PropType>(), {
  tableSize: 'default',
  tableBorder: false,
  rowKey: 'id',
  reserveSelection: true,
})

const emits = defineEmits([
  'update:selectionData',
  'update:currentRow',
  'refreshData',
])

const highlightCurrentRow = computed(
  () => props.highlightRowShow === true && props.currentRow !== undefined,
)

const selection = computed(() => props.selectionData !== undefined)

function emitSelectionChange(val: any) {
  emits('update:selectionData', val)
}

function sortChange(args: { prop: string; order: OrderType }) {
  props.sort?.update(args.prop, args.order)
  emits('refreshData')
}

function onCurrentRowChange<T = any>(currentRow: T) {
  emits('update:currentRow', currentRow)
}
</script>

<template>
  <div class="component data-box">
    <el-table
      :data="data" :highlight-current-row="highlightCurrentRow" :border="tableBorder" :size="tableSize"
      :row-key="rowKey" @selection-change="emitSelectionChange" @sort-change="sortChange"
      @current-change="onCurrentRowChange"
    >
      <el-table-column v-if="selection" type="selection" width="45" :reserve-selection="reserveSelection" />
      <slot />
    </el-table>
  </div>
</template>

<style lang="less" scoped>
.data-box {
  margin-top: 15px;
}
</style>
