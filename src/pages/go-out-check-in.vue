<script setup lang='ts'>
definePage({
  name: 'go-out-check-in',
  style: {
    navigationBarTitleText: '外勤打卡',
    enablePullDownRefresh: true,
  },
})

type CheckInParams = Parameters<typeof Apis.general.post_api_attendance_clock>[0]
interface LocationData {
  address: string
  name: string
  latitude: number
  longitude: number
}

const toast = useToast()
const { time } = useClock()
const router = useRouter()

const { loading: checkInLoading, send: checkInSend } = useRequest(
  (data: CheckInParams) => Apis.general.post_api_attendance_clock(data),
  { immediate: false, cacheFor: 0 },
)

const val = ref('')

const locationDate = ref<LocationData>()

async function selectAddress() {
  const { address, name, latitude, longitude } = await uni.chooseLocation()
  locationDate.value = {
    address,
    name,
    latitude,
    longitude,
  }
}

onLoad(() => {
  if (!locationDate.value) {
    selectAddress()
  }
})

async function checkIn() {
  if (!locationDate.value) {
    toast.warning('获取位置信息失败')
    return
  }
  if (!val.value) {
    toast.warning('请填写外出理由')
    return
  }
  const { address, latitude, longitude } = locationDate.value
  const { code, msg } = await checkInSend({ data: {
    lng: longitude,
    lat: latitude,
    location: address,
    is_outing: '1',
    outing_reason: val.value,
  } })
  toast[code === 1 ? 'success' : 'error'](msg)
  if (code === 1) {
    setTimeout(() => {
      router.back()
    }, 500)
  }
}
</script>

<template>
  <div class="box-border wf px1.5 pt2.5">
    <div class="box-border wf b-rd-2.5 bg-#fff pb10">
      <div class="relative wf">
        <image
          src="@/static/map.png"
          mode="widthFix"
          class="wf"
          @click="selectAddress"
        />
        <div class="absolute left-5 right-5 top-50% h50% f-c -translate-y-50%">
          <div class="min-w-0 flex-1 text-#2A9E28">
            <div class="mb1.5 text-5.25">
              {{ locationDate?.name }}
            </div>
            <div class="text-3.25">
              {{ locationDate?.address }}
            </div>
          </div>
          <div class="ml3 w-fit f-c flex-shrink-0 text-(3 #287EF0)">
            <span>选择</span>
            <span class="i-carbon:chevron-right" />
          </div>
        </div>
      </div>
      <div class="box-border wf px5.25">
        <div class="relative mb2.75 text-(3.5 #121F28) fw500">
          <span class="text-#FE1504">*</span>
          <span>外出理由</span>
        </div>
        <wd-textarea
          v-model="val"
          custom-class="bg-#F6F7F9!"
          placeholder="请输入外出理由"
          :maxlength="500"
          show-word-limit
        />
      </div>

      <div class="mt20 wf f-c-c">
        <wd-button
          :loading="checkInLoading"
          custom-class="size-34.5! f-c-c! flex-col! b-rd-full! bg-#5BC68F! text-#fff!"
          @click="checkIn"
        >
          <div class="text-5 fw500">
            外出打卡
          </div>
          <div class="text-4 text-#fff opacity-50">
            {{ time }}
          </div>
        </wd-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
:deep(.wd-textarea__inner) {
  @apply bg-#F6F7F9!
}
:deep(.wd-textarea__value) {
  @apply bg-#F6F7F9!
}
:deep(.wd-textarea__count) {
  @apply bg-#F6F7F9!
}
</style>
