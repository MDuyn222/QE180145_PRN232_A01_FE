"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";
import { api, setUser } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", form);
      const data = res.data;
      setUser({ token: data.token, role: data.role, email: data.email, fullName: data.fullName, accountId: data.accountId });
      window.dispatchEvent(new Event("storage"));
      toast.success(`Welcome back, ${data.fullName || data.email}!`);
      router.push(data.role === "Admin" ? "/admin" : "/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md">
      <div className="card">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
            <Sparkles size={24} />
          </div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Login</h1>
          <p className="muted mt-2">
            Sign in to manage your cart and view your orders.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <LogIn size={18} />
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-teal-700 hover:text-teal-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
