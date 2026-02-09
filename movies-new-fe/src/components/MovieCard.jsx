import { useEffect, useMemo, useState } from "react";

export function MovieCard({
  movie,
  cats = [],
  mode = "catalog",

  isAuthed = false,
  onUpdate,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => ({
    title: movie.title ?? "",
    description: movie.description ?? "",
    categoryId: movie.categoryId ?? null,
    IMBD: movie.IMBD ?? 0.0,
    cover: movie.cover ?? "",
  }));

  useEffect(() => {
    if (!editing) {
      setDraft({
        title: movie.title ?? "",
        description: movie.description ?? "",
        categoryId: movie.categoryId ?? null,
        IMBD: movie.IMBD ?? 0.0,
        cover: movie.cover ?? "",
      });
    }
  }, [
    movie.id,
    movie.title,
    movie.description,
    movie.categoryId,
    movie.IMBD,
    movie.cover,
  ]);

  const categoryLabel = useMemo(() => {
    return (
      movie.categoryName ??
      cats.find((c) => c.id === movie.categoryId)?.name ??
      "—"
    );
  }, [movie.categoryName, movie.categoryId, cats]);

  async function save() {
    if (!onUpdate) return;

    const payload = {
      title: draft.title,
      description: draft.description,
      categoryId: draft.categoryId ? Number(draft.categoryId) : null,
      IMBD: Number(draft.IMBD ?? 0.0),
      cover: draft.cover,
    };

    await onUpdate(movie.id, payload);
    setEditing(false);
  }

  function cancel() {
    setDraft({
      title: movie.title ?? "",
      description: movie.description ?? "",
      categoryId: movie.categoryId ?? null,
      IMBD: movie.IMBD ?? 0.0,
      cover: movie.cover ?? "",
    });
    setEditing(false);
  }

  return (
    <div className="rounded-2xl border bg-white p-4 space-y-3">
      {movie.cover ? (
        <img
          src={movie.cover}
          alt={`${movie.title} cover`}
          className="rounded-2xl border w-full h-40 object-cover"
        />
      ) : (
        <div className="rounded-2xl border bg-slate-50 h-40 flex items-center justify-center text-slate-400 text-xs">
          No cover
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {!editing ? (
            <>
              <div className="font-semibold truncate">{movie.title}</div>
              <div className="text-sm text-slate-600 truncate">
                {movie.description}
              </div>
              <div className="text-sm text-slate-600 truncate">
                {movie.IMBD}
              </div>
            </>
          ) : (
            <div className="grid gap-2">
              <input
                className="rounded-xl border px-3 py-2"
                value={draft.title}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Title"
              />
              <input
                className="rounded-xl border px-3 py-2"
                value={draft.description}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Description"
              />
              <input
                className="rounded-xl border px-3 py-2"
                value={draft.cover ?? ""}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, cover: e.target.value }))
                }
                placeholder="Cover image URL"
              />
            </div>
          )}
        </div>

        {mode === "admin" && (
          <div className="shrink-0 flex gap-2">
            {!editing ? (
              <button
                className="px-3 py-2 rounded-xl border"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
                  onClick={save}
                  disabled={!draft.title?.trim() || !draft.description?.trim()}
                  title={
                    !draft.title?.trim() || !draft.description?.trim()
                      ? "Fill title & description"
                      : ""
                  }
                >
                  Save
                </button>
                <button
                  className="px-3 py-2 rounded-xl border"
                  onClick={cancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {!editing ? (
        <div className="text-xs text-slate-500">
          Category: {categoryLabel} • IMBD rating: {movie.IMBD}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-2">
          <select
            className="rounded-xl border px-3 py-2"
            value={draft.categoryId ?? ""}
            onChange={(e) =>
              setDraft((p) => ({
                ...p,
                categoryId: e.target.value ? Number(e.target.value) : null,
              }))
            }
          >
            <option value="">No category</option>
            {cats.map((c) => (
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
            value={draft.IMBD}
            onChange={(e) => setDraft((p) => ({ ...p, IMBD: e.target.value }))}
            placeholder="IMBD rating"
          />
        </div>
      )}
      {/* 
      {mode === "catalog" && (
        <div>
          <button
            className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
            onClick={() =>
              alert(
                "Atsiliepimai yra žemiau — spausk kortelėje „Atsiliepimai“.",
              )
            }
          >
            Info
          </button>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900">
              Atsiliepimai
            </summary>
            <Reviews movieId={movie.id} />
          </details>

          {!isAuthed && (
            <div className="text-xs text-slate-500 mt-2">
              Login required to order.
            </div>
          )}
        </div>
      )} */}

      {mode === "admin" && (
        <div>
          <button
            className="px-3 py-2 rounded-xl bg-red-600 text-white"
            onClick={() => onDelete?.(movie.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
