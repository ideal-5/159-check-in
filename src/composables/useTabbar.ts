export interface TabbarItem {
  name: string
  value: number | null
  active: boolean
  title: string
  // icon: string
  activeIcon: string // 激活状态自定义图标路径
  inactiveIcon: string // 未激活状态自定义图标路径
}

const tabbarItems = ref<TabbarItem[]>([
  { name: 'check-in', value: null, active: true, title: '打卡', activeIcon: '/static/tabbar/1-1.png', inactiveIcon: '/static/tabbar/1-0.png' },
  { name: 'statistics', value: null, active: false, title: '统计', activeIcon: '/static/tabbar/2-1.png', inactiveIcon: '/static/tabbar/2-0.png' },
  { name: 'mine', value: null, active: false, title: '我的', activeIcon: '/static/tabbar/3-1.png', inactiveIcon: '/static/tabbar/3-0.png' },
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
