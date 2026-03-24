/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // SocialPulse brand palette — purple + pink
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',  // main brand
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                accent: {
                    400: '#f472b6',
                    500: '#ec4899',  // pink accent
                    600: '#db2777',
                },
                dark: {
                    800: '#1a1a2e',
                    900: '#0f0f1a',  // background
                },
            },
            animation: {
                'fade-in':  'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%':   { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)',     opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
