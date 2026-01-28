<script setup lang="ts">
definePage({
  name: 'check-in',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '打卡',
    enablePullDownRefresh: true,
  },
})

type CheckInInfoParams = Parameters<typeof Apis.general.post_api_attendance_index>[0]

/**
 * not=还没打卡 normal=正常,late=迟到,early_leave=早退,absent=缺卡
 */
type checkInDotsStatus = 'not' | 'normal' | 'late' | 'early_leave' | 'absent'

interface CheckInData {
  dots: {
    status: checkInDotsStatus
    statusInfo: Partial<Record<checkInDotsStatus, {
      title: string
      content?: string
      checkInInfo?: string
      tag?: { text: string, bg: string, color: string }[]
    }>>
  }[]
  is_in_range: boolean
  location_name: string
}

type CheckInParams = Parameters<typeof Apis.general.post_api_attendance_clock>[0]

const { time } = useClock()
const toast = useToast()
const { reverseGeocoder } = useQQMap()
const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { send } = useRequest(
  (data: CheckInInfoParams) => Apis.general.post_api_attendance_index(data),
  { immediate: false, cacheFor: 0 },
)

const { loading: checkInLoading, send: checkInSend } = useRequest(
  (data: CheckInParams) => Apis.general.post_api_attendance_clock(data),
  { immediate: false, cacheFor: 0 },
)

const progress = ref(99)

const checkInInfo = ref<Awaited<ReturnType<typeof Apis.general.post_api_attendance_index>>['data']>()

const checkInData = ref<CheckInData>()

const locationDate = ref<{ location: { latitude: number, longitude: number }, address: string }>()
let getLocationDateTimer: ReturnType<typeof setInterval> | null = null
async function getLocationDate() {
  try {
    const { latitude, longitude } = await uni.getLocation({ type: 'gcj02' })
    const { result: { formatted_addresses: { standard_address } } } = await reverseGeocoder({ latitude, longitude })
    locationDate.value = {
      location: {
        latitude,
        longitude,
      },
      address: standard_address,
    }
  }
  catch {
    toast.warning('获取位置信息失败')
    if (getLocationDateTimer) {
      clearTimeout(getLocationDateTimer)
    }
    throw new Error('获取位置信息失败')
  }
}

async function getCheckInData() {
  const { data } = await send({ data: { lng: locationDate.value?.location?.longitude, lat: locationDate.value?.location.latitude } })
  checkInInfo.value = {
    ...data,
    // is_in_range: true, // 是否进如考勤范围
  }

  checkInData.value = {
    dots: [
      // 早卡
      {
        status: 'not', // 状态 not=还没打卡 normal=正常,late=迟到,early_leave=早退,absent=缺卡
        statusInfo: {
          not: {
            title: `签到时间 ${data.work_start}`,
            content: '未打卡',
          },
          normal: {
            title: `签到时间 ${data.work_start}`,
            content: `打卡时间 ${data.clock_in?.time}`,
            checkInInfo: data.clock_in?.location,
            tag: [
              { text: '正常', bg: '#E6F1FF', color: '#056CFF' },
              ...(data.clock_in?.outing
                ? [{ text: '外出打卡', bg: '#E6F1FF', color: '#056CFF' }]
                : []),
            ],
          },
          late: {
            title: `签到时间 ${data.work_start}`,
            content: '迟到卡',
            tag: [
              { text: '迟到', bg: '#E6F1FF', color: '#056CFF' },
              ...(data.clock_in?.outing
                ? [{ text: '外出打卡', bg: '#E6F1FF', color: '#056CFF' }]
                : []),
            ],
          },
          absent: {
            title: `签到时间 ${data.work_start}`,
            content: '缺卡',
          },
        },
      },
      // 下班卡
      {
        status: 'not', // 状态 not=还没打卡 normal=正常,late=迟到,early_leave=早退,absent=缺卡
        statusInfo: {
          not: {
            title: `签到时间 ${data.work_end}`,
            content: '未打卡',
          },
          normal: {
            title: `签到时间 ${data.work_end}`,
            content: `打卡时间 ${data.clock_out?.time}`,
            checkInInfo: data.clock_out?.location,
            tag: [
              { text: '正常', bg: '#E6F1FF', color: '#056CFF' },
              ...(data.clock_out?.outing
                ? [{ text: '外出打卡', bg: '#E6F1FF', color: '#056CFF' }]
                : []),
            ],
          },
          early_leave: {
            title: `签到时间 ${data.work_end}`,
            content: '早退',
            tag: [
              ...(data.clock_out?.outing
                ? [{ text: '外出打卡', bg: '#E6F1FF', color: '#056CFF' }]
                : []),
            ],
          },
          absent: {
            title: `签到时间 ${data.work_end}`,
            content: '缺卡',
          },
        }, // 打卡时间
      },
    ],
    is_in_range: data.is_in_range, // 是否进如考勤范围
    location_name: data.location_name, // 考勤地点
  }
  if (!checkInData.value) {
    return
  }

  if (!data.clock_in || data.clock_in?.status === 'absent') {
    checkInData.value.dots[0].status = 'not'
  }
  else {
    checkInData.value.dots[0].status = data.clock_in?.status as checkInDotsStatus
  }

  if (!data.clock_out || data.clock_out?.status === 'absent') {
    checkInData.value.dots[1].status = 'not'
  }
  else {
    checkInData.value.dots[1].status = data.clock_out?.status as checkInDotsStatus
  }
}

onShow(async () => {
  if (getLocationDateTimer) {
    clearInterval(getLocationDateTimer)
  }
  await getLocationDate()
  await getCheckInData()

  getLocationDateTimer = setInterval(async () => {
    await getLocationDate()
    await getCheckInData()
  }, 60 * 1000)
})

onHide(() => {
  if (getLocationDateTimer) {
    clearInterval(getLocationDateTimer)
    getLocationDateTimer = null
  }
})

onPullDownRefresh(async () => {
  await getLocationDate()
  await getCheckInData()
  uni.stopPullDownRefresh()
})

async function checkIn() {
  if (!locationDate.value) {
    toast.warning('获取位置信息失败')
    return
  }
  const { address, location: { latitude, longitude } } = locationDate.value
  const { code, msg } = await checkInSend({ data: {
    lng: longitude,
    lat: latitude,
    location: address,
  } })
  toast[code === 1 ? 'success' : 'error'](msg)
  if (code === 1) {
    getCheckInData()
  }
}
</script>

<template>
  <div class="box-border wf bg-#F6F7F9 px1.75">
    <div class="h2.5 wf" />
    <div class="mb2.5 box-border wf flex b-rd-2.5 bg-#fff p3">
      <WImage
        custom-class="size-12.25! overflow-hidden! b-rd-1.25! flex-shrink-0!"
        :src="user?.avatar"
      />
      <div class="box-border min-w-0 flex-1 pl3">
        <div class="line-clamp-1 text-(3.75 #121F28)">
          {{ user?.nickname }}
        </div>
        <div class="line-clamp-1 text-(3.75 #7E8389)">
          {{ user?.company }}
        </div>
      </div>
    </div>

    <div class="box-border wf b-rd-2.5 bg-#fff p3">
      <wd-steps vertical :active="progress">
        <wd-step v-for="(dot, ind) in checkInData?.dots" :key="ind">
          <template #title>
            <div class="text-(3.5 #7E8389)">
              {{ dot.statusInfo[dot.status]?.title }}
            </div>
          </template>
          <template #description>
            <div class="wf">
              <div class="text-(3.75 #121F28)">
                {{ dot.statusInfo[dot.status]?.content }}
              </div>
              <div v-if="dot.statusInfo[dot.status]?.checkInInfo" class="mb3.25 mt2.75 text-3.25">
                <i class="i-carbon:location-filled text-#03B754" />
                <span class="ml1.25 text-#7E8389">{{ dot.statusInfo[dot.status]?.checkInInfo }}</span>
              </div>

              <div
                v-for="(tag, i) in (dot.statusInfo[dot.status]?.tag || [])"
                :key="i"
                class="mb10 box-border w-fit b-rd-0.25 px1.25 py0.25 text-3.25"
                :style="{ backgroundColor: tag.bg, color: tag.color }"
              >
                {{ tag.text }}
              </div>
            </div>
          </template>
        </wd-step>
      </wd-steps>

      <div class="wf f-c-c flex-col">
        <wd-button
          v-if="checkInInfo && checkInInfo?.is_in_range"
          custom-class="size-34.5! f-c-c! flex-col! b-rd-full! bg-[linear-gradient(180deg,#04A5FD_0%,#0569FF_100%)]! text-#fff!"
          :loading="checkInLoading"
          @click="checkIn"
        >
          <div class="text-5 fw500">
            上班打卡
          </div>
          <div class="text-4 text-#fff opacity-50">
            {{ time }}
          </div>
        </wd-button>

        <wd-button
          v-if="checkInInfo && !checkInInfo?.is_in_range"
          custom-class="size-34.5! f-c-c! flex-col! b-rd-full! bg-#5BC68F! text-#fff!"
          @click="router.push({ name: 'go-out-check-in' })"
        >
          <div class="text-5 fw500">
            外出打卡
          </div>
          <div class="text-4 text-#fff opacity-50">
            {{ time }}
          </div>
        </wd-button>

        <div class="mb3.25 mt2.75 mt7 box-border f-c px8 text-3.25">
          <!-- :class="[checkInInfo?.is_in_range ? 'text-#03B754' : 'text-#EECC52']" -->
          <i class="i-carbon:location-filled text-(4.5 #03B754)" />
          <p class="ml1.25 ml1.25 text-#7E8389">
            <span v-if="checkInInfo?.is_in_range">已进入考勤范围：</span>
            <span>{{ checkInInfo?.is_in_range ? checkInInfo?.location_name : locationDate?.address }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
