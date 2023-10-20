<script lang="ts" setup>
import { computed } from 'vue'
import type { AssetInfo } from '@/types/asset-info.type'
import { getDuration } from '@/utils/date.util'

const props = defineProps<AssetInfo>()

const currentStep = computed(() => {
  if (props.status > 2)
    return props.status
  return props.status - 1
})

const convertElapsedTime = computed(() => getDuration(props.convertAlreadyWaitTime))
const queueInfo = computed(() => {
  if (!props.lineIndex || !props.lineTotal)
    return ''
  return `第${props.lineIndex}位 / 共${props.lineTotal}位`
})
</script>

<template>
  <div class="component asset-progress">
    <el-steps direction="vertical" :active="currentStep" process-status="success">
      <el-step title="上传完成" class="icon-large">
        <template #icon>
          <div v-if="status === 1">
            1
          </div>
          <icon-park-outline-check v-else />
        </template>
        <template #description>
          <div>{{ uploadTime }}</div>
        </template>
      </el-step>
      <el-step title="排队中" class="icon-small">
        <template #icon>
          <icon-park-outline-check />
        </template>
        <template #description>
          <template v-if="status === 2">
            <div>{{ queueInfo }}</div>
            <div>预计等待时长：{{ predictLineTime }}</div>
          </template>
          <div v-if="status > 2">
            实际耗时：{{ getDuration(lineAlreadyWaitTime) }}
          </div>
        </template>
      </el-step>
      <el-step title="排队完成" class="icon-large">
        <template #icon>
          <div v-if="status < 3">
            2
          </div>
          <icon-park-outline-check v-else />
        </template>
        <template #description>
          <div>{{ convertStartTime }}</div>
        </template>
      </el-step>
      <el-step title="转换中" class="icon-small">
        <template #icon>
          <icon-park-outline-check />
        </template>
        <template #description>
          <div v-if="status === 3">
            转换进度：{{ processStage ?? 0 }}%
          </div>
          <div v-if="status > 3">
            实际耗时：{{ convertElapsedTime }}
          </div>
        </template>
      </el-step>
      <el-step v-if="props.status === 4" title="转换失败" status="error" class="icon-large">
        <template #icon>
          <icon-park-outline-close />
        </template>
        <template #description>
          <div>{{ convertEndTime }}</div>
          <div>
            {{ message }}
          </div>
        </template>
      </el-step>
      <el-step v-else title="转换完成" class="icon-large">
        <template #icon>
          <div>3</div>
        </template>
        <template #description>
          <div>{{ convertEndTime }}</div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<style lang="less" scoped>
.asset-progress {
  width: 277px;
  @apply p-6;
}

.el-steps {
  @gary-text: #909399;
  @gay-head: #C0C4CC;
  --el-color-success: @color-primary;
  --el-text-color-placeholder: @gary-text;
  display: block;

  :deep(.el-step) {
    min-height: 66px;

    &__head {
      --el-text-color-placeholder: @gay-head;
      @apply w-8 flex flex-col-reverse items-center;

      &.is-success {
        .el-step__icon {
          border-color: var(--el-color-success);
          background-color: var(--el-color-success);
          color: #fff;
        }
      }

      &.is-error {
        .el-step__icon {
          border-color: var(--el-color-danger);
          background-color: var(--el-color-danger);
          color: #fff;
        }
      }

      &.is-finish {
        .el-step__icon {
          border-color: var(--el-color-success);
        }

        .el-step__line {
          background-color: var(--el-color-success);
        }
      }

      &.is-wait {
        .iconify {
          display: none;
        }
      }
    }

    &__line {
      margin: 6px 0;
      --el-text-color-placeholder: @gay-head;
      @apply static flex-1;
    }

    &__icon {
      border-color: @gay-head;
      @apply static border rounded-full text-base flex justify-center items-center;
    }

    &.icon-large {
      .el-step__icon {
        @apply w-8 h-8;
      }
    }

    &.icon-small {
      .el-step__icon {
        height: 14px;
        width: 14px;
        margin: 9px 0;
      }

      .el-step__title {
        @apply text-sm leading-8;
      }

      .el-step__description {
        @apply text-xs leading-6;
      }

      .el-step__head.is-success .iconify {
        display: none;
      }
    }

    &__main {
      @apply pl-4 overflow-hidden;
    }

    &__title {
      @apply h-8 leading-8 pb-0;

      &.is-success,
      &.is-error {
        @apply font-semibold;
      }
    }

    &__description {
      @apply py-1 text-gray-400 text-sm;

      &.is-success {
        @apply text-gray-700;
      }

      &.is-error {
        color: var(--el-color-danger);
      }
    }

    &:last-of-type {
      .el-step__head {
        @apply flex-col;
      }
    }
  }

}

// .el-step__description {
//   @apply pt-1 pb-4;
// }

// .el-step.icon-large {
//   .el-step__icon {
//     @apply w-8 h-8 border rounded-full;
//   }
// }
</style>
