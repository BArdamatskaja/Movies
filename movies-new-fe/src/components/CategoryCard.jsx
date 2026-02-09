import { useState } from "react";

export function CategoryCard({ category, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name ?? "");

  async function save() {
    await onUpdate?.(category.id, { id: category.id, name: name.trim() });
    setEditing(false);
  }

  function cancel() {
    setName(category.name ?? "");
    setEditing(false);
  }

  return (
    <div className="rounded-2xl border bg-white p-4 space-y-3">
      {!editing ? (
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold truncate">{category.name}</div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="px-3 py-2 rounded-xl bg-red-600 text-white" onClick={() => onDelete?.(category.id)}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            className="rounded-xl border px-3 py-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
              disabled={!name.trim()}
              onClick={save}
            >
              Save
            </button>
            <button className="px-3 py-2 rounded-xl border" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
