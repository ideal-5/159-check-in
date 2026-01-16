export type Week = '日' | '一' | '二' | '三' | '四' | '五' | '六'

export interface Day {
  week: Week
  day: number
  month: number
  year: number
  date: string
  isCurrentMonth: boolean
}

const WEEKS: Week[] = ['日', '一', '二', '三', '四', '五', '六']

function formatDate(year: number, month: number, day: number) {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function useMonthCalendar() {
  function calc(year: number, month: number): Day[] {
    const result: Day[] = []

    const firstDayWeek = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

    for (let i = 0; i < 42; i++) {
      const week = WEEKS[i % 7]

      let y = year
      let m = month
      let d = 0
      let isCurrentMonth = false

      if (i < firstDayWeek) {
        // 上个月
        m = month === 1 ? 12 : month - 1
        y = month === 1 ? year - 1 : year
        d = daysInPrevMonth - (firstDayWeek - i - 1)
      }
      else if (i >= firstDayWeek + daysInMonth) {
        // 下个月
        m = month === 12 ? 1 : month + 1
        y = month === 12 ? year + 1 : year
        d = i - (firstDayWeek + daysInMonth) + 1
      }
      else {
        // 当前月
        d = i - firstDayWeek + 1
        isCurrentMonth = true
      }

      result.push({
        week,
        day: d,
        month: m,
        year: y,
        date: formatDate(y, m, d),
        isCurrentMonth,
      })
    }

    return result
  }

  return { calc, WEEKS, formatDate }
}
