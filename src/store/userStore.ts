import { defineStore } from 'pinia'

type User = Awaited<ReturnType<typeof Apis.general.get_api_attendance_userinfo>>['data']

export const useUserStore = defineStore('user', () => {
  const token = ref('')

  const user = ref<User>()

  const getUserInfo = async () => {
    const { data } = await Apis.general.get_api_attendance_userinfo()
    user.value = data
  }

  const logout = async () => {
    token.value = ''
    user.value = undefined
  }

  return {
    token,
    user,
    getUserInfo,
    logout,
  }
})
