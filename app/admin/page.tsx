
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderTree, LayoutDashboard, Package, PackageCheck, ShieldCheck } from "lucide-react";
import { api, Product } from "@/lib/api";

type DashboardStats = {
  totalCategories: number;
  totalProducts: number;
  activeProducts: number;
};

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCategories: 0,
    totalProducts: 0,
    activeProducts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoriesResponse, productsResponse] = await Promise.all([
          api.get("/api/categories/all"),
          api.get<Product[]>("/api/products/all"),
        ]);

        const products = productsResponse.data;

        setStats({
          totalCategories: categoriesResponse.data.length,
          totalProducts: products.length,
          activeProducts: products.filter((product) => product.isActive).length,
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(
          "Không thể tải dữ liệu dashboard. Vui lòng đăng nhập lại hoặc kiểm tra backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const dashboardCards = [
    {
      id: "categories",
      title: "Total categories",
      value: stats.totalCategories,
      icon: FolderTree,
    },
    {
      id: "products",
      title: "Total products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      id: "active-products",
      title: "Active products",
      value: stats.activeProducts,
      icon: PackageCheck,
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Back office</p>
          <h1 className="section-title mt-2">Management dashboard</h1>
          <p className="muted mt-2">
            Monitor catalog status and manage store data from one place.
          </p>
        </div>
      </div>

      {loading && (
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card h-32 animate-pulse">
              <div className="h-5 w-1/2 rounded bg-slate-200" />
              <div className="mt-4 h-10 w-20 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            {dashboardCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.id} className="card hover:-translate-y-1 hover:border-teal-100">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-500">{card.title}</p>
                    <span className="icon-chip">
                      <Icon size={22} />
                    </span>
                  </div>

                  <p className="mt-4 text-4xl font-black text-slate-950">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card">
              <div className="mb-5 flex items-center gap-3">
                <span className="icon-chip bg-slate-100 text-slate-700">
                  <LayoutDashboard size={22} />
                </span>
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Catalog shortcuts
                  </h2>
                  <p className="muted">
                    Create, update, and deactivate catalog data.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="btn-primary" href="/admin/categories">
                  Manage categories
                  <ArrowRight size={18} />
                </Link>

                <Link className="btn-secondary" href="/admin/products">
                  Manage products
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="card bg-slate-950 text-white">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-white/10 p-3 text-teal-200">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <h2 className="text-xl font-black">Access control</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    User and admin views are separated through authenticated
                    role-based navigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
