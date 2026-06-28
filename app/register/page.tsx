"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed.");
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
          <p className="eyebrow">Join SimpleShop</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Create account
          </h1>
          <p className="muted mt-2">
            Save your cart, checkout faster, and track every order.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

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
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            className="input"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <UserPlus size={18} />
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
