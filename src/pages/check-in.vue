<script setup lang="ts">
definePage({
  name: 'check-in',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
  },
})

const { time } = useClock()

const progress = ref(0)

function nextStep() {
  progress.value = progress.value + 1
  if (progress.value > 2) {
    progress.value = 0
  }
}
</script>

<template>
  <div class="box-border wf bg-#F6F7F9 px1.75">
    <div class="h2.5 wf" />
    <div class="mb2.5 box-border wf flex b-rd-2.5 bg-#fff p3">
      <WImage custom-class="size-12.25! overflow-hidden! b-rd-1.25! flex-shrink-0!" src="https://dummyimage.com/600x400/000/fff" />

      <div class="box-border min-w-0 flex-1 pl3">
        <div class="line-clamp-1 text-(3.75 #121F28)">
          李建华
        </div>
        <div class="line-clamp-1 text-(3.75 #7E8389)">
          四川省小蜜蜂家政服务有限公司
        </div>
      </div>
    </div>

    <div class="box-border wf b-rd-2.5 bg-#fff p3">
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
                <div class="mb3.25 mt2.75 text-3.25">
                  <i class="i-carbon:location-filled text-#03B754" />
                  <span class="ml1.25 text-#7E8389">鄞州区楼花路288号雅居乐花园12号楼2单元</span>
                </div>

                <div class="mb10 box-border w-fit b-rd-0.25 px1.25 py0.25 text-3.25" :style="{ backgroundColor: '#E6F1FF', color: '#056CFF' }">
                  正常
                </div>
              </template>
              <template v-else>
                <div class="mb20 text-(3.75 #121F28)">
                  未打卡
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
                <div class="mb3.25 mt2.75 text-3.25">
                  <i class="i-carbon:location-filled text-#03B754" />
                  <span class="ml1.25 text-#7E8389">鄞州区楼花路288号雅居乐花园12号楼2单元</span>
                </div>

                <div class="box-border w-fit b-rd-0.25 px1.25 py0.25 text-3.25" :style="{ backgroundColor: '#E6F1FF', color: '#056CFF' }">
                  正常
                </div>
              </template>
              <template v-else>
                <div class="text-(3.75 #121F28)">
                  未打卡
                </div>
              </template>
            </div>
          </template>
        </wd-step>
      </wd-steps>

      <div class="wf f-c-c flex-col">
        <div class="size-34.5 f-c-c flex-col b-rd-full bg-red text-#fff" @click="nextStep">
          <div class="text-5 fw500">
            上班打卡
          </div>
          <div class="text-4 text-#fff opacity-50">
            {{ time }}
          </div>
        </div>

        <div class="mb3.25 mt2.75 mt7 box-border flex px8 text-3.25">
          <i class="i-carbon:location-filled text-(4.5 #03B754)" />
          <span class="ml1.25 text-#7E8389">已进入考勤范围：鄞州区楼花路288号雅居乐花园 12号楼2单元1503室</span>
        </div>
      </div>
    </div>
  </div>
</template>
