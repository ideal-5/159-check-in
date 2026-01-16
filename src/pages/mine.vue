<script setup lang='ts'>
definePage({
  name: 'mine',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '我的',
  },
})

const from = ref({
  nickname: '',
  img: '',
  tel: '',
})

function chooseAvatar() {
  console.log('123')
}
</script>

<template>
  <div class="h2.5 wf" />
  <div class="box-border wf f-c flex-col px2.5">
    <button
      class="mb2.5 size-15.75 b-rd-full"
      open-type="chooseAvatar"
      @chooseavatar="chooseAvatar"
    >
      <WImage src="https://picsum.photos/200/300" custom-class="b-rd-full size-full overflow-hidden" />
    </button>

    <div class="text-(4.75 #111827) fw500">
      温润小队长
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
            no-border
            placeholder="请输入电话号"
            custom-input-class="text-right!"
            type="number"
            :maxlength="11"
          />
        </div>
      </div>
    </div>

    <wd-button custom-class="b-rd-2.5! h11! wf! mt10!">
      退出登录
    </wd-button>
  </div>
</template>

<style scoped lang='scss'>

</style>
