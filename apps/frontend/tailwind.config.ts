import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

import baseConfig from '@battleground/tailwind-config/web';

export default {
  content: [...baseConfig.content, '../../packages/ui/src/*.{ts,tsx}'],
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        base: {
          1: '#FAFAFA',
          2: '#09090B',
          3: '#848486',
          4: '#18181B',
        },
        colorful: {
          1: '#0022FF',
        },
        alpha: {
          5: 'rgba(9, 9, 11, 0.05)',
          6: 'rgba(255, 255, 255, 0.06)',
        },
      },
      fontFamily: {
        inter: ['var(--font-inter)', ...fontFamily.sans],
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        sancreek: ['var(--font-sancreek)', ...fontFamily.sans],
        medievalSharp: ['var(--font-medieval-sharp)', ...fontFamily.sans],
        cairo: ['var(--font-cairo)', ...fontFamily.sans],
      },
      boxShadow: {
        1: '0px 9px 45px 0px (rgba(0, 0, 0, 0.12)), 0px 2px 6px 0px (rgba(0, 0, 0, 0.20))',
        2: '0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.18), 0px 2px 1px 0px rgba(0, 0, 0, 0.1), 0px 3px 1px 0px rgba(0, 0, 0, 0.02), 0px 5px 1px 0px rgba(0, 0, 0, 0), 0px 0px 0px 4px rgba(121, 121, 123, 0.24)',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        slide: 'slide 40s linear infinite',
      },
    },
  },
} satisfies Config;
