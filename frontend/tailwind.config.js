/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Web3 Color System
        'web3': {
          'dark': '#0A0D18',
          'darker': '#050712',
          'navy': '#0E1528',
          'slate': '#1A2332',
          'primary': '#5B4FE8',
          'secondary': '#3B82F6',
          'accent': '#06B6D4',
          'success': '#10B981',
          'warning': '#F59E0B',
          'danger': '#EF4444',
          'purple': '#5B4FE8',
          'blue': '#3B82F6',
          'cyan': '#06B6D4',
          'emerald': '#10B981',
          'amber': '#F59E0B',
          'rose': '#F43F5E',
          'gray': {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        },
        'gradient': {
          'start': '#667eea',
          'middle': '#764ba2',
          'end': '#f093fb',
          'purple': '#6C5CE7',
          'pink': '#FD79A8',
          'cyan': '#00CEC9',
        },
        'glass': {
          'white': 'rgba(255, 255, 255, 0.1)',
          'dark': 'rgba(0, 0, 0, 0.3)',
          'purple': 'rgba(108, 92, 231, 0.1)',
        },
        'stacks': {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        'neon': {
          'blue': '#00D4FF',
          'purple': '#B794F6',
          'pink': '#F687B3',
          'green': '#68D391',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(108, 92, 231, 0.3)',
        'glow-lg': '0 0 40px rgba(108, 92, 231, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'web3': '0 4px 24px rgba(108, 92, 231, 0.15)',
        'web3-lg': '0 8px 48px rgba(108, 92, 231, 0.2)',
        'neon': '0 0 10px currentColor',
        'neon-lg': '0 0 20px currentColor',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'web3-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0B0E1A 0%, #1A1F3A 50%, #2D1B69 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #74b9ff 75%, #00cec9 100%)',
        'mesh-pattern': 'radial-gradient(circle at 30px 30px, rgba(108, 92, 231, 0.3) 1.5px, transparent 1.5px)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(108, 92, 231, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-purple': {
          background: 'rgba(108, 92, 231, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(108, 92, 231, 0.2)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-web3': {
          background: 'linear-gradient(135deg, #5B4FE8 0%, #3B82F6 50%, #06B6D4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.btn-web3': {
          background: 'linear-gradient(135deg, #5B4FE8 0%, #3B82F6 100%)',
          border: 'none',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '0.95rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 14px 0 rgba(91, 79, 232, 0.25)',
        },
        '.btn-web3:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(91, 79, 232, 0.4)',
        },
        '.btn-glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
        },
        '.btn-glass:hover': {
          background: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-2px)',
        },
        '.card-web3': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          transition: 'all 0.3s ease',
        },
        '.card-web3:hover': {
          background: 'rgba(255, 255, 255, 0.1)',
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(108, 92, 231, 0.2)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}