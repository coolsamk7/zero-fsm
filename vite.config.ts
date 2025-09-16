import { defineConfig } from "vite";
import path from "path"

export default defineConfig({
    resolve: {
        alias: {
            "@utils": path.resolve(__dirname, "src/utils/*"),
            "@core": path.resolve(__dirname, "src/core/*"),
            "@interfaces": path.resolve(__dirname, "src/interfaces/*")
        }
    }
})