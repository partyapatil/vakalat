import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Film,
  CalendarDays,
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  Clock3,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const DEFAULT_LIMIT = 10;

const badgeBase =
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset";

function formatDate(value) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

function formatNumber(value) {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat().format(value);
}

function normalizeResponse(data) {
  // Supports both: [movies] and { movies, totalMovies, totalPages, page, limit }
  if (Array.isArray(data)) {
    return {
      movies: data,
      totalMovies: data.length,
      totalPages: 1,
      page: 1,
      limit: data.length || DEFAULT_LIMIT,
    };
  }

  return {
    movies: data?.movies || data?.data || [],
    totalMovies: data?.totalMovies ?? data?.total ?? data?.count ?? 0,
    totalPages: data?.totalPages ?? 1,
    page: data?.page ?? 1,
    limit: data?.limit ?? DEFAULT_LIMIT,
  };
}

function StatCard({ icon: Icon, label, value, hint, accent = "from-slate-900 to-slate-700" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
          {hint ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p> : null}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <Film size={24} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

export default function MovieDashboardPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadMovies = async ({ signal } = {}) => {
    try {
      setError("");
      if (movies.length === 0) setLoading(true);
      else setRefreshing(true);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search.trim()) params.set("search", search.trim());
      if (year.trim()) params.set("year", year.trim());
      if (genre.trim()) params.set("genre", genre.trim());
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`${API_BASE}/api/movies?${params.toString()}`, { signal });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      const normalized = normalizeResponse(data);

      setMovies(normalized.movies);
      setTotalMovies(normalized.totalMovies);
      setTotalPages(Math.max(1, normalized.totalPages || 1));
      setPage(normalized.page || page);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load movies");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadMovies({ signal: controller.signal });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy]);

  const onApplyFilters = async (e) => {
    e.preventDefault();
    setPage(1);
    const controller = new AbortController();
    await loadMovies({ signal: controller.signal });
  };

  const onReset = async () => {
    setSearch("");
    setYear("");
    setGenre("");
    setSortBy("newest");
    setPage(1);
    const controller = new AbortController();
    await loadMovies({ signal: controller.signal });
  };

  const stats = useMemo(() => {
    const latestMovie = movies[0];
    const avgYear = movies.length
      ? Math.round(
          movies.reduce((sum, m) => sum + (Number(m.year) || 0), 0) / movies.length
        )
      : 0;
    const totalCommentsOnPage = movies.reduce(
      (sum, m) => sum + (Number(m.commentCount ?? m.num_mflix_comments ?? 0) || 0),
      0
    );

    return [
      {
        label: "Total Movies",
        value: formatNumber(totalMovies || movies.length),
        hint: "Across the current query result",
        icon: Film,
        accent: "from-indigo-500 to-violet-500",
      },
      {
        label: "Movies on Page",
        value: formatNumber(movies.length),
        hint: `Page ${page} of ${totalPages}`,
        icon: Activity,
        accent: "from-emerald-500 to-teal-500",
      },
      {
        label: "Avg Year",
        value: avgYear || "—",
        hint: "Based on the current page",
        icon: CalendarDays,
        accent: "from-amber-500 to-orange-500",
      },
      {
        label: "Comments on Page",
        value: formatNumber(totalCommentsOnPage),
        hint: latestMovie?.latestTwoComments?.length
          ? "Includes comment-rich movies"
          : "Uses commentCount if available",
        icon: MessageSquareText,
        accent: "from-fuchsia-500 to-pink-500",
      },
      {
        label: "Featured Year",
        value: latestMovie?.year || "—",
        hint: latestMovie?.title ? latestMovie.title : "First movie on page",
        icon: Sparkles,
        accent: "from-slate-500 to-slate-700",
      },
    ];
  }, [movies, page, totalMovies, totalPages]);

  const hasData = movies.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 shadow-xl dark:border-slate-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                <ArrowUpRight size={14} />
                Movie Explorer Dashboard
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Manage, search, and inspect your movie collection.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                A clean dashboard for movie analytics, filtering, and quick access to details.
                Search by title, filter by year or genre, and move through pages without loading the full dataset.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[420px]">
              <StatCard
                icon={Film}
                label="Visible Movies"
                value={formatNumber(movies.length)}
                hint="Current page result"
                accent="from-cyan-400 to-blue-500"
              />
              <StatCard
                icon={Star}
                label="Total Movies"
                value={formatNumber(totalMovies || movies.length)}
                hint="Matching your filters"
                accent="from-violet-400 to-fuchsia-500"
              />
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              accent={stat.accent}
            />
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={onApplyFilters} className="grid gap-3 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-4">
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Search title
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-600"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Year
              </label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 1999"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-600"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Genre
              </label>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Action"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-600"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-600"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>

            <div className="lg:col-span-2 flex gap-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <SlidersHorizontal size={16} />
                Apply
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Movies</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing page {page} of {totalPages}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              {refreshing ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Refreshing
                </span>
              ) : null}
            </div>
          </div>

          {loading ? (
            <div className="p-8">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <EmptyState title="Something went wrong" description={error} />
            </div>
          ) : !hasData ? (
            <div className="p-6">
              <EmptyState
                title="No movies found"
                description="Try changing the search term, year, or genre filter."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-950/60">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Title
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Year
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Runtime
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Genres
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Comments
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Release
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {movies.map((movie) => {
                    const genres = Array.isArray(movie.genres) ? movie.genres : [];
                    const topGenres = genres.slice(0, 3);
                    const commentCount = movie.commentCount ?? movie.num_mflix_comments ?? 0;

                    return (
                      <tr key={movie._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60">
                        <td className="px-5 py-4 align-top">
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm">
                              <Film size={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-950 dark:text-white">
                                {movie.title || "Untitled Movie"}
                              </p>
                              <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                {movie.plot || movie.fullplot || "No description available."}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top text-sm text-slate-700 dark:text-slate-300">
                          <span className={`${badgeBase} border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200`}>
                            {movie.year || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4 align-top text-sm text-slate-700 dark:text-slate-300">
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950">
                            <Clock3 size={14} />
                            {movie.runtime ? `${movie.runtime} min` : "—"}
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            {topGenres.length > 0 ? (
                              topGenres.map((g) => (
                                <span
                                  key={g}
                                  className={`${badgeBase} border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200`}
                                >
                                  {g}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-slate-400">—</span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top text-sm text-slate-700 dark:text-slate-300">
                          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                            <MessageSquareText size={14} />
                            {formatNumber(commentCount)}
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top text-sm text-slate-600 dark:text-slate-400">
                          {formatDate(movie.released)}
                        </td>

                        <td className="px-5 py-4 align-top text-right">
                          <Link
                            to={`/movies/${movie._id}`}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                          >
                            Details
                            <ChevronRight size={16} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1 || loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= totalPages || loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}