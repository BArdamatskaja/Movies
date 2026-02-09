export function Alert({ type = "info", children }) {
  const cls =
    type === "error"
      ? "border-red-300 bg-red-50 text-red-800"
      : type === "success"
      ? "border-green-300 bg-green-50 text-green-800"
      : "border-slate-300 bg-slate-50 text-slate-800";

  return <div className={`border rounded-xl p-3 text-sm ${cls}`}>{children}</div>;
}
