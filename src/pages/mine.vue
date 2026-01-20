<script setup lang='ts'>
definePage({
  name: 'mine',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const toast = useToast()
const router = useRouter()
const message = useMessage()

const from = ref({
  nickname: user.value?.nickname,
  img: user.value?.avatar,
  tel: user.value?.mobile,
})

async function onChooseAvatar(e: any) {
  const avatarUrl = e.detail.avatarUrl
  console.log(avatarUrl)
  const url = await uploadImg(avatarUrl)
  const { code, msg } = await Apis.general.post_api_attendance_edituser({ data: { avatar: url } })
  toast[code === 1 ? 'success' : 'error'](msg)
  if (code === 1) {
    await userStore.getUserInfo()
    from.value = {
      nickname: user.value?.nickname,
      img: user.value?.avatar,
      tel: user.value?.mobile,
    }
  }
}

async function uploadImg(avatarUrl: string) {
  const res = await Apis.general.post_api_common_upload({
    requestType: 'upload',
    data: {
      name: 'file',
      filePath: avatarUrl,
    },
  } as any).send()
  const { data } = JSON.parse(res as any)
  return data.fullurl
}

function logout() {
  message
    .confirm({
      title: '确认退出登录吗？',
      confirmButtonText: '确定退出',
      confirmButtonProps: { type: 'error' },
    })
    .then(() => {
      userStore.logout()
      router.replaceAll({ name: 'login' })
    })
    .catch(() => {
      console.log('点击了取消按钮')
    })
}
</script>

<template>
  <div class="h2.5 wf" />
  <div class="box-border wf f-c flex-col px2.5">
    <button
      class="mb2.5 size-15.75 b-rd-full"
      open-type="chooseAvatar"
      @chooseavatar="onChooseAvatar"
    >
      <WImage :src="from.img" custom-class="b-rd-full size-full overflow-hidden" />
    </button>

    <div class="text-(4.75 #111827) fw500">
      {{ user?.nickname }}
    </div>

    <div class="mt2.5 wf b-rd-2.5 bg-#fff">
      <div class="box-border wf flex px4 py3">
        <div class="mr2 w-fit flex-shrink-0 text-(3.5 #111827)">
          <span class="i-carbon:user mr2 text-primary" />
          <span>用户名称</span>
        </div>
        <div class="min-w-0 flex-1">
          <wd-input
            v-model="from.nickname"
            disabled
            no-border
            placeholder="请输入用户名"
            custom-input-class="text-right!"
            type="nickname"
          />
        </div>
      </div>

      <div class="box-border wf flex b-rd-2.5 bg-#fff px4 py3">
        <div class="mr2 w-fit flex-shrink-0 text-(3.5 #111827)">
          <span class="i-carbon:tablet mr2 text-primary" />
          <span>手机号</span>
        </div>
        <div class="min-w-0 flex-1">
          <wd-input
            v-model="from.tel"
            disabled
            no-border
            placeholder="请输入电话号"
            custom-input-class="text-right!"
            type="number"
            :maxlength="11"
          />
        </div>
      </div>
    </div>

    <wd-button custom-class="b-rd-2.5! h11! wf! mt10!" @click="logout">
      退出登录
    </wd-button>
  </div>
</template>

<style scoped lang='scss'>

</style>
