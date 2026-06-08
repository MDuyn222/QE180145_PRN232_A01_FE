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
      router.replace("/admin/login");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return <div className="py-16 text-center">Checking authentication...</div>;
  }

  return <>{children}</>;
}
