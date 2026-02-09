import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Nav() {
  const { isAuthed, role, logout } = useAuth();

  const cls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`;

  return (
    <div className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="font-semibold text-slate-900"
        >
          📚 Library
        </Link>

        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className={cls}
          >
            Catalog
          </NavLink>

          {!isAuthed ? (
            <>
              <NavLink
                to="/login"
                className={cls}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={cls}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              {role === "ADMIN" && (
                <NavLink
                  to="/admin"
                  className={cls}
                >
                  Admin
                </NavLink>
              )}
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
