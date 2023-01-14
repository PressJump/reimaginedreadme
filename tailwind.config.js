/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
	content: ['./pages/**/*.{ts,tsx}', './public/**/*.html'],
	plugins: [],
	theme: {
		hairline: 100,
		'extra-light': 100,
		thin: 200,
		light: 300,
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		'extra-bold': 800,
	},
	darkMode: 'class',
}
