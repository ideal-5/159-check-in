<script setup lang='ts'>
definePage({
  name: 'login',
  style: {
    navigationStyle: 'custom',
  },
})

const userStore = useUserStore()
const { token } = storeToRefs(userStore)

const router = useRouter()

const model = reactive<{
  value1: string
  value2: string
}>({
  value1: 'zhbgs',
  value2: '123456',
})
const form = ref()

const { loading, send } = useRequest(
  Apis.general.post_api_user_login,
  { immediate: false, cacheFor: 0 },
)

const toast = useToast()
async function handleSubmit() {
  if (!form.value) {
    return
  }

  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }

  try {
    const { code, data, msg } = await send({ data: { account: model.value1, password: model.value2 } })
    if (code !== 1) {
      toast.error(msg)
      return
    }
    toast.success(msg)
    token.value = data.userinfo.token
    router.pushTab({ name: 'check-in' })
  }
  catch (err) {
    console.error('接口请求失败', err)
  }
}
</script>

<template>
  <div class="h100vh wf flex flex-col">
    <div class="h81.5 wf f-c-c flex-shrink-0 bg-primary">
      <div class="size-26.5 b-rd-3.25 bg-#D8D8D8">
        <image
          src=""
          mode="aspectFill"
          class="size-full"
        />
      </div>
    </div>

    <div class="min-h-0 wf flex-1 b-rd-t-5 bg-#fff -mt12">
      <wd-form ref="form" :model="model" custom-class="size-full">
        <div class="mb9.75 box-border wf px5">
          <div class="mb3.75 mt20 h12.5 wf f-c">
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
                <span class="i-carbon:tablet size-4.5 text-#1B2441" />
              </template>
            </wd-input>
          </div>

          <div class="h12.5 wf f-c b-rd-1.75">
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
                <span class="i-carbon:locked size-4.5 text-#1B2441" />
              </template>
            </wd-input>
          </div>
        </div>
        <div class="mb21 box-border px3.75">
          <wd-button
            :loading
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
