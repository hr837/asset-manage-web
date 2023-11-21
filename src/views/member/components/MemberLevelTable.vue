<script lang="ts" setup>
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

const tableData = [
  {
    ability: '钻石数量',
    tip: '使用钻石进行视频创作，每月赠送，不可转下个月（1💎=1秒钟视频转换）',
    vip0: '35💎/月',
    vip1: '180💎/月',
    vip2: '480💎/月',
    vip3: '1500💎/月',
    vip4: '6000💎/月',
  },
  {
    ability: '视频最长时间',
    tip: '每个上传视频剪辑允许的最大视频长度（即持续时间）',
    vip0: '35s',
    vip1: '1min',
    vip2: '3min',
    vip3: '25min',
    vip4: '100min',
  },
  {
    ability: '工作优先级',
    tip: '优先级较高的用户将首先处理其动画作业',
    vip0: '低',
    vip1: '中',
    vip2: '高',
    vip3: '高',
    vip4: '最高',
  },
  {
    ability: '每秒最大帧数',
    tip: '输入视频允许的最大每秒帧数(FPS)',
    vip0: '30帧/秒',
    vip1: '30帧/秒',
    vip2: '60帧/秒',
    vip3: '120帧/秒',
    vip4: '240帧/秒',
  },
  {
    ability: '批量上传',
    tip: '同时上传多个视频',
    flag: true,
    vip0: 0,
    vip1: 0,
    vip2: 1,
    vip3: 1,
    vip4: 1,
  },
  {
    ability: '商业许可',
    tip: '',
    flag: true,
    vip0: 0,
    vip1: 1,
    vip2: 1,
    vip3: 1,
    vip4: 1,
  },
]
</script>

<template>
  <el-table class="member-level-table" :data="tableData" border>
    <el-table-column v-for="item of tableColumns" :key="item.key" :label="item.title">
      <template #default="{ row }">
        <!-- 功能列 -->
        <template v-if="item.key === 'ability'">
          <span>{{ row.ability }}</span>
          <el-tooltip v-if="row.tip" :content="row.tip" placement="right">
            <icon-park-solid-info class="inline-block ml-1 text-violet-500 text-xs" />
          </el-tooltip>
        </template>
        <template v-else-if="row.flag">
          <icon-park-solid-correct v-if="row[item.key] === 1" class="text-green-500" />
          <icon-park-solid-error v-else class="text-red-500" />
        </template>
        <template v-else>
          {{ row[item.key] }}
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="less" scoped>
.member-level-table {
  --el-table-header-bg-color: #E8F3FF;

  :deep(.el-table__cell) {
    padding: 12px 0;
  }
}
</style>
