<script setup lang="ts">
definePage({
  name: 'statistics',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '统计',
  },
})

const { calc, WEEKS, formatDate } = useMonthCalendar()

// 当前年月
const now = new Date()
const activeYearMonth = ref<[number, number]>([
  now.getFullYear(),
  now.getMonth() + 1, // ⚠️ JS 月份是 0-11
])

// 当前选中的日期 默认今天
const activeDay = ref(formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate()))

//  月份切换
function addMonth(delta: number) {
  let [y, m] = activeYearMonth.value
  m += delta

  while (m > 12) {
    m -= 12
    y++
  }
  while (m < 1) {
    m += 12
    y--
  }
  activeYearMonth.value = [y, m]
}

function monthChange({ detail: { value }}: { detail: { value: string } }) {
  const [year, month] = value.split('-').map(Number)
  activeYearMonth.value = [Number(year), Number(month)]
}

type Day = ReturnType<typeof calc>[number]
const days = ref<Day[]>([])

watch(() => activeYearMonth.value, () => {
  days.value = calc(...activeYearMonth.value)
  console.log('days.value', days.value)
}, { immediate: true })

function tapDay(day: Day) {
  uni.vibrateShort({ type: 'light' })
  activeDay.value = day.date
}

const progress = ref(0)
</script>

<template>
  <div class="bg-#F6F7F9">
    <div class="h2.5 wf" />
    <!-- 日历视图 -->
    <div class="h-fit bg-#fff">
      <div class="box-border wf f-c-c py2 text-(3.75 #121F28)">
        <div class="box-border px2.5" @click="addMonth(-1)">
          <i class="i-carbon:chevron-left" />
        </div>
        <picker
          bindchange="bindPickerChange"
          :value="`${activeYearMonth[0]}-${String(activeYearMonth[1]).padStart(2, '0')}`"
          mode="date"
          fields="month"
          @change="monthChange"
        >
          <div class="text-(3.75 #121F28) fw600">
            {{ `${activeYearMonth[0]}年${activeYearMonth[1]}月` }}
          </div>
        </picker>
        <div class="box-border px2.5" @click="addMonth(1)">
          <i class="i-carbon:chevron-right" />
        </div>
      </div>

      <div class="grid grid-cols-7 wf gap-1">
        <div
          v-for="week in WEEKS"
          :key="week"
          class="box-border wf f-c-c py4 text-(3 #121F28)"
        >
          {{ week }}
        </div>
        <template
          v-for="day in days"
          :key="day.date"
        >
          <div class="h-fit wf" @click="tapDay(day)">
            <div
              v-if="day.isCurrentMonth"
              class="box-border wf f-c-c b-rd-full py4 text-3.5"
              :class="[
                (day.week === '六' || day.week === '日') && 'text-#888F93',
                activeDay === day.date && 'bg-#EBF3FF',
              ]"
            >
              <div class="relative">
                {{ day.day }}

                <div class="absolute left-50% top-100% size-1 b-rd-full bg-blue -translate-x-50%" />
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="box-border box-border wf f-c py3.5 text-(3.25 #121F28)">
        <div class="mx3.5 f-c">
          <div class="mr2 size-1.5 b-rd-full bg-primary" />
          <div>正常打卡</div>
        </div>
        <div class="f-c">
          <div class="mr2 size-1.5 b-rd-full bg-#FE1504" />
          <div>异常打卡</div>
        </div>
      </div>
    </div>

    <div class="mt2.5 wf bg-#fff">
      <div class="box-border wf b-b-(1px #F6F7F9 solid) px4 py3.5">
        <div class="text-(3.75 #121F28)">
          上下班打卡
        </div>
        <div class="text-(3.5 #7E8389)">
          (工时7小时37分钟)
        </div>
      </div>

      <div class="box-border wf p3.5">
        <wd-steps vertical :active="progress">
          <wd-step>
            <template #title>
              <div class="text-(3.5 #7E8389)">
                签到时间 09:00
              </div>
            </template>
            <template #description>
              <div class="wf">
                <template v-if="progress > 0">
                  <div class="text-(3.75 #121F28)">
                    打卡时间 08:59
                  </div>
                  <div class="mb10 box-border w-fit b-rd-0.25 px1.25 py0.25 text-3.25" :style="{ backgroundColor: '#E6F1FF', color: '#056CFF' }">
                    正常
                  </div>
                </template>
              </div>
            </template>
          </wd-step>
          <wd-step>
            <template #title>
              <div class="text-(3.5 #7E8389)">
                签退时间 18:00
              </div>
            </template>
            <template #description>
              <div class="wf">
                <template v-if="progress > 1">
                  <div class="text-(3.75 #121F28)">
                    打卡时间 08:59
                  </div>
                  <div class="box-border w-fit b-rd-0.25 px1.25 py0.25 text-3.25" :style="{ backgroundColor: '#E6F1FF', color: '#056CFF' }">
                    正常
                  </div>
                </template>
              </div>
            </template>
          </wd-step>
        </wd-steps>
      </div>
    </div>
  </div>
</template>
