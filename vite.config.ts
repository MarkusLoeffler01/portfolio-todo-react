import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { execSync } from 'child_process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(process.env.BUILD_TIMESTAMP || Math.floor(Date.now() / 1000)), // Fallback: Aktuelle Unix-Zeit
    __BUILD_ID__: JSON.stringify(process.env.BUILD_ID || execSync('git rev-parse --short HEAD').toString().trim()), // Fallback: Aktueller Git-Commit
  },
  build: {
    rollupOptions: {
      treeshake: true,
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          dateFns: ['date-fns'],
          formik: ['formik', 'yup'],
          reactToastify: ['react-toastify'],
          muiX: ['@mui/x-license', '@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
        }
      }
    }
  },
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
