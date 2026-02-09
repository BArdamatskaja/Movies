import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Catalog } from "./pages/Catalog";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Admin } from "./pages/Admin";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<Catalog />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
