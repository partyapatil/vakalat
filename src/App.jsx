// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import VakalatnamaEditor from "./pages/V";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<VakalatnamaEditor />} />
      </Routes>
    </div>
  );
}