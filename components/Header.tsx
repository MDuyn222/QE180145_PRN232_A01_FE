"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearUser, getUser, UserInfo } from "@/lib/api";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  PackageSearch,
  ShoppingBag,
  ShoppingCart,
  Store,
  X,
  UserPlus,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    const onStorage = () => setUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const logout = () => {
    clearUser();
    setUser(null);
    setOpen(false);
    router.push("/");
  };

  const navItems = [
    { href: "/search", label: "Search", icon: PackageSearch, show: true },
    { href: "/cart", label: "Cart", icon: ShoppingCart, show: user?.role === "User" },
    { href: "/orders", label: "Orders", icon: ShoppingBag, show: user?.role === "User" },
    {
      href: "/admin",
      label: user?.role === "Admin" ? "Admin" : "Manage",
      icon: LayoutDashboard,
      show: user?.role === "User" || user?.role === "Admin",
    },
  ].filter((item) => item.show);

  const linkClass = (href: string) =>
    `nav-link ${pathname === href || pathname.startsWith(`${href}/`) ? "nav-link-active" : ""}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
            <Store size={20} />
          </span>
          <span>
            <span className="block text-xl font-black text-slate-950">
              SimpleShop
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Fresh picks, fast checkout
            </span>
          </span>
        </Link>

        <nav className="hidden items-center justify-end gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          {user ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                Hi, {user.fullName || user.email}
              </span>

              <button onClick={logout} className="btn-secondary px-3 py-2">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                <LogIn size={16} />
                Login
              </Link>

              <Link href="/register" className="btn-primary px-3 py-2">
                <UserPlus size={16} />
                Register
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn-secondary px-3 py-2 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-3 shadow-lg backdrop-blur lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            {user ? (
              <>
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                  Hi, {user.fullName || user.email}
                </div>
                <button onClick={logout} className="btn-secondary justify-start px-3 py-2">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={linkClass("/login")}>
                  <LogIn size={16} />
                  Login
                </Link>
                <Link href="/register" className="btn-primary justify-start px-3 py-2">
                  <UserPlus size={16} />
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
