import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": path.resolve("./src/components"),
      "@cmain": path.resolve("./src/components/main"),
      "@clist": path.resolve("./src/components/list"),
      "@cexport": path.resolve("./src/components/export"),
      "@cdetail": path.resolve("./src/components/detail"),
      "@pages": path.resolve("./src/pages"),
      "@stores": path.resolve("./src/stores"),
      "@type": path.resolve("./src/types"),
      "@ts": path.resolve("./src/ts"),
      "@utils": path.resolve("./src/utils"),
      "@styles": path.resolve("./src/styles"),
    }
  }
})
