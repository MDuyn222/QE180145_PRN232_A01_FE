
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    },
    {
      id: "products",
      title: "Total products",
      value: stats.totalProducts,
    },
    {
      id: "active-products",
      title: "Active products",
      value: stats.activeProducts,
    },
  ];

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Admin dashboard</h1>

      {loading && (
        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            {dashboardCards.map((card) => (
              <div key={card.id} className="card">
                <p className="text-slate-500">{card.title}</p>

                <p className="mt-2 text-4xl font-bold">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="btn-primary"
              href="/admin/categories"
            >
              Manage categories
            </Link>

            <Link
              className="btn-primary"
              href="/admin/products"
            >
              Manage products
            </Link>
          </div>
        </>
      )}
    </>
  );
}

