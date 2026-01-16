<script lang="ts" setup>
const router = useRouter()

const route = useRoute()

const { activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList } = useTabbar()

function handleTabbarChange({ value }: { value: string }) {
  setTabbarItemActive(value)
  router.pushTab({ name: value })
}

onMounted(() => {
  // #ifdef APP
  uni.hideTabBar()
  // #endif
  nextTick(() => {
    if (route.name && route.name !== activeTabbar.value.name) {
      setTabbarItemActive(route.name)
    }
  })
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <slot />
  <wd-gap safe-area-bottom height="var(--wot-tabbar-height, 50px)" />
  <wd-tabbar
    :model-value="activeTabbar.name"
    bordered
    safe-area-inset-bottom
    fixed
    active-color="#010101"
    inactive-color="#CED3DB"
    @change="handleTabbarChange"
  >
    <wd-tabbar-item
      v-for="(item, index) in tabbarList"
      :key="index"
      :name="item.name"
      :value="getTabbarItemValue(item.name)"
      :title="item.title"
    >
      <template #icon="{ active }">
        <image
          :src="active ? item.activeIcon : item.inactiveIcon"
          class="size-20px"
        />
      </template>
    </wd-tabbar-item>
  </wd-tabbar>
</template>
