"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(pathname === "/admin/login");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="soft-card mx-auto mt-10 max-w-md py-12 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-teal-100" />
        <p className="font-semibold text-slate-700">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
