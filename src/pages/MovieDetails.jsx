import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/movies/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch movie");
        }

        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!movie) return <div className="p-6">No movie found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <p className="mb-2"><b>Year:</b> {movie.year}</p>
      <p className="mb-2"><b>Runtime:</b> {movie.runtime}</p>
      <p className="mb-2"><b>Plot:</b> {movie.plot}</p>
      <p className="mb-2"><b>Genres:</b> {movie.genres?.join(", ")}</p>
    </div>
  );
}