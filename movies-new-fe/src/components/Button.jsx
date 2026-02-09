export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
