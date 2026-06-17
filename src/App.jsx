import { Routes, Route, Link } from "react-router-dom";// import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Home from "./pages/Home";
import React, { Suspense } from "react";
import VakalatnamaEditor from "./pages/V";

// import Movies from "./pages/Movies";
// import MovieDetails from "./pages/MovieDetails";
// import NotFound from "./pages/NotFound";
const Testing=React.lazy(() => import("./pages/Testing"));
export default function App() {
  return (
    <div>
      <Suspense fallback="Loading...">

     
      <nav style={{ display: "flex", gap: "16px", padding: "16px", backgroundColor: "#f0f0f0" }}>
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/test">Testing</Link>
      </nav>

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/movies" element={<Movies />} />
        <Route path="/test" element={<Testing />} />
        <Route path="/vakalt" element={<VakalatnamaEditor />} />

        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        {/* <Route path="/movies/:id" element={<MovieDetails />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
       </Suspense>
    </div>
  );
}