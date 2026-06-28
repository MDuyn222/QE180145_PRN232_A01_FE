"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearUser, getUser, UserInfo } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setUser(getUser());
    const onStorage = () => setUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = () => {
    clearUser();
    setUser(null);
    router.push("/");
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">SimpleShop</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/search" className="hover:text-blue-600">Search</Link>
          {user ? (
            <>
              {user.role === "User" && (
                <>
                  <Link href="/cart" className="hover:text-blue-600">🛒 Cart</Link>
                  <Link href="/orders" className="hover:text-blue-600">Orders</Link>
                </>
              )}
              {user.role === "Admin" && (
                <Link href="/admin" className="hover:text-blue-600">Admin</Link>
              )}
              <span className="text-gray-600">Hi, {user.fullName || user.email}</span>
              <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
