import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// 1. Import the visualizer at the top
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // 2. Add it here to the plugins array
    visualizer({
      open: true, // This will automatically open the stats chart in your browser when the build finishes
    })
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