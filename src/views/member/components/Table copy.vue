<script lang="ts" setup>
defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
})
const tableColumns = [
  {
    title: '产品功能',
    key: 'ability',
  },
  {
    title: '免费版',
    key: 'vip0',
  },
  {
    title: '普通会员',
    key: 'vip1',
  },
  {
    title: '高级会员',
    key: 'vip2',
  },
  {
    title: '进阶会员',
    key: 'vip3',
  },
  {
    title: '黑钻会员',
    key: 'vip4',
  },
]
</script>

<template>
  <el-table class="table" :data="tableData" border>
    <el-table-column
      v-for="(column, columnIndex) of tableColumns"
      :key="columnIndex"
      :prop="column.key"
      :label="column.title"
    >
      <template v-if="column.key === 'ability'" #default="{ row }">
        <div class="row">
          {{ row.ability }}
          <el-popover
            v-if="row.tip"
            placement="top-start"
            :width="200"
            trigger="hover"
            :content="row.tip"
          >
            <template #reference>
              <icon-park-solid-info class="tip" />
            </template>
          </el-popover>
        </div>
      </template>
      <template v-else #default="{ row }">
        <div v-if="row.ability === '钻石数量'" class="count">
          {{ row[column.key] }}<img src="@/assets/images/diamond.png" alt=""> /月
        </div>
        <div v-else-if="row.ability === '批量上传' || row.ability === '商业许可'">
          <icon-park-solid-correct v-if="row[column.key]" color="#51AA32" />
          <icon-park-solid-error v-else color="#FF4D4F" />
        </div>
        <div v-else>
          {{ row[column.key] }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="less" scoped>
:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}
.table {
  .row {
    display: flex;
    align-items: center;
    .tip {
      color: @color-primary;
      margin-left: 5px;
    }
  }
  .count {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin: 0 5px;
    }
  }
}
</style>
