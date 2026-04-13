import { defineConfig } from "vite"
import laravel from "laravel-vite-plugin"
import inertia from "@inertiajs/vite"

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.js"],
            refresh: true,
        }),
        inertia(),
    ],
});
