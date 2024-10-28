import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "./vendor/robsontenorio/mary/src/View/Components/**/*.php",
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    ],
    daisyui: {
        themes: ["light", "dark", "nord"],
    },
    theme: {
        extend: {},
    },
    plugins: [
        daisyui,
    ],
}

