/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./hooks/**/*.{js,jsx,ts,tsx}',
		'./src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
}
