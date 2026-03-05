/** @type {import('tailwindcss').Config} */
export default {
darkMode: ["class"],
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: {
extend: {
borderRadius: {
'xs': 'var(--m3-shape-xs)',
'sm': 'var(--m3-shape-sm)',
'md': 'var(--m3-shape-md)',
'lg': 'var(--m3-shape-lg)',
'xl': 'var(--m3-shape-xl)',
'full': 'var(--m3-shape-full)'
},
colors: {
indigo: {
100: 'hsl(var(--info) / 0.28)',
200: 'hsl(var(--info) / 0.34)',
300: 'hsl(var(--info) / 0.42)',
400: 'hsl(var(--info) / 0.52)',
500: 'hsl(var(--info) / <alpha-value>)',
600: 'hsl(var(--info) / <alpha-value>)',
700: 'hsl(var(--info) / 0.9)',
900: 'hsl(var(--info) / 0.28)'
},
blue: {
100: 'hsl(var(--info) / 0.28)',
200: 'hsl(var(--info) / 0.34)',
300: 'hsl(var(--info) / 0.42)',
400: 'hsl(var(--info) / 0.52)',
500: 'hsl(var(--info) / <alpha-value>)',
600: 'hsl(var(--info) / <alpha-value>)',
700: 'hsl(var(--info) / 0.9)',
900: 'hsl(var(--info) / 0.28)'
},
cyan: {
100: 'hsl(var(--info) / 0.28)',
200: 'hsl(var(--info) / 0.34)',
300: 'hsl(var(--info) / 0.42)',
400: 'hsl(var(--info) / 0.52)',
500: 'hsl(var(--info) / <alpha-value>)',
600: 'hsl(var(--info) / <alpha-value>)',
700: 'hsl(var(--info) / 0.9)',
900: 'hsl(var(--info) / 0.28)'
},
violet: {
100: 'hsl(var(--tertiary) / 0.28)',
200: 'hsl(var(--tertiary) / 0.34)',
300: 'hsl(var(--tertiary) / 0.42)',
400: 'hsl(var(--tertiary) / 0.52)',
500: 'hsl(var(--tertiary) / <alpha-value>)',
600: 'hsl(var(--tertiary) / <alpha-value>)',
700: 'hsl(var(--tertiary) / 0.9)',
900: 'hsl(var(--tertiary) / 0.28)'
},
purple: {
100: 'hsl(var(--tertiary) / 0.28)',
200: 'hsl(var(--tertiary) / 0.34)',
300: 'hsl(var(--tertiary) / 0.42)',
400: 'hsl(var(--tertiary) / 0.52)',
500: 'hsl(var(--tertiary) / <alpha-value>)',
600: 'hsl(var(--tertiary) / <alpha-value>)',
700: 'hsl(var(--tertiary) / 0.9)',
900: 'hsl(var(--tertiary) / 0.28)'
},
pink: {
100: 'hsl(var(--tertiary) / 0.28)',
200: 'hsl(var(--tertiary) / 0.34)',
300: 'hsl(var(--tertiary) / 0.42)',
400: 'hsl(var(--tertiary) / 0.52)',
500: 'hsl(var(--tertiary) / <alpha-value>)',
600: 'hsl(var(--tertiary) / <alpha-value>)',
700: 'hsl(var(--tertiary) / 0.9)',
900: 'hsl(var(--tertiary) / 0.28)'
},
emerald: {
100: 'hsl(var(--success) / 0.28)',
200: 'hsl(var(--success) / 0.34)',
300: 'hsl(var(--success) / 0.42)',
400: 'hsl(var(--success) / 0.52)',
500: 'hsl(var(--success) / <alpha-value>)',
600: 'hsl(var(--success) / <alpha-value>)',
700: 'hsl(var(--success) / 0.9)',
900: 'hsl(var(--success) / 0.28)'
},
green: {
100: 'hsl(var(--success) / 0.28)',
200: 'hsl(var(--success) / 0.34)',
300: 'hsl(var(--success) / 0.42)',
400: 'hsl(var(--success) / 0.52)',
500: 'hsl(var(--success) / <alpha-value>)',
600: 'hsl(var(--success) / <alpha-value>)',
700: 'hsl(var(--success) / 0.9)',
900: 'hsl(var(--success) / 0.28)'
},
rose: {
50: 'hsl(var(--destructive) / 0.08)',
100: 'hsl(var(--destructive) / 0.14)',
200: 'hsl(var(--destructive) / 0.24)',
300: 'hsl(var(--destructive) / 0.34)',
400: 'hsl(var(--destructive) / 0.48)',
500: 'hsl(var(--destructive) / <alpha-value>)',
600: 'hsl(var(--destructive) / <alpha-value>)',
700: 'hsl(var(--destructive) / 0.9)',
900: 'hsl(var(--destructive) / 0.28)'
},
red: {
50: 'hsl(var(--destructive) / 0.08)',
100: 'hsl(var(--destructive) / 0.14)',
200: 'hsl(var(--destructive) / 0.24)',
300: 'hsl(var(--destructive) / 0.34)',
400: 'hsl(var(--destructive) / 0.48)',
500: 'hsl(var(--destructive) / <alpha-value>)',
600: 'hsl(var(--destructive) / <alpha-value>)',
700: 'hsl(var(--destructive) / 0.9)',
900: 'hsl(var(--destructive) / 0.28)'
},
amber: {
100: 'hsl(var(--warning) / 0.22)',
200: 'hsl(var(--warning) / 0.32)',
300: 'hsl(var(--warning) / 0.42)',
400: 'hsl(var(--warning) / 0.52)',
500: 'hsl(var(--warning) / <alpha-value>)',
600: 'hsl(var(--warning) / <alpha-value>)',
700: 'hsl(var(--warning) / 0.9)',
900: 'hsl(var(--warning) / 0.3)'
},
orange: {
100: 'hsl(var(--warning) / 0.22)',
200: 'hsl(var(--warning) / 0.32)',
300: 'hsl(var(--warning) / 0.42)',
400: 'hsl(var(--warning) / 0.52)',
500: 'hsl(var(--warning) / <alpha-value>)',
600: 'hsl(var(--warning) / <alpha-value>)',
700: 'hsl(var(--warning) / 0.9)',
900: 'hsl(var(--warning) / 0.3)'
},
yellow: {
100: 'hsl(var(--warning) / 0.22)',
200: 'hsl(var(--warning) / 0.32)',
300: 'hsl(var(--warning) / 0.42)',
400: 'hsl(var(--warning) / 0.52)',
500: 'hsl(var(--warning) / <alpha-value>)',
600: 'hsl(var(--warning) / <alpha-value>)',
700: 'hsl(var(--warning) / 0.9)',
900: 'hsl(var(--warning) / 0.3)'
},
background: 'hsl(var(--background))',
foreground: 'hsl(var(--foreground))',
card: {
DEFAULT: 'hsl(var(--card))',
foreground: 'hsl(var(--card-foreground))'
},
popover: {
DEFAULT: 'hsl(var(--popover))',
foreground: 'hsl(var(--popover-foreground))'
},
primary: {
DEFAULT: 'hsl(var(--primary))',
foreground: 'hsl(var(--primary-foreground))',
container: 'hsl(var(--primary-container))'
},
secondary: {
DEFAULT: 'hsl(var(--secondary))',
foreground: 'hsl(var(--secondary-foreground))',
container: 'hsl(var(--secondary-container))'
},
muted: {
DEFAULT: 'hsl(var(--muted))',
foreground: 'hsl(var(--muted-foreground))'
},
accent: {
DEFAULT: 'hsl(var(--accent))',
foreground: 'hsl(var(--accent-foreground))'
},
tertiary: {
DEFAULT: 'hsl(var(--tertiary))',
foreground: 'hsl(var(--tertiary-foreground))',
container: 'hsl(var(--tertiary-container))'
},
success: {
DEFAULT: 'hsl(var(--success))',
foreground: 'hsl(var(--success-foreground))'
},
warning: {
DEFAULT: 'hsl(var(--warning))',
foreground: 'hsl(var(--warning-foreground))'
},
info: {
DEFAULT: 'hsl(var(--info))',
foreground: 'hsl(var(--info-foreground))'
},
destructive: {
DEFAULT: 'hsl(var(--destructive))',
foreground: 'hsl(var(--destructive-foreground))'
},
'on-primary-container': 'hsl(var(--on-primary-container))',
'on-secondary-container': 'hsl(var(--on-secondary-container))',
'on-tertiary-container': 'hsl(var(--on-tertiary-container))',
'on-error-container': 'hsl(var(--on-error-container))',
'error-container': 'hsl(var(--error-container))',
'surface-dim': 'hsl(var(--surface-dim))',
'surface-bright': 'hsl(var(--surface-bright))',
'surface-container-lowest': 'hsl(var(--surface-container-lowest))',
'surface-container-low': 'hsl(var(--surface-container-low))',
'surface-container': 'hsl(var(--surface-container))',
'surface-container-high': 'hsl(var(--surface-container-high))',
'surface-container-highest': 'hsl(var(--surface-container-highest))',
'outline-m3': 'hsl(var(--outline))',
'outline-variant': 'hsl(var(--outline-variant))',
'inverse-surface': 'hsl(var(--inverse-surface))',
'inverse-on-surface': 'hsl(var(--inverse-on-surface))',
'inverse-primary': 'hsl(var(--inverse-primary))',
border: 'hsl(var(--border))',
input: 'hsl(var(--input))',
ring: 'hsl(var(--ring))',
chart: {
'1': 'hsl(var(--chart-1))',
'2': 'hsl(var(--chart-2))',
'3': 'hsl(var(--chart-3))',
'4': 'hsl(var(--chart-4))',
'5': 'hsl(var(--chart-5))'
}
}
}
},
plugins: [require("tailwindcss-animate")],
}
