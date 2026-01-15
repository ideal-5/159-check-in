import { presetUni } from '@uni-helper/unocss-preset-uni'

import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUni({
      attributify: false,
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      // HBuilderX 必须针对要使用的 Collections 做异步导入
      // collections: {
      //   carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
      // },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: [
    ['f-c-c', 'flex justify-center items-center'],
    ['f-c', 'flex items-center'],
    ['f-c-w', 'flex items-center justify-between'],
    ['wf', 'wfull'],
    ['hf', 'hfull'],
    ['bg-t', 'bg-transparent'],
  ],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    // 玻璃效果
    [
      /^glass-(\d+)$/,
      ([, d]) => ({
        'background-color': 'rgba(255,255,255,0.08)',
        '-webkit-backdrop-filter': `blur(${d}px)`,
        'backdrop-filter': `blur(${d}px)`,
        'border': '1px solid rgba(255,255,255,0.12)',
        'border-radius': '1rem',
        'box-shadow': '0 8px 24px rgba(0,0,0,0.18)',
      }),
    ],
    // 点击状态
    ['status-hover', {
      transition: 'filter 0.2s, transform 0.2s',
      filter: 'brightness(0.95)',
      // transform: 'scale(0.99)',
    }],
    /**
     *
     * 主题渐变背景
     * bg-theme-g-[direction]-[opacity]
     *
     */
    [
      /^bg-theme-g-([a-zA-Z-_]+)-(\d{1,3})$/,
      ([, direction, opacity]) => {
        const alpha = Math.min(Number(opacity), 100)

        return {
          background: `linear-gradient(
        ${direction.replace(/-/g, ' ')},
        color-mix(in srgb, var(--wot-color-theme) ${alpha}%, transparent),
        transparent
      )`,
        }
      },
    ],

  ],

  theme: {
    colors: {
      /** 主题色，用法如: text-primary */
      primary: 'var(--wot-color-theme,#FF2762)',
      primary10: 'color-mix(in srgb, var(--wot-color-theme) 10%, transparent)',
      primary20: 'color-mix(in srgb, var(--wot-color-theme) 20%, transparent)',
      primary30: 'color-mix(in srgb, var(--wot-color-theme) 30%, transparent)',
      primary40: 'color-mix(in srgb, var(--wot-color-theme) 40%, transparent)',
      primary50: 'color-mix(in srgb, var(--wot-color-theme) 50%, transparent)',
    },
    fontSize: {
      /** 提供更小号的字体，用法如：text-2xs */
      '2xs': ['20rpx', '28rpx'],
      '3xs': ['18rpx', '26rpx'],
    },
  },
})
