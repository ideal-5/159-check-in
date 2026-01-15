<script setup lang='ts'>
definePage({
  name: 'login',
  style: {
    navigationStyle: 'custom',
  },
})

const model = reactive<{
  value1: string
  value2: string
}>({
  value1: '',
  value2: '',
})
const form = ref()

function handleSubmit() {
  if (!form.value) {
    return
  }
  form.value
    .validate()
    .then(({ valid }: { valid: boolean }) => {
      if (valid) {
        // 登录
      }
    })
}
</script>

<template>
  <div class="wf h100vh flex flex-col">
    <div class="wf f-c-c bg-primary h81.5 flex-shrink-0">
      <div class="size-26.5 b-rd-3.25 bg-#D8D8D8">
        <image
          src=""
          mode="aspectFill"
          class="size-full"
        />
      </div>
    </div>

    <div class="wf min-h-0 flex-1 b-rd-t-5 bg-#fff -mt12">
      <wd-form ref="form" :model="model" custom-class="size-full">
        <div class="wf mb9.75 box-border px5">
          <div class="wf f-c mb3.75 mt20 h12.5">
            <wd-input
              v-model="model.value1"
              style="--wot-input-bg:#F2F8FF"
              custom-class="wf hf box-border px4 b-rd-1.75 bg-#F6F6F6!"
              prop="value1"
              clearable
              no-border
              placeholder="请输入账号"
              :rules="[{ required: true, message: '请填写账号' }]"
            >
              <template #prefix>
                <image
                  src=""
                  class="size-4.5 bg-red"
                />
              </template>
            </wd-input>
          </div>

          <div class="wf f-c h12.5 b-rd-1.75">
            <wd-input
              v-model="model.value2"
              style="--wot-input-bg:#F2F8FF"
              custom-class="wf hf box-border px4 b-rd-1.75 bg-#F6F6F6!"
              prop="value2"
              no-border
              show-password
              placeholder="输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            >
              <template #prefix>
                <image
                  src=""
                  class="size-4.5 bg-red"
                />
              </template>
            </wd-input>
          </div>
        </div>
        <div class="mb21 box-border px3.75">
          <wd-button
            :custom-class="`wf! h11! b-rd-1.5! text-4! fw500! ${(!model.value1 || !model.value2) && 'is-disabled'}`"
            type="primary"
            block
            @click="handleSubmit"
          >
            提交
          </wd-button>
          <!-- <div class="wf f-c mt3.75" @click="agree = !agree">
              <div class="f-c-c mr1.5 size-4 b-(1px #A0AEC0 rd-0.5 solid) transition-all" :class="agree && 'bg-primary b-(primary)'">
                <wd-icon v-if="agree" name="check" size="12px" color="#fff" />
              </div>
              <div>
                <p class="text-(3 #A0AEC0)">
                  已阅读并同意<span class="text-primary">《服务条款》</span>与<span class="text-primary">《隐私政策》</span>
                </p>
              </div>
            </div> -->
        </div>
      </wd-form>
    </div>
  </div>
</template>

<style scoped lang='scss'>
:deep(.wd-input__body) {
  height: 100%;
  .wd-input__value {
    height: 100%;
  }
}
</style>
