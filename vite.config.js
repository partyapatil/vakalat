import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 1. Import the visualizer at the top

export default defineConfig({
  plugins: [
    react(), 
   
  ],
})

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes("node_modules")) {
//             return "vendor";
//           }
//         }
//       }
//     }
//   }
// });