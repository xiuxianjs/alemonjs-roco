/**
 *  @type {import('tailwindcss').Config}
 */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './views/**/*.{html,js,json}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#47ada8',
          accent: '#d3bc8e',
          dark: '#1d3940'
        },
        /* PetDetailCard 温暖奶油色调 */
        pet: {
          bg: '#F5EDE0',
          panel: 'rgba(245,237,224,0.85)',
          text: '#3A2E22',
          'text-sec': '#6B5D4F',
          'text-dim': '#9E9183',
          border: 'rgba(180,160,130,0.3)',
          stat: 'rgba(255,255,255,0.6)',
          skill: 'rgba(255,255,255,0.55)',
          accent: '#C4943A'
        },
        /* PetListCard 复古卡牌色调 */
        list: {
          bg: '#2A2420',
          cream: '#F5EDE0',
          tan: '#D4B896',
          kraft: '#8B6914',
          'kraft-lt': '#C49A3C',
          card: '#F0E6D0',
          dim: '#9E8E7A',
          border: '#3E3530',
          dotted: '#5A4E44'
        },
        /* Help 金色票券 */
        help: {
          gold: '#E8A820',
          'gold-dk': '#C48D1A',
          'gold-dp': '#A67610',
          cream: '#F0E6D0',
          dark: '#2D2D2D',
          star: '#E8B830',
          border: '#F5C842'
        },
        /* CardBase 暗色面板 */
        base: {
          bg: '#1a1a2e',
          green: '#4caf50',
          'green-lt': '#90ee90',
          'green-dim': 'rgba(76, 175, 80, 0.2)',
          'green-bd': 'rgba(76, 175, 80, 0.4)',
          panel: 'rgba(20, 22, 26, 0.6)',
          'panel-bd': 'rgba(255, 255, 255, 0.08)',
          dim: '#6d717a'
        }
      },
      boxShadow: {
        card: '0 5px 10px 0 rgba(0,0,0,0.15)',
        'card-sm': '0 2px 8px rgba(0,0,0,0.08)',
        'card-md': '0 3px 10px rgba(0,0,0,0.25)',
        avatar: '0 4px 16px rgba(0,0,0,0.12)',
        cream: '0 4px 12px rgba(0,0,0,0.12)'
      },
      borderRadius: {
        'card': '20px',
        'avatar': '18px'
      }
    }
  }
};
