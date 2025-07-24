import uni from "@dcloudio/vite-plugin-uni";
import { defineConfig } from "vite";
import uniPolyfill from "vite-plugin-uni-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), uniPolyfill()],
});
