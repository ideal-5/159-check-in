export interface TabbarItem {
  name: string
  value: number | null
  active: boolean
  title: string
  icon: string
}

const tabbarItems = ref<TabbarItem[]>([
  { name: 'check-in', value: null, active: true, title: '打卡', icon: 'home' },
  { name: 'statistics', value: null, active: false, title: '统计', icon: 'statistics' },
  { name: 'mine', value: null, active: false, title: '我的', icon: 'mine' },
])

export function useTabbar() {
  const tabbarList = computed(() => tabbarItems.value)

  const activeTabbar = computed(() => {
    const item = tabbarItems.value.find(item => item.active)
    return item || tabbarItems.value[0]
  })

  const getTabbarItemValue = (name: string) => {
    const item = tabbarItems.value.find(item => item.name === name)
    return item && item.value ? item.value : null
  }

  const setTabbarItem = (name: string, value: number) => {
    const tabbarItem = tabbarItems.value.find(item => item.name === name)
    if (tabbarItem) {
      tabbarItem.value = value
    }
  }

  const setTabbarItemActive = (name: string) => {
    tabbarItems.value.forEach((item) => {
      if (item.name === name) {
        item.active = true
      }
      else {
        item.active = false
      }
    })
  }

  return {
    tabbarList,
    activeTabbar,
    getTabbarItemValue,
    setTabbarItem,
    setTabbarItemActive,
  }
}
