<script lang="ts" setup>
import { computed, defineProps, getCurrentInstance, withDefaults } from 'vue'
type alignType = 'left' | 'center' | 'right'

interface PropType {
  colSpan: number
  required?: boolean
  label: string
  /** lable的宽度 */
  labelWidth?: string
  /** label 样式布局 */
  labelAlign?: alignType
  /** label背景颜色 */
  labelBackground?: string
  /** 内容的样式布局 */
  contentAlign?: alignType
  /** 边框的宽度 */
  borderWidth?: string
  /** label字体颜色 */
  labelColor?: string
}

const props = withDefaults(defineProps<PropType>(), {
  borderWidth: '1px',
})

/** 当前组件的实例 */
const current = getCurrentInstance()

/** 父组件 */
const grid = computed(() => {
  if (!current)
    return null
  let parent = current.parent
  while (
    parent
    && parent.exposed
    && parent.exposed.componentName !== 'data-grid'
  )
    parent = parent.parent

  return parent
})

const itemClass = computed(() => {
  return {
    [`col-span-${props.colSpan}`]: true,
  }
})

const borderColor = computed(() => grid.value?.props.borderColor as string)
// eslint-disable-next-line vue/no-dupe-keys
const borderWidth = computed(() => grid.value?.props.borderWidth as string)
const labelBackground = computed(
  () => props.labelBackground || borderWidth.value,
)

const itemStyle = computed(() => {
  if (!grid.value)
    return {}
  const g = grid.value
  const totalSpan = g.props.rowSpan as number

  if (totalSpan && totalSpan > 0) {
    const spanValue
      = `${(Math.floor((props.colSpan / totalSpan) * 10000) / 100).toFixed(2)}%`
    return {
      flexBasis: spanValue,
      maxWidth: spanValue,
      minWidth: spanValue,
      borderRight: `solid ${borderColor.value} ${borderWidth.value}`,
      borderBottom: `solid ${borderColor.value} ${borderWidth.value}`,
    }
  }
  else {
    return {
      borderRight: `solid ${borderColor.value} ${borderWidth.value}`,
      borderBottom: `solid ${borderColor.value} ${borderWidth.value}`,
    }
  }
})

const separateStyle = computed(() => {
  return {
    background: borderColor.value,
    width: borderWidth.value,
  }
})

const itemLabelAlign = computed(() => {
  return props.labelAlign || (grid.value?.props.labelAlign as alignType)
})

const itemContentAlign = computed(() => {
  return props.contentAlign || (grid.value?.props.contentAlign as alignType)
})

const labelColor = computed(() => {
  return props.labelColor || (grid.value?.props.labelColor as string)
})

const contentStyle = computed(() => {
  return {
    textAlign: itemContentAlign.value,
  }
})

/**
 * 获取label样式
 */
const labelStyle = computed(() => {
  const width = (props.labelWidth || grid.value?.props.labelWidth) as string
  return {
    flexBasis: width,
    width,
    color: labelColor.value,
    background: labelBackground.value,
    justifyContent: {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    }[itemLabelAlign.value],
  }
})
</script>

<template>
  <div class="component data-grid-item flex-auto" :class="itemClass" :style="itemStyle">
    <div class="data-grid-item-container flex">
      <label class="data-grid-item__label flex" :class="{ required }" :style="labelStyle">
        {{ label }}
      </label>
      <div class="data-grid-item__separate" :style="separateStyle" />
      <div class="data-grid-item__content flex-auto" :style="contentStyle">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.data-grid-item {
  display: table-cell;
  padding: 0;
  box-sizing: border-box;
}

.data-grid-item__label {
  align-items: center;
  padding: 0 5px;
}

.data-grid-item-container {
  .data-grid-item__label {
    height: 100%;
  }

  .data-grid-item__content {
    padding: 5px;
    word-wrap: break-word;
  }

  align-items: center;
  height: 100%;
  width: 100%;
}

.data-grid-item__separate {
  height: 100%;
}

.required:before {
  content: "*";
  display: inline-block;
  padding-right: 5px;
  color: red;
}
</style>
