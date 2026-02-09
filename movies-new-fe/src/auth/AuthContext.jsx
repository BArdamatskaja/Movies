import React, { createContext, useContext, useMemo, useState } from "react";
import { decodeJwt, normalizeRole, getToken, setToken as persistToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const payload = useMemo(() => decodeJwt(token), [token]);
  const role = useMemo(() => normalizeRole(payload?.role), [payload]);

  const setToken = (t) => {
    persistToken(t);
    setTokenState(t || null);
  };

  const logout = () => setToken(null);

  const value = useMemo(
    () => ({ token, isAuthed: Boolean(token), payload, role, setToken, logout }),
    [token, payload, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
