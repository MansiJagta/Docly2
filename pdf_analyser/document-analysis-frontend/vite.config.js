// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   clearScreen: false,
//   server: {
//     port: 1420,
//     strictPort: true,
//   },
//   envPrefix: ['VITE_', 'TAURI_'],
//   build: {
//     target: ['es2021', 'chrome100', 'safari13'],
//     minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
//     sourcemap: !!process.env.TAURI_DEBUG,
//   },
// });











// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite'; // 1. Added this import

// export default defineConfig({
//   plugins: [
//     react(), 
//     tailwindcss() // 2. Added this to the plugins array
//   ],
//   clearScreen: false,
//   server: {
//     port: 1420,
//     strictPort: true,
//   },
//   envPrefix: ['VITE_', 'TAURI_'],
//   build: {
//     target: ['es2021', 'chrome100', 'safari13'],
//     // Use the debug flag to determine minification
//     minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
//     sourcemap: !!process.env.TAURI_DEBUG,
//   },
// });








import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})