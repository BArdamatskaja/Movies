import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { setToken } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      const token = res?.token;
      if (!token) throw new Error("No token in response");
      setToken(token);
      nav("/");
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 rounded-2xl border p-5 bg-white"
      >
        {err && <Alert type="error">{err}</Alert>}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
