import { useEffect, useState } from "react";
import { api } from "../api";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { MovieCard } from "../components/MovieCard";
export function Admin() {
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState("");

  const [movies, setMovies] = useState([]);

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    IMBD: 0,
    cover: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function loadCategories() {
    const data = await api.admin.listCategories();
    setCategories(data);
  }

  async function loadMovies() {
    const data = await api.movies.list({ q, categoryId });
    setMovies(data);
  }

  async function refreshAll() {
    setErr("");
    setMsg("");
    try {
      await Promise.all([loadCategories(), loadMovies()]);
    } catch (e) {
      setErr(e.message || "Failed");
    }
  }

  useEffect(() => {
    refreshAll().catch(() => {});
  }, []);

  useEffect(() => {
    loadMovies().catch(() => {});
  }, [categoryId]);

  async function addCategory() {
    setErr("");
    setMsg("");
    try {
      await api.admin.addCategory({ name: newCatName });
      setNewCatName("");
      setMsg("Category added ✅");
      await loadCategories();
    } catch (e) {
      setErr(e.message || "Failed to add category");
    }
  }

  async function updateCategory(id, name) {
    setErr("");
    setMsg("");
    try {
      await api.admin.updateCategory(id, { id, name });
      setMsg("Category updated ✅");
      await loadCategories();
    } catch (e) {
      setErr(e.message || "Failed to update category");
      throw e;
    }
  }

  async function deleteCategory(id) {
    setErr("");
    setMsg("");
    try {
      await api.admin.deleteCategory(id);
      setMsg("Category deleted ✅");
      await loadCategories();
    } catch (e) {
      setErr(e.message || "Failed to delete category");
    }
  }

  async function addMovie() {
    setMsg("");
    setErr("");
    try {
      await api.admin.addMovie({
        title: form.title,
        description: form.description,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        IMBD: Number(form.IMBD ?? 0),
        cover: form.cover?.trim() ? form.cover.trim() : null,
      });

      setMsg("Movie added ✅");
      setForm({
        title: "",
        description: "",
        categoryId: "",
        IMBD: 0,
        cover: "",
      });

      await loadMovies();
    } catch (e) {
      setErr(e.message || "Failed to add movie");
    }
  }

  async function updateMovie(id, payload) {
    setMsg("");
    setErr("");
    try {
      await api.admin.updateMovie(id, payload);
      setMsg("Updated ✅");
      await loadMovies();
    } catch (e) {
      setErr(e.message || "Update failed");
      throw e;
    }
  }

  async function deleteMovie(id) {
    setMsg("");
    setErr("");
    try {
      await api.admin.deleteMovie(id);
      setMsg("Deleted ✅");
      await loadMovies();
    } catch (e) {
      setErr(e.message || "Delete failed");
    }
  }

  function CategoryRow({ c }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(c.name ?? "");

    useEffect(() => {
      if (!editing) setName(c.name ?? "");
    }, [c.name, editing]);

    async function save() {
      await updateCategory(c.id, name.trim());
      setEditing(false);
    }

    return (
      <div className="rounded-2xl border bg-white p-3 flex items-center justify-between gap-3">
        {!editing ? (
          <>
            <div className="font-semibold truncate">{c.name}</div>
            <div className="flex gap-2 shrink-0">
              <button
                className="px-3 py-2 rounded-xl border"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="px-3 py-2 rounded-xl bg-red-600 text-white"
                onClick={() => deleteCategory(c.id)}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              className="rounded-xl border px-3 py-2 flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
            <div className="flex gap-2 shrink-0">
              <button
                className="px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
                disabled={!name.trim()}
                onClick={save}
              >
                Save
              </button>
              <button
                className="px-3 py-2 rounded-xl border"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Admin</h1>

      {(err || msg) && (
        <div className="space-y-2">
          {err && <Alert type="error">{err}</Alert>}
          {msg && <Alert type="success">{msg}</Alert>}
        </div>
      )}

      <div className="rounded-2xl border p-4 bg-white space-y-3">
        <div className="font-semibold">Categories</div>

        <div className="flex gap-2">
          <input
            className="rounded-xl border px-3 py-2 flex-1"
            placeholder="New category name..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button
            className="px-3 py-2 rounded-xl bg-sky-600 text-white disabled:opacity-50"
            disabled={!newCatName.trim()}
            onClick={addCategory}
          >
            Add
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {categories.map((c) => (
            <CategoryRow
              key={c.id}
              c={c}
            />
          ))}
          {categories.length === 0 && (
            <div className="text-sm text-slate-600">No categories.</div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border p-4 bg-white space-y-3">
        <div className="font-semibold">Movies</div>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="Search by title"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded-xl border px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
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
            onClick={loadMovies}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border p-4 bg-white space-y-3">
        <div className="font-semibold">Add new movie</div>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="rounded-xl border px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title"
          />
          <input
            className="rounded-xl border px-3 py-2"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Description"
          />

          <select
            className="rounded-xl border px-3 py-2"
            value={form.categoryId}
            onChange={(e) =>
              setForm((p) => ({ ...p, categoryId: e.target.value }))
            }
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>

          <input
            className="rounded-xl border px-3 py-2"
            type="number"
            min="0"
            value={form.IMBD}
            onChange={(e) => setForm((p) => ({ ...p, IMBD: e.target.value }))}
            placeholder="IMBD rating"
          />

          <input
            className="rounded-xl border px-3 py-2 md:col-span-2"
            value={form.cover}
            onChange={(e) => setForm((p) => ({ ...p, cover: e.target.value }))}
            placeholder="Cover image URL"
          />
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-xl bg-sky-600 text-white disabled:opacity-50"
            onClick={addMovie}
            disabled={!form.title.trim() || !form.description.trim()}
            title={
              !form.title.trim() || !form.description.trim()
                ? "Fill title & description"
                : ""
            }
          >
            Add
          </button>
          <button
            className="px-3 py-2 rounded-xl border"
            onClick={() =>
              setForm({
                title: "",
                description: "",
                categoryId: "",
                IMBD: 0,
                cover: "",
              })
            }
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            mode="admin"
            movie={m}
            cats={categories}
            onUpdate={updateMovie}
            onDelete={deleteMovie}
          />
        ))}
        {movies.length === 0 && (
          <div className="text-sm text-slate-600">No movies.</div>
        )}
      </div>
    </div>
  );
}
