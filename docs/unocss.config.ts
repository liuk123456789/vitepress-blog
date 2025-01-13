import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // 其他规则...
  theme: {
    fontFamily: {
      sans: 'Computer Modern Sans, LXGW WenKai, HKST',
    },
    boxShadow: {
      nav: '0 1px 8px 0 rgba(27, 35, 47, .1)',
    },
    colors: {
      brand: '#1772d0',
    },
    maxWidth: {
      content: '90ch',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'sub',
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        ui: 'DM Sans:400,700',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // 其他规则...
})
