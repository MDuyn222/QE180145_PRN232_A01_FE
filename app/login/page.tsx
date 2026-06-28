"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className="mx-auto max-w-md mt-16">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" required value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" required value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link></p>
    </div>
  );
}
