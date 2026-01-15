export function useClock() {
  const time = ref('')

  let timer: ReturnType<typeof setInterval> | null = null

  const update = () => {
    const d = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    time.value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (timer)
      clearInterval(timer)
  })

  return { time }
}
