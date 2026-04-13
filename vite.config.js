import { defineConfig } from "vite"
import laravel from "laravel-vite-plugin"
import inertia from "@inertiajs/vite"
import react from "@vitejs/plugin-react"
import { wayfinder } from '@laravel/vite-plugin-wayfinder';

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.js"],
            refresh: true,
        }),
        inertia(),
        react({
            babel: {
                plugins: ["babel-plugin-react-compiler"]
            }
        }),
        wayfinder({
            formVariants: true
        })
    ],
});
