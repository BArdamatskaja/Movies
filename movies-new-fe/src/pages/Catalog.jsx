import { useEffect, useState } from "react";
import { api } from "../api";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { MovieCard } from "../components/MovieCard";

export function Catalog() {
  const { isAuthed } = useAuth();
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [movies, setMovies] = useState([]);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

useEffect(() => {
  api.categories
    .list()
    .then((data) => {
      const list = Array.isArray(data) ? data : (data?.content ?? []);
      setCats(list);
    })
    .catch(() => setCats([]));
}, []);


  async function load() {
    setErr("");
    setInfo("");
    try {
      const data = await api.movies.list({ q, categoryId });
      setMovies(data);
    } catch (e) {
      setErr(e.message || "Failed");
    }
  }

  useEffect(() => {
    load();
  }, [categoryId]);


  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Catalog</h1>

      <div className="rounded-2xl border p-4 bg-white space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="Search by title/author..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded-xl border px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All categories</option>
            {cats.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={load}
          >
            Search
          </Button>
        </div>

        {err && <Alert type="error">{err}</Alert>}
        {info && <Alert type="success">{info}</Alert>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            mode="catalog"
            movie={m}
            cats={cats}
            isAuthed={isAuthed}
          />
        ))}
      </div>
    </div>
  );
}
