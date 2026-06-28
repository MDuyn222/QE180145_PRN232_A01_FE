"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { api, setUser } from "@/lib/api";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", form);
      const data = res.data;
      if (data.role !== "Admin") {
        toast.error("Access denied. Admin credentials required.");
        return;
      }
      setUser({ token: data.token, role: data.role, email: data.email, fullName: data.fullName });
      window.dispatchEvent(new Event("storage"));
      toast.success("Welcome, Admin!");
      router.push("/admin");
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
            <ShieldCheck size={24} />
          </div>
          <p className="eyebrow">Admin area</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Admin login
          </h1>
          <p className="muted mt-2">
            Regular user?{" "}
            <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
              Login here
            </Link>
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
          <ShieldCheck size={18} />
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      </div>
    </div>
  );
}
