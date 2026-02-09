export function Input({ label, ...props }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <input
        className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
        {...props}
      />
    </label>
  );
}
