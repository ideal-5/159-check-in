<script setup lang="ts">
/**
 *
 * 二次封装图片组件
 * 如果发现图片下面有个间隙去不掉 可以用  customImage="inline-block!"
 * 但是使用了customImage="inline-block!" 图片加载中的加载图标就没法居中
 * 所以把使权力给外面
 * 还不知道什么原因 后面有时间再改把
 *
 */

import type { ImageMode } from 'wot-design-uni/components/wd-img/types'
import { useAttrs, useSlots } from 'vue'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 定义 props
const props = withDefaults(defineProps<{
  mode?: ImageMode
  src?: string
  customImage?: string
  loadingClass?: string
}>(), {
  mode: 'aspectFill',
  src: '',
  customImage: '',
  loadingClass: '',
})

const myCustomImage = computed(() => `${props.customImage}`)

// 获取其他透传的属性
const attrs = useAttrs()

// 动态绑定事件<获取外面绑定了什么事件>
const bindEvents = Object.keys(attrs)
  .filter(key => key.startsWith('on'))
  .reduce<Record<string, unknown>>((events, key) => {
    events[key] = attrs[key]
    return events
  }, {})

// 合并 attrs 和 bindEvents
const mergedAttrs = {
  ...attrs,
  ...bindEvents,
}

// 获取外部插槽
const slots = useSlots()
</script>

<template>
  <wd-img
    :mode="(attrs.mode as ImageMode) || props.mode"
    :src="props.src"
    :custom-image="myCustomImage"
    v-bind="mergedAttrs"
  >
    <template #loading>
      <div class="size-full">
        <!-- 默认内容 -->
        <div v-if="!slots.loading" class="size-full h20 f-c-c" :class="loadingClass">
          <i class="i-svg-spinners:clock" />
        </div>
        <!-- 自定义内容 -->
        <slot name="loading" />
      </div>
    </template>

    <template #error>
      <div class="size-full">
        <!-- 默认内容 -->
        <div v-if="!slots.error" class="size-full f-c-c text-4 text-#fff">
          加载失败
        </div>
        <!-- 自定义内容 -->
        <slot name="error" />
      </div>
    </template>

    <!-- #ifndef MP-WEIXIN -->
    <!-- 小程序环境报错 slotName is not defined -->
    <template v-for="(_slotContent, slotName) in slots" #[slotName] :key="slotName">
      <slot :name="slotName" />
    </template>
    <!-- #endif -->
  </wd-img>
</template>
