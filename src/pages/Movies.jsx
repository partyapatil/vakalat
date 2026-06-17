import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";
const LIMIT = 6; // Set items per page

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(""); // Clear previous errors

        // Pass pagination variables as query parameters
        const res = await fetch(`${API_BASE}/api/movies?page=${currentPage}&limit=${LIMIT}`);

        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await res.json();

        // Destructure the clean payload from your upgraded backend controller
        setMovies(data.movies || []);
        setTotalPages(data.totalPages || 1);
        setTotalMovies(data.totalMovies || 0);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]); // Dependency array captures currentPage changes to auto-refetch!

  // Helper function to render page numbers dynamically
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            currentPage === i
              ? "bg-black text-white shadow-md scale-105"
              : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-medium text-gray-600">Loading your library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-500 text-xl font-semibold">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Summary Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Movies</h1>
            <p className="text-sm text-gray-500 mt-1">
              Showing {movies.length} of {totalMovies} total records
            </p>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm text-gray-500">
            No movies found.
          </div>
        ) : (
          <>
            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {movie.title || "Untitled Movie"}
                    </h2>

                    <div className="space-y-2 mb-4">
                      {movie.year !== undefined && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-24 text-gray-400 font-medium">Release Year</span>
                          <span className="font-semibold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">
                            {movie.year}
                          </span>
                        </p>
                      )}

                      {movie.commentCount !== undefined && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-24 text-gray-400 font-medium">Comments</span>
                          <span className="font-semibold text-gray-900 flex items-center gap-1">
                            💬 {movie.commentCount}
                          </span>
                        </p>
                      )}
                    </div>

                    {movie.genres?.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-1.5">
                          {movie.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/movies/${movie._id}`}
                    className="block text-center bg-black text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 active:scale-98 transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {/* --- NEW PAGINATION CONTROL BAR --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-500">
                Page <span className="text-gray-900 font-bold">{currentPage}</span> of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                >
                  Previous
                </button>

                {/* Numbered Page List */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {renderPageNumbers()}
                </div>

                {/* Next Button */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}