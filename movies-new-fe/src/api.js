const API_BASE = import.meta.env.VITE_API_BASE;

export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(token) {
  if (!token) localStorage.removeItem("token");
  else localStorage.setItem("token", token);
}
export function decodeJwt(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
export function normalizeRole(role) {
  if (!role) return null;
  const r = String(role);
  return r.startsWith("ROLE_") ? r.slice(5) : r;
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  auth: {
    register: (payload) =>
      request("/api/auth/register", {
        method: "POST",
        body: payload,
        auth: false,
      }),
    login: (payload) =>
      request("/api/auth/login", {
        method: "POST",
        body: payload,
        auth: false,
      }),
    me: () => request("/api/me"),
  },
  categories: {
    list: async () => {
      const data = await request("/api/categories", { auth: false });
      return Array.isArray(data) ? data : (data?.content ?? []);
    },
  },

  movies: {
    list: async ({ q = "", categoryId = "" } = {}) => {
      const data = await request(
        `/api/movies?q=${encodeURIComponent(q)}&categoryId=${encodeURIComponent(categoryId)}`,
        { auth: false },
      );
      return Array.isArray(data) ? data : (data?.content ?? []);
    },
  },

  admin: {
    addMovie: (payload) =>
      request("/api/admin/movies", { method: "POST", body: payload }),
    updateMovie: (id, payload) =>
      request(`/api/admin/movies/${id}`, { method: "PUT", body: payload }),
    deleteMovie: (id) =>
      request(`/api/admin/movies/${id}`, { method: "DELETE" }),
    listCategories: () => request("/api/admin/categories"),
    addCategory: (payload) =>
      request("/api/admin/categories", { method: "POST", body: payload }),
    updateCategory: (id, payload) =>
      request(`/api/admin/categories/${id}`, { method: "PUT", body: payload }),
    deleteCategory: (id) =>
      request(`/api/admin/categories/${id}`, { method: "DELETE" }),
  },
};
